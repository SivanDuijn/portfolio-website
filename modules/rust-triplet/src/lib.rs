use wasm_bindgen::prelude::*;

pub mod shape_plane;
pub mod get_best_triplet;
pub mod triplet;
pub mod build_triplet;
pub mod component_labelling;
pub mod get_random_shape_plane;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    pub fn log(s: &str);

    #[wasm_bindgen(js_namespace = console)]
    pub fn error(s: &str);
}