use wasm_bindgen::prelude::*;

use crate::shape_plane::ShapePlane;

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
}

#[wasm_bindgen]
impl Triplet {
    pub fn get_js_volume(&self) -> js_sys::Int32Array {
        js_sys::Int32Array::from(&self.volume[..])
    }

    pub fn get_js_error(&self, i: usize) -> js_sys::Int32Array {
        js_sys::Int32Array::from(&self.error[i][..])
    }

    pub fn remove_cells_to_minimize_same_plane(&self, n: i32) {
        // Only allow this if triplet is perfect, e.g. has error score of 0
        if self.get_error_sum() > 0 { return; }

        let mut i_plane: Vec<i32> = vec![0; self.w];
        let mut j_plane: Vec<i32> = vec![0; self.h];
        let mut k_plane: Vec<i32> = vec![0; self.d];

        let mut shadow_plane_1: Vec<i32> = vec![0; self.w*self.h]; // Probably not the right dimensions!
        let mut shadow_plane_2: Vec<i32> = vec![0; self.w*self.d];
        let mut shadow_plane_3: Vec<i32> = vec![0; self.h*self.d];

        for i in 0..self.w {
            for j in 0..self.h {
                for k in 0..self.d {
                    let v = self.volume[i + self.w * (j + self.h * k)];

                    if v == 0 { continue; }

                    shadow_plane_1[j * self.w + i] += 1;
                    shadow_plane_2[j * self.d + k] += 1;
                    shadow_plane_3[k * self.w + i] += 1;

                    i_plane[i] += 1;
                    j_plane[j] += 1;
                    k_plane[k] += 1;
                }
            }
        }
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