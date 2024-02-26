use rand::Rng;
use wasm_bindgen::prelude::*;

use crate::{component_labelling::get_triplet_components, get_best_triplet::ConnectednessOptions, shape_plane::ShapePlane};

#[wasm_bindgen]
#[derive(Clone)]
pub struct Triplet {
    volume: Vec<i32>,
    pub w: usize,
    pub h: usize,
    pub d: usize,
    error: [Vec<i32>; 3]
}

impl Triplet {
    pub fn new(volume: Vec<i32>, w: usize, h: usize, d: usize) -> Self {
        Self { volume, w, h, d, error: Default::default() }
    }

    pub fn volume_mut(&mut self) -> &mut Vec<i32> {
        &mut self.volume
    }

    pub fn volume(&self) -> &Vec<i32> {
        &self.volume
    }

    pub fn get_value(&self, i: usize, j: usize, k: usize) -> i32 {
        self.volume[i + self.w * (j + self.h * k)]
    }

    pub fn calc_error(&mut self, sp1: &ShapePlane, sp2: &ShapePlane, sp3: &ShapePlane) {
        let mut sp1_shadow_plane: Vec<i32> = vec![0; sp1.values().len()];
        let mut sp2_shadow_plane: Vec<i32> = vec![0; sp2.values().len()];
        let mut sp3_shadow_plane: Vec<i32> = vec![0; sp3.values().len()];

        for i in 0..self.w {
            for j in 0..self.h {
                for k in 0..self.d {
                    let v = self.volume[i + self.w * (j + self.h * k)];

                    // TODO: these are probably not the right triplet.dims[], works rn because we assume square and same dimension shape planes
                    if v > 0 {
                        sp1_shadow_plane[(self.w - j - 1) * self.w + i] = 1;
                        sp2_shadow_plane[k * self.h + i] = 1;
                        sp3_shadow_plane[(self.w - j - 1) * self.w + self.h - k - 1] = 1;
                    }
                }
            }
        }

        calc_shape_plane_error(sp1.values(), &sp1_shadow_plane, &mut self.error[0]);
        calc_shape_plane_error(sp2.values(), &sp2_shadow_plane, &mut self.error[1]);
        calc_shape_plane_error(sp3.values(), &sp3_shadow_plane, &mut self.error[2]);
    }

    pub fn get_error_sum(&self) -> i32 {
        (self.error[0].len() + self.error[1].len() + self.error[2].len()).try_into().unwrap()
    }

    pub fn swap_error_sp1_sp2(&mut self) {
        self.error.swap(0, 1);
    }

    pub fn rotate_error(&mut self, error_i: usize) {
        for index in 0..self.error[error_i].len() {
            let v = self.error[error_i][index];
            let j = v / self.w as i32;
            let i = v % self.w as i32;
            self.error[error_i][index] = (self.w as i32 - 1 - i) * self.h as i32 + j;
        }
    }

