use wasm_bindgen::prelude::*;
use crate::{shape_plane::ShapePlane, triplet::Triplet, build_triplet::build_triplet};

#[wasm_bindgen]
#[derive(PartialEq)]
pub enum ConnectednessOptions {
    Volume,
    Edge,
    Vertex
}

#[wasm_bindgen]
pub fn get_best_triplet(
    sp1: &ShapePlane, 
    sp2: &ShapePlane, 
    sp3: &ShapePlane, 
    connectedness: ConnectednessOptions
) -> Result<Triplet, String> {
    // For now, shape planes must be square and have the same dimensions!!
    if !(sp1.w == sp1.h && sp1.w == sp2.w && sp1.w == sp3.w && sp1.h == sp2.h && sp1.h == sp3.h) {
        return Err("Input shape plane dimensions are not the same or not square".to_string())
    }

    let mut triplet: Triplet = Triplet::new(vec![0; sp1.w*sp1.w*sp1.w], sp1.w, sp1.w, sp1.w);

    let mut best_triplet = triplet.clone();

    let mut min_error: i32 = i32::MAX;

    let sp1_rotations: [ShapePlane; 4] = sp1.get_all_90_rotations();
    let sp2_rotations: [ShapePlane; 4] = sp2.get_all_90_rotations();
    let sp3_rotations: [ShapePlane; 4] = sp3.get_all_90_rotations();

    let mut sp1_rot = 0;
    let mut sp2_rot = 0;
    let mut sp3_rot = 0;

    'outer: for sp1_rot_i in 0..4 {
        for sp2_rot_i in 0..4 {
            for sp3_rot_i in 0..4 {
                build_triplet(
                    &sp1_rotations[sp1_rot_i], 
                    &sp2_rotations[sp2_rot_i], 
                    &sp3_rotations[sp3_rot_i], 
                    &connectedness, 
                    &mut triplet);
                let mut error_sum = triplet.get_error_sum();
                if error_sum < min_error {
                    sp1_rot = sp1_rot_i;
                    sp2_rot = sp2_rot_i;
                    sp3_rot = sp3_rot_i;
                    if error_sum == 0 {
                        best_triplet = triplet;
                        break 'outer;
                    }

                    min_error = error_sum;
                    best_triplet = triplet.clone();
                }

                build_triplet(
                    &sp2_rotations[sp2_rot_i], 
                    &sp1_rotations[sp1_rot_i], 
                    &sp3_rotations[sp3_rot_i], 
                    &connectedness, 
                    &mut triplet);
                error_sum = triplet.get_error_sum();
                if error_sum < min_error {
                    // Swap error scores because input planes are swapped as well
                    triplet.swap_error_sp1_sp2();
                    sp1_rot = sp1_rot_i;
                    sp2_rot = sp2_rot_i;
                    sp3_rot = sp3_rot_i;

                    if error_sum == 0 {
                        best_triplet = triplet;
                        break 'outer;
                    }

                    min_error = error_sum;
                    best_triplet = triplet.clone();
                }
            }
        }
    }

    // Rotate error cells
    for _ in 1..=sp1_rot {
        best_triplet.rotate_error(0);
    }
    for _ in 1..=sp2_rot {
        best_triplet.rotate_error(1);
    }
    for _ in 1..=sp3_rot {
        best_triplet.rotate_error(2);
    }

    return Ok(best_triplet);
}