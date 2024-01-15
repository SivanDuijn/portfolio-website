use rand::{Rng, rngs::ThreadRng};
use wasm_bindgen::prelude::*;
use crate::{shape_plane::ShapePlane, log};

#[wasm_bindgen]
pub fn get_random_shape_planes(w: usize, h: usize, amount: usize) -> Vec<ShapePlane> {
    let mut sps: Vec<ShapePlane> = Vec::new();
    for i in 0..amount {
        sps.push(ShapePlane::new(vec![0;  w*h], w, h));
        get_initial(&mut sps[i]);
    }

    return sps;
}

#[wasm_bindgen]
pub fn get_random_shape_plane(w: usize, h: usize) -> ShapePlane {
    let mut sp: ShapePlane = ShapePlane::new(vec![0;  w*h], w, h);
    get_initial(&mut sp);
    return sp;
}

fn get_initial(sp: &mut ShapePlane) {
    let mut rng = rand::thread_rng();

    // Choose random cell at each edge
    let edge_cells: [[usize; 2]; 4] = [
        [rng.gen_range(0..sp.w), 0],
        [sp.w-1, rng.gen_range(0..sp.h)],
        [rng.gen_range(0..sp.w), sp.h-1],
        [0, rng.gen_range(0..sp.h)]
    ];

    // connect_edge_cells_random(edge_cells, sp, &mut rng);
    connect_edge_cells_walk(edge_cells, sp, &mut rng);
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
    connect_cells(last_cell, closest_cell, sp, rng);

}

// fn connect_edges_closest_manhatten(edge_cells: [[usize; 2]; 4], sp: &mut ShapePlane, rng: &mut ThreadRng) {
//     let mut not_connected: Vec<usize> = vec![0,1,2,3];
    
//     // Choose edge-cell randomly and connect it to the closest manhatten distance cell
//     let cell_a = edge_cells[not_connected.remove(rng.gen_range(0..=3))];
//     let mut min_dist: i32 = sp.w as i32 * sp.h as i32;
//     let mut closest_cell: usize = 0;
//     for edge_cell in &not_connected {
//         let cell = edge_cells[*edge_cell];
//         let dist = (cell_a[0] as i32-cell[0] as i32).abs() + (cell_a[1] as i32 -cell[1] as i32).abs();
//         if dist < min_dist {
//             min_dist = dist;
//             closest_cell = *edge_cell;
//         }
//     }

//     // Connect to closest cell
//     connect_cells(cell_a, edge_cells[closest_cell], sp, rng);
//     not_connected.remove(closest_cell);

//     // Connect the other two not yet connected edge cells to the closest cell in the shapeplane
//     let cell_to_connect = edge_cells[not_connected.remove(rng.gen_range(0..=1))];
//     min_dist = (cell_a[0] as i32-cell[0] as i32).abs() + (cell_a[1] as i32 -cell[1] as i32).abs();
//     closest_cell = 0;
    

// }

fn connect_cells(cell_a: [usize; 2], cell_b: [usize; 2], sp: &mut ShapePlane,  rng: &mut ThreadRng) {
    // randomly choose axis to traverse first
    // let axis = rng.gen_range(0..=1);

    for axis in 0..=1 {
        let mut start = cell_a[axis];
        let mut end = cell_b[axis];
        if end < start {
            let temp = start;
            start = end;
            end = temp;
        }
    
        // Set cells from cell a to cell b on the chosen axis
        for i in start..=end {
            if axis == 0 {
                sp.set_value(i, cell_a[1], 1);
            }
            else {
                sp.set_value(cell_b[0], i, 1);
            }
        }
    }



    // Do the same for the other axis, so cell a and cell b on the edges are connected
    // let other_axis = if axis == 0 {1} else {0};
    // start = cell_a[other_axis];
    // end = cell_b[other_axis];
    // if end < start {
    //     let temp = start;
    //     start = end;
    //     end = temp;
    // }

    // for i in start..=end {
    //     if other_axis == 0 {
    //         sp.set_value(i, cell_b[1], 1);
    //     }
    //     else {
    //         sp.set_value(cell_b[0], i, 1);
    //     }
    // }
}