    fn get_cubes_on_outside(&self, cubes_outside: &mut Vec<(usize, usize, usize)>) {
        cubes_outside.clear();
    
        for i in 0..self.w {
            for j in 0..self.h {
                for k in 0..self.d {
                    if self.get_value(i, j, k) <= 0 { continue; }
    
                    'neighbors: for i_d in [-1i32, 1] {
                        for j_d in [-1i32, 1] {
                            for k_d in [-1i32, 1] {
                                let _i = (i as i32 + i_d) as usize;
                                let _j = (j as i32 + j_d) as usize;
                                let _k = (k as i32 + k_d) as usize;
                                // If there is at least one face exposed, we can select it
                                if _i >= self.w || _j >= self.h || _k >= self.d || 
                                   self.get_value(_i, _j, _k) <= 0 {
                                    cubes_outside.push((i, j, k));
                                    break 'neighbors;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    fn is_volume_connected(&self) -> bool {
        let mut labels: Vec<i32> = vec![0;self.volume().len()];
        let mut components: Vec<Vec<usize>> = Vec::new();
    
        get_triplet_components(self, &ConnectednessOptions::Volume, &mut labels, &mut components);

        components.len() == 1
    }

    pub fn get_edges_of_cube(&self, i: usize, j: usize, k: usize, enabled: bool) -> i32 {
        let t = j+1 < self.h && self.get_value(i, j+1, k) > 0;
        let b = j >= 1 && self.get_value(i, j-1, k) > 0;
        let r = i+1 < self.w && self.get_value(i+1, j, k) > 0;
        let l = i >= 1 && self.get_value(i-1, j, k) > 0;
        let f = k+1 < self.d && self.get_value(i, j, k+1) > 0;
        let c = k >= 1 && self.get_value(i, j, k-1) > 0; // back
        let tr = j+1 < self.h && i+1 < self.w && self.get_value(i+1, j+1, k) > 0;
        let tl = j+1 < self.h && i >= 1 && self.get_value(i-1, j+1, k) > 0;
        let tf = j+1 < self.h && k+1 < self.d && self.get_value(i, j+1, k+1) > 0;
        let tc = j+1 < self.h && k >= 1 && self.get_value(i, j+1, k-1) > 0;
        let br = j >= 1 && i+1 < self.w && self.get_value(i+1, j-1, k) > 0;
        let bl = j >= 1 && i >= 1 && self.get_value(i-1, j-1, k) > 0;
        let bf = j >= 1 && k+1 < self.d && self.get_value(i, j-1, k+1) > 0;
        let bc = j >= 1 && k >= 1 && self.get_value(i, j-1, k-1) > 0;
        let rf = i+1 < self.w && k+1 < self.d && self.get_value(i+1, j, k+1) > 0;
        let rc = i+1 < self.w && k >= 1 && self.get_value(i+1, j, k-1) > 0;
        let lf = i >= 1 && k+1 < self.d && self.get_value(i-1, j, k+1) > 0;
        let lc = i >= 1 && k >= 1 && self.get_value(i-1, j, k-1) > 0;
        
        fn count_edge(n: &mut i32, x: bool, y: bool, xy: bool) {
            if xy {
                if !x { *n+=1; }
                if !y { *n+=1; }
            }
            else if !x && !y { *n+=1; }
        }
        fn count_edge_empty(n: &mut i32, x: bool, y: bool, xy: bool) {
            if xy {
                if !x && !y { *n+=1; }
                else if x && y { *n+=1; }
            }
            else if x && y { *n+=1000; } // TODO different: Dirty dirty hack to disallow edge-contacts
            else if x || y { *n+=1; }
        }
        
        let mut n = 0;
        if enabled {
            count_edge(&mut n, t, r, tr);
            count_edge(&mut n, t, l, tl);
            count_edge(&mut n, t, f, tf);
            count_edge(&mut n, t, c, tc);
            count_edge(&mut n, b, r, br);
            count_edge(&mut n, b, l, bl);
            count_edge(&mut n, b, f, bf);
            count_edge(&mut n, b, c, bc);
            count_edge(&mut n, r, f, rf);
            count_edge(&mut n, r, c, rc);
            count_edge(&mut n, l, f, lf);
            count_edge(&mut n, l, c, lc);
        }
        else {
            count_edge_empty(&mut n, t, r, tr);
            count_edge_empty(&mut n, t, l, tl);
            count_edge_empty(&mut n, t, f, tf);
            count_edge_empty(&mut n, t, c, tc);
            count_edge_empty(&mut n, b, r, br);
            count_edge_empty(&mut n, b, l, bl);
            count_edge_empty(&mut n, b, f, bf);
            count_edge_empty(&mut n, b, c, bc);
            count_edge_empty(&mut n, r, f, rf);
            count_edge_empty(&mut n, r, c, rc);
            count_edge_empty(&mut n, l, f, lf);
            count_edge_empty(&mut n, l, c, lc);
        }

        n
    }
}

#[wasm_bindgen]
impl Triplet {
    pub fn get_js_volume(&self) -> js_sys::Int32Array {
        js_sys::Int32Array::from(&self.volume[..])
    }

    pub fn get_js_error(&self, i: usize) -> js_sys::Int32Array {
        js_sys::Int32Array::from(&self.error[i][..])
    }

    pub fn remove_cells_to_minimize_same_plane(&mut self, n: i32, plane_edge_weight_ratio: f32, weight_modifier: f32) -> i32 {
        // Record the number of cubes in a plane
        let mut i_plane: Vec<f32> = vec![0.0; self.w];
        let mut j_plane: Vec<f32> = vec![0.0; self.h];
        let mut k_plane: Vec<f32> = vec![0.0; self.d];

        let mut shadow_plane_i: Vec<i32> = vec![0; self.w*self.d]; // Probably not the right dimensions!
        let mut shadow_plane_j: Vec<i32> = vec![0; self.h*self.d];
        let mut shadow_plane_k: Vec<i32> = vec![0; self.w*self.h]; 

        for i in 0..self.w {
            for j in 0..self.h {
                for k in 0..self.d {
                    let v = self.volume[i + self.w * (j + self.h * k)];

                    if v == 0 { continue; }

                    shadow_plane_i[j * self.d + k] += 1;
                    shadow_plane_j[k * self.w + i] += 1;
                    shadow_plane_k[j * self.w + i] += 1;

                    i_plane[i] += 1.0;
                    j_plane[j] += 1.0;
                    k_plane[k] += 1.0;
                }
            }
        }

        let n_cells_shadow_i: f32 = shadow_plane_i.iter().filter(|&c| *c > 0).count() as f32;
        let n_cells_shadow_j: f32 = shadow_plane_j.iter().filter(|&c| *c > 0).count() as f32;
        let n_cells_shadow_k: f32 = shadow_plane_k.iter().filter(|&c| *c > 0).count() as f32;

        // Take all cubes that have a face exposed to the outside
        let mut cubes_outside: Vec<(usize, usize, usize)> = Vec::new();
        let mut possible_cubes: Vec<(usize, usize, usize)> = Vec::new();
        let mut acc_weights: Vec<f32> = Vec::new();
        let mut acc_weight: f32;
        let mut rng = rand::thread_rng();

        let mut n_cells_removed = 0;
        for _ in 0..n {
            cubes_outside.clear();
            possible_cubes.clear();
            acc_weights.clear();
            acc_weight = 0.0;

            self.get_cubes_on_outside(&mut cubes_outside);
            if cubes_outside.len() == 0 { break; }

            // For each of those, check if it is possible to remove
            // While the trip-let stays perfect and volume connected
            for (i,j,k) in &cubes_outside {
                if shadow_plane_k[j*self.w+i] == 1 || 
                   shadow_plane_i[j*self.d+k] == 1 ||
                   shadow_plane_j[k*self.w+i] == 1 {
                    continue;
                }

                let index = i + self.w * (j + self.h * k);
                let v = self.volume[index];
                self.volume[index] = 0;
                // Check if it is still volume-connected once removed
                if self.is_volume_connected() {
                    possible_cubes.push((*i,*j,*k));
                }
                self.volume[index] = v;
            }
            if possible_cubes.len() == 0 { break; }

            // Determine weights for each possible cell to remove
            for (i,j,k) in &possible_cubes {
                let plane_fill_ratio = (i_plane[*i] / n_cells_shadow_i +
                                             j_plane[*j] / n_cells_shadow_j +
                                             k_plane[*k] / n_cells_shadow_k) / 3.0;
                
                // Determine number of current edges, and number of edges once removed
                let e_old = self.get_edges_of_cube(*i, *j, *k, true); // [0-12]
                let e_new = self.get_edges_of_cube(*i, *j, *k, false); // [0-12]
                // TODO different: Dirty dirty hack to disallow edge-contacts
                if e_new < 100 {
                    let edges_ratio = (e_old-e_new+12) as f32 / 24.0;

                    // Both weight ratio's are between 0 and 1
                    let weight = (plane_edge_weight_ratio*edges_ratio+
                                    (1.0-plane_edge_weight_ratio)*plane_fill_ratio)
                                    .powf(weight_modifier);
                    
                    acc_weight += weight;
                }
                acc_weights.push(acc_weight);
            }

            if acc_weight == 0.0 { break; }

            // Randomly choose cube and remove from volume
            let r = rng.gen_range(0.0..acc_weight);
            for i in 0..acc_weights.len() {
                if acc_weights[i] > r {
                    let c = possible_cubes[i];
                    self.volume[c.0 + self.w * (c.1 + self.h * c.2)] = 0;
                    shadow_plane_k[c.1 * self.w + c.0] -= 1;
                    shadow_plane_i[c.1 * self.d + c.2] -= 1;
                    shadow_plane_j[c.2 * self.w + c.0] -= 1;

                    i_plane[c.0] -= 1.0;
                    j_plane[c.1] -= 1.0;
                    k_plane[c.2] -= 1.0;
                    n_cells_removed += 1;
                    break;
                }
            }
        }

        return n_cells_removed;

    }
}

fn calc_shape_plane_error(v1: &Vec<i32>, v2: &Vec<i32>, error_cells: &mut Vec<i32>) {
    error_cells.clear();
    for i in 0..v1.len() {
        if v1[i] != v2[i] {
            error_cells.push(i.try_into().unwrap());
        }
    }
}