use crate::{shape_plane::ShapePlane, get_best_triplet::ConnectednessOptions, triplet::Triplet, component_labelling::remove_smaller_components};

pub fn build_triplet(
    sp1: &ShapePlane, 
    sp2: &ShapePlane, 
    sp3: &ShapePlane, 
    connectedness: &ConnectednessOptions, 
    triplet: &mut Triplet
) {
    let sp1_empty: bool = sp1.values().iter().all(|&v| v == 0);
    let sp2_empty: bool = sp2.values().iter().all(|&v| v == 0);
    let sp3_empty: bool = sp3.values().iter().all(|&v| v == 0); 

    if sp1_empty && sp2_empty && sp3_empty {
        return;
    }

    // TODO: won't work if we want to support shape planes with different dimensions
    let dim = sp1.w;

    for i in 0..dim {
        for j in 0..dim {
            for k in 0..dim {
                let sp1_v = sp1.values()[(dim - j - 1) * sp1.w + i];
                let sp2_v = sp2.values()[k * sp2.w + i];
                let sp3_v = sp3.values()[(dim - j - 1) * sp3.w + dim - k - 1];

                let index = i + dim * (j + dim * k);

                if (sp1_v > 0 || sp1_empty) && (sp2_v > 0 || sp2_empty) && (sp3_v > 0 || sp3_empty) {
                    triplet.volume_mut()[index] = 1;
                }
                else {
                    triplet.volume_mut()[index] = 0;
                }
            }
        }
    }

    remove_smaller_components(triplet, connectedness);

    triplet.calc_error(sp1, sp2, sp3);
}