use wasm_bindgen::prelude::*;

use crate::shape_plane::ShapePlane;

mod shape_plane;
mod get_best_triplet;
mod triplet;
mod build_triplet;
mod component_labelling;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    pub fn log(s: &str);

    #[wasm_bindgen(js_namespace = console)]
    pub fn error(s: &str);
}

#[wasm_bindgen]
pub fn test(sp: &ShapePlane) {
    log(&format!("Shapeplane with, {} {} {}", sp.w, sp.h, sp.values()[1]));
}

#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}