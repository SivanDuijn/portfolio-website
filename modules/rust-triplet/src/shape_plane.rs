use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone)]
pub struct ShapePlane {
    values: Vec<i32>,
    pub w: usize,
    pub h: usize
}
#[wasm_bindgen]
impl ShapePlane {
    #[wasm_bindgen(constructor)]
    pub fn new(values: Vec<i32>, w: usize, h: usize) -> Self {
        Self { values, w, h }
    }

    pub fn get_js_values(&self) -> js_sys::Int32Array {
        js_sys::Int32Array::from(&self.values[..])
    }
}

impl ShapePlane {
    pub fn values(&self) -> &Vec<i32> {
        &self.values
    }

    pub fn rotate90(&self) -> ShapePlane {
        let mut rotated_sp: ShapePlane = ShapePlane::new(vec![0; self.values.len()], self.h, self.w);

        for i in 0..self.w {
            for j in 0..self.h {
                let original_index = j * self.w + i;
                let rotated_index = i * self.h + (self.h - 1 - j);
                rotated_sp.values[rotated_index] = self.values[original_index];
            }
        }

        return rotated_sp;
    }

    pub fn get_all_90_rotations(&self) -> [Self; 4] {
        let rotated90 = self.rotate90();
        let rotated180 = rotated90.rotate90();
        let rotated270 = rotated180.rotate90();
        return [self.clone(), rotated90, rotated180, rotated270];
    }

    pub fn set_value(&mut self, i: usize, j: usize, value: i32) {
        self.values[j * self.w + i] = value;
    }
}