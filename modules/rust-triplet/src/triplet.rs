use wasm_bindgen::prelude::*;

use crate::shape_plane::ShapePlane;

#[wasm_bindgen]
#[derive(Clone, Copy)]
pub struct TripletErrorScore {
    pub sp1: f32,
    pub sp2: f32,
    pub sp3: f32
}

impl TripletErrorScore {
    pub fn new(sp1: f32, sp2: f32, sp3: f32) -> Self {
        Self { sp1, sp2, sp3 }
    }
}

#[wasm_bindgen]
impl TripletErrorScore {
    pub fn sum(&self) -> f32 {
        self.sp1 + self.sp2 + self.sp3
    }
}
impl Default for TripletErrorScore {
    fn default() -> Self {
        Self { sp1: 0.0, sp2: 0.0, sp3: 0.0 }
    }
}

#[wasm_bindgen]
#[derive(Clone)]
pub struct Triplet {
    volume: Vec<i32>,
    pub w: usize,
    pub h: usize,
    pub d: usize,
    pub error_score: TripletErrorScore
}

impl Triplet {
    pub fn new(volume: Vec<i32>, w: usize, h: usize, d: usize) -> Self {
        Self { volume, w, h, d, error_score: Default::default() }
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

        self.error_score.sp1 = calc_shape_plane_error(sp1.values(), &sp1_shadow_plane);
        self.error_score.sp2 = calc_shape_plane_error(sp2.values(), &sp2_shadow_plane);
        self.error_score.sp3 = calc_shape_plane_error(sp3.values(), &sp3_shadow_plane);
    }
}

#[wasm_bindgen]
impl Triplet {
    pub fn get_js_volume(&self) -> js_sys::Int32Array {
        js_sys::Int32Array::from(&self.volume[..])
    }
}

fn calc_shape_plane_error(v1: &Vec<i32>, v2: &Vec<i32>) -> f32 {
    let mut acc_error: i32 = 0;

    for i in 0..v1.len() {
        if v1[i] != v2[i] {
            acc_error += 1;
        }
    }

    return acc_error as f32 / v1.len() as f32;
}