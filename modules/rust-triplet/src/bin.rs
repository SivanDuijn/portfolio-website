use triplet_wasm_lib::{get_best_triplet::{get_best_triplet, ConnectednessOptions}, get_random_shape_plane::{get_random_shape_planes, ShapePlaneFillRandomness}};

pub fn main() {
    let n = 1000;
    for fp in [0.3, 0.35, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.80, 0.85] {    
        let mut avg_err = 0.0;
        let mut avg_corr = 0.0;
        for i in 0..n {
            let sps = get_random_shape_planes(30, 30, fp, ShapePlaneFillRandomness::Fully, 3);

            let r = get_best_triplet(&sps[0], &sps[1], &sps[2], ConnectednessOptions::Volume);
        
            match r {
                Ok(t) => {
                    let error = t.error_score.sp1 + t.error_score.sp2 + t.error_score.sp3;
                    avg_err += error;
                    if error == 0.0 { avg_corr += 1.0; }
                },
                Err(e) => println!("{}", e),
            }

            if i % 100 == 0 {println!("{}", i); }
        }

        println!("Fill percentage = {}", fp);
        println!("{}", format!("Average error = {}", avg_err / n as f32));
        println!("{}", format!("Average correct = {}", (avg_corr / n as f32) * 100.0));
    }

}