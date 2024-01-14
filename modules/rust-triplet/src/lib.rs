use wasm_bindgen::prelude::*;

mod shape_plane;
mod get_best_triplet;
mod triplet;
mod build_triplet;
mod component_labelling;
mod get_random_shape_plane;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    pub fn log(s: &str);

    #[wasm_bindgen(js_namespace = console)]
    pub fn error(s: &str);
}