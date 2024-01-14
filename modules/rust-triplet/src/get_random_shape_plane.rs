use rand::{Rng, rngs::ThreadRng};
use wasm_bindgen::prelude::*;
use crate::shape_plane::ShapePlane;

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
    let mut not_connected: Vec<usize> = vec![0,1,2,3];
    let mut connected: Vec<usize> = Vec::new();

    // Choose cell at edge to connect to other edge
    let cell_a = not_connected.remove(rng.gen_range(0..=3));
    let cell_b = not_connected.remove(rng.gen_range(0..=2));
    connect_cells(edge_cells[cell_a], edge_cells[cell_b], sp, &mut rng);
    connected.push(cell_a); 
    connected.push(cell_b);

    // Pick cell which is not yet connected, and connect it to one of the connected cells
    let cell_c = not_connected.remove(rng.gen_range(0..=1));
    let conn_cell = connected[rng.gen_range(0..=1)];
    connect_cells(edge_cells[cell_c], edge_cells[conn_cell], sp, &mut rng);
    connected.push(cell_c);

    // Connect the last unconnected cell
    let cell_d = not_connected[0];
    let conn_cell = connected[rng.gen_range(0..=2)];
    connect_cells(edge_cells[cell_d], edge_cells[conn_cell], sp, &mut rng);
}

// TODO: can probably be optimized by not randomly choosing axis, switching cell a b has same effect and those are already random
fn connect_cells(cell_a: [usize; 2], cell_b: [usize; 2], sp: &mut ShapePlane,  rng: &mut ThreadRng) {
    // randomly choose axis to traverse first
    let axis = rng.gen_range(0..=1);
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
            sp.set_value(cell_a[0], i, 1);
        }
    }

    // Do the same for the other axis, so cell a and cell b on the edges are connected
    let other_axis = if axis == 0 {1} else {0};
    start = cell_a[other_axis];
    end = cell_b[other_axis];
    if end < start {
        let temp = start;
        start = end;
        end = temp;
    }

    for i in start..=end {
        if other_axis == 0 {
            sp.set_value(i, cell_b[1], 1);
        }
        else {
            sp.set_value(cell_b[0], i, 1);
        }
    }
}