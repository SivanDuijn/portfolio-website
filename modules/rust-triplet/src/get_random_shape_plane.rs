use std::collections::{HashSet, HashMap};

use rand::{Rng, rngs::ThreadRng};
use wasm_bindgen::prelude::*;
use crate::{shape_plane::ShapePlane, component_labelling::is_edge_connected, log};

#[wasm_bindgen]
#[derive(PartialEq)]
pub enum ShapePlaneFillRandomness {
    Fully,
    OptimalEdgesConnect,
    NeighborWeighted
}

#[wasm_bindgen]
pub fn get_random_shape_planes(w: usize, h: usize, fill_percentage: f32, randomness: ShapePlaneFillRandomness, amount: usize) -> Vec<ShapePlane> {
    let target_n_enabled_cells = (fill_percentage.min(1.0).max(0.0) * (w * h) as f32).ceil() as i32;

    let mut sps: Vec<ShapePlane> = Vec::new();
    let mut rng = rand::thread_rng();
    for i in 0..amount {
        sps.push(ShapePlane::new(vec![0;  w*h], w, h));
        let edge_cells = get_initial(&mut sps[i], &mut rng);
        
        match randomness {
            ShapePlaneFillRandomness::Fully => {
                if fill_percentage >= 0.3 {
                    let mut n = 0;
                    loop {
                        randomly_add_cells(&mut sps[i], target_n_enabled_cells, &mut rng);
                        if is_edge_connected(&sps[i]) { break; }

                        sps[i] = ShapePlane::new(vec![0; w*h], w, h);
                        get_initial(&mut sps[i], &mut rng);
                        n += 1;
                        if n == 100000 { break; }
                    }
                }
            }
            ShapePlaneFillRandomness::OptimalEdgesConnect => {
                connect_edge_cells_walk(edge_cells, &mut sps[i], &mut rng);
                randomly_add_cells(&mut sps[i], target_n_enabled_cells, &mut rng);
            }
            ShapePlaneFillRandomness::NeighborWeighted => {
                connect_edge_cells_walk(edge_cells, &mut sps[i], &mut rng);
                randomly_add_cells_neighbor_weighted(&mut sps[i], target_n_enabled_cells, &mut rng);
            }
        }
    }

    // Calculate min, max, and average fill percentage
    // let mut min: f32 = (w * h) as f32;
    // let mut max: f32 = 0.0;
    // let mut average:f32 = 0.0;
    // for sp in &sps {
    //     let n_enabled = sp.values().iter().filter(|&v| *v > 0).count() as f32;
    //     min = n_enabled.min(min);
    //     max = n_enabled.max(max);
    //     average += n_enabled;
    // }

    // log(&format!("amount: {}, min: {}, max: {}, average: {}", amount, min / (w*h) as f32, max / (w*h) as f32, average / (w*h*amount) as f32));

    return sps;
}

#[wasm_bindgen]
pub fn get_random_shape_plane(w: usize, h: usize, fill_percentage: f32, randomness: ShapePlaneFillRandomness) -> ShapePlane {
    let target_n_enabled_cells = (fill_percentage.min(1.0) * (w * h) as f32).floor() as i32;

    let mut sp: ShapePlane = ShapePlane::new(vec![0;  w*h], w, h);
    let mut rng = rand::thread_rng();
    let edge_cells = get_initial(&mut sp, &mut rng);
    match randomness {
        ShapePlaneFillRandomness::Fully => {}
        ShapePlaneFillRandomness::OptimalEdgesConnect => {
            connect_edge_cells_walk(edge_cells, &mut sp, &mut rng);
            randomly_add_cells(&mut sp, target_n_enabled_cells, &mut rng);
        }
        ShapePlaneFillRandomness::NeighborWeighted => {
            connect_edge_cells_walk(edge_cells, &mut sp, &mut rng);
            randomly_add_cells_neighbor_weighted(&mut sp, target_n_enabled_cells, &mut rng);
        }
    }
    return sp;
}

fn get_initial(sp: &mut ShapePlane, rng: &mut ThreadRng) -> [[usize; 2]; 4] {
    // Choose random cell at each edge
    let edge_cells: [[usize; 2]; 4] = [
        [rng.gen_range(0..sp.w), 0],
        [sp.w-1, rng.gen_range(0..sp.h)],
        [rng.gen_range(0..sp.w), sp.h-1],
        [0, rng.gen_range(0..sp.h)]
    ];

    for [i,j] in edge_cells {
        sp.set_value(i, j, 1);
    }

    return edge_cells;
}

/// Connect edge cells by walking from one edge cell into the the grid and connect the edge cells on the side
/// the last opposite cell gets connected to the closest cell
fn connect_edge_cells_walk(edge_cells: [[usize; 2]; 4], sp: &mut ShapePlane, rng: &mut ThreadRng) {
    // Pick random axis
    let axis = rng.gen_bool(0.5);
    // Pick random direction
    let dir = if rng.gen_bool(0.5) {1} else {-1};
    let delta: [i32; 2] = [(!axis as i32) * dir, (axis as i32) * dir]; 
    let start_cell: usize;
    let others: Vec<usize>;
    if delta[0] != 0 {
        if delta[0] == 1 {
            start_cell = 3;
            others = vec![0,2,1];
        }
        else {
            start_cell = 1;
            others = vec![0,2,3];
        }
    }
    else {
        if delta[1] == 1 {
            start_cell = 0;
            others = vec![1,3,2];
        }
        else {
            start_cell = 2;
            others = vec![1,3,0];
        }
    }

    let mut cell: [usize; 2] = edge_cells[start_cell];
    let mut other_cells_connected = 0;
    let mut on_cells: Vec<[usize; 2]> = Vec::new();
    'outer: loop {
        sp.set_value(cell[0], cell[1], 1);
        on_cells.push(cell);

        // TODO: can be optimized by not checking already connected others
        for other_i in 0..=1 {
            if edge_cells[others[other_i]][axis as usize] == cell[axis as usize] {
                // Traverse to this other cell, then continue
                let mut start = cell[!axis as usize];
                let mut end = edge_cells[others[other_i]][!axis as usize];
                if end < start {
                    let temp = start;
                    start = end;
                    end = temp;
                }
                for i in start..=end {
                    if axis { 
                        sp.set_value(i, cell[1], 1);
                        on_cells.push([i, cell[1]]);
                    }
                    else { 
                        sp.set_value(cell[0], i, 1);
                        on_cells.push([cell[0], i]);
                    }
                }
    
                other_cells_connected += 1;
                if other_cells_connected == 2 { break 'outer; }
            }
        }

        cell[0] = (cell[0] as i32 + delta[0]) as usize;
        cell[1] = (cell[1] as i32 + delta[1]) as usize;
    }

    // Find closest cell in sp values to the last cell
    let last_cell = edge_cells[others[2]];
    let mut min_dist: i32 = sp.w as i32 * sp.h as i32;
    let mut closest_cell: [usize; 2] = [0, 0];
    for on_cell in on_cells {
        let dist = (last_cell[0] as i32 - on_cell[0] as i32).abs() + (last_cell[1] as i32 - on_cell[1] as i32).abs();
        if dist < min_dist {
            min_dist = dist;
            closest_cell = on_cell;
        }
    }

    // Connect the closest_cell to the last_cell
    for axis in 0..=1 {
        let mut start = last_cell[axis];
        let mut end = closest_cell[axis];
        if end < start {
            let temp = start;
            start = end;
            end = temp;
        }

        // Set cells from cell a to cell b on the chosen axis
        for i in start..=end {
            if axis == 0 {
                sp.set_value(i, last_cell[1], 1);
            }
            else {
                sp.set_value(closest_cell[0], i, 1);
            }
        }
    }

}

/// Randomly add cells that are neighbors of enabled cells
/// The weight for a neighbor to be chosen depends on the number of adjacent enabled cells
fn randomly_add_cells_neighbor_weighted(sp: &mut ShapePlane, target_n_enabled_cells: i32, rng: &mut ThreadRng) {
    let weight_modifier = 3;

    fn get_number_of_enabled_neighbors(sp: &mut ShapePlane, i: usize, j: usize) -> i32 {
        let mut n = 0;
        if i + 1 < sp.w && sp.get_value(i+1, j) > 0 { n+=1; }
        if i > 0 &&        sp.get_value(i-1, j) > 0 { n+=1; }
        if j + 1 < sp.h && sp.get_value(i, j+1) > 0 { n+=1; }
        if j > 0 &&        sp.get_value(i, j-1) > 0 { n+=1; }
        return n;
    }

    // Determine all neighbors of currently enabled cells
    let mut neighbors_map: HashMap<(usize, usize), i32> = HashMap::new();

    // let mut neighbors_set: HashSet<(usize, usize)> = HashSet::new();
    let mut n_enabled_cells = 0;
    for i in 0..sp.w {
        for j in 0..sp.h {
            if sp.get_value(i, j) > 0 {
                n_enabled_cells += 1;
            }
            else {
                let n = get_number_of_enabled_neighbors(sp, i, j);
                if n > 0 {
                    neighbors_map.insert((i, j), n.pow(weight_modifier));
                }
            }
        }
    }

    while n_enabled_cells < target_n_enabled_cells &&
          n_enabled_cells < (sp.w * sp.h) as i32 {
        
        //Create vector with all neighbors, with weights depending on the number of neighbors
        let mut neighbors_vec: Vec<(usize, usize, i32)> = Vec::new();
        let mut accumulated_probability: i32 = 0;
        for ((n_i, n_j), probability) in &neighbors_map {
            accumulated_probability += *probability;
            neighbors_vec.push((*n_i,* n_j, accumulated_probability));
        }

        
        // Enable randomly chosen (weighted) neighbor
        let r = rng.gen_range(0..accumulated_probability);
        let mut n = neighbors_vec[0];
        for i in 0..neighbors_vec.len() {
            if neighbors_vec[i].2 > r {
                n = neighbors_vec[i];
                break;
            }
        }

        
        
        let (i,j, _) = n;
        sp.set_value(i, j, 1);
        neighbors_map.remove(&(i, j));
        n_enabled_cells+=1;
        
        // Add the neighbors of the newly enabled cell
        for (n_i, n_j) in [(i+1, j),(i-1, j),(i, j+1), (i, j-1)] {
            // Stay within range and not already enabled
            if n_i < sp.w && n_j < sp.h && 
               sp.get_value(n_i, n_j) == 0 { 
                let n = get_number_of_enabled_neighbors(sp, n_i, n_j);
                neighbors_map.insert((n_i, n_j), n.pow(weight_modifier)); 
            }
        }
    }
}


/// Randomly add cells that are neighbors of enabled cells, uniformly sampled
fn randomly_add_cells(sp: &mut ShapePlane, target_n_enabled_cells: i32, rng: &mut ThreadRng) {
    // Determine all neighbors of currently enabled cells
    let mut neighbors_set = HashSet::new();
    let mut n_enabled_cells = 0;
    for i in 0..sp.w {
        for j in 0..sp.h {
            if sp.get_value(i, j) > 0 {
                n_enabled_cells += 1;
            }
            else if i + 1 < sp.w && sp.get_value(i+1, j) == 1 { neighbors_set.insert((i, j)); }
            else if i > 0        && sp.get_value(i-1, j) == 1 { neighbors_set.insert((i, j)); }
            else if j + 1 < sp.h && sp.get_value(i, j+1) == 1 { neighbors_set.insert((i, j)); }
            else if j > 0        && sp.get_value(i, j-1) == 1 { neighbors_set.insert((i, j)); }
        }
    }
    
    let mut neighbors_vec = Vec::from_iter(neighbors_set.clone());

    while n_enabled_cells < target_n_enabled_cells &&
          n_enabled_cells < (sp.w * sp.h) as i32 {
        
        // Enable randomly chosen neighbor
        let (i,j) = neighbors_vec.swap_remove(rng.gen_range(0..neighbors_vec.len()));
        neighbors_set.remove(&(i, j));
        sp.set_value(i, j, 1);
        n_enabled_cells+=1;

        for (n_i, n_j) in [(i+1, j),(i-1, j),(i, j+1), (i, j-1)] {
            if n_i >= sp.w || n_j >= sp.h || sp.get_value(n_i, n_j) > 0 || neighbors_set.contains(&(n_i, n_j)) { continue;  }
            neighbors_set.insert((n_i, n_j)); 
            neighbors_vec.push((n_i, n_j));
        }
    }
}

