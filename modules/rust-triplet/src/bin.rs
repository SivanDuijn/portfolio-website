use std::{fs, io::{stdin, stdout, Write}};

use triplet_wasm_lib::{get_best_triplet::{get_best_triplet, ConnectednessOptions}, get_random_shape_plane::{get_random_shape_planes, ShapePlaneFillRandomness}};

const FILL_PERCENTAGES: [f32; 11] = [0.3, 0.35, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.80, 0.85];
// const GRID_SIZES: [i32; 2] = [5, 8];
const GRID_SIZES: [i32; 5] = [14, 18, 22, 26, 30];

pub fn main() {
    let mut answer = get_user_input("Which randomness to use? [Fully, Weighted]");

    let mut randomness = ShapePlaneFillRandomness::NeighborWeighted;
    if answer == "Fully" || answer == "fully" || answer == "F" || answer == "f" {
        randomness = ShapePlaneFillRandomness::Fully;
    }

    answer = get_user_input("Gridsize? [a number, all]");
    if answer == "all" {
        // run all and output csv text
        let mut results: Vec<(Vec<f32>, Vec<f32>)> = Vec::new();
        for gridsize in GRID_SIZES {
            results.push(run_all_percentages(randomness, gridsize));
        }

        let mut s = String::new();
        let r;
        if randomness == ShapePlaneFillRandomness::Fully {
            r = "FR";
        }
        else {
            r = "NW";
        }

        for gridsize in GRID_SIZES {
            s += &format!("{}_error_{} ", r, gridsize);
        }
        for fp_i in 0..FILL_PERCENTAGES.len() {
            s += "\n";
            for g_i in 0..GRID_SIZES.len() {
                s += &results[g_i].0[fp_i].to_string();
                s += " ";
            }
        }
        
        s += "\n\n";
        for gridsize in GRID_SIZES {
            s += &format!("{}_perc_{} ", r, gridsize);
        }
        for fp_i in 0..FILL_PERCENTAGES.len() {
            s += "\n";
            for g_i in 0..GRID_SIZES.len() {
                s += &results[g_i].1[fp_i].to_string();
                s += " ";
            }
        }

        println!("{}", s);
        let _ = fs::write(&format!("{}_results.txt", r), s);

        return;
    }
    // Try parsing
    let gridsize: i32 = answer.parse().unwrap_or(14);

    let (averages_err, averages_corr) = run_all_percentages(randomness, gridsize);
    for err in &averages_err {
        println!("{}", format!("{}", err));
    }
    println!("");
    for err in &averages_corr {
        println!("{}", format!("{}", err));
    }

    
}

fn run_all_percentages(randomness: ShapePlaneFillRandomness, gridsize: i32) -> (Vec<f32>, Vec<f32>) {
    println!("{}", &format!("\nRunning with following parameters: \nRandomness: {}\nGridsize: {}", 
        if randomness == ShapePlaneFillRandomness::Fully {"Fully"} else {"Weighted neighbors"}, gridsize));

    let n = 4000;
    let mut averages_err: Vec<f32> = Vec::new();
    let mut averages_corr: Vec<f32> = Vec::new();
    for fp in FILL_PERCENTAGES {    
        let mut avg_err = 0.0;
        let mut avg_corr = 0.0;
        for i in 0..n {
            let sps = get_random_shape_planes(gridsize as usize, gridsize as usize, fp, randomness, 3);

            let r = get_best_triplet(&sps[0], &sps[1], &sps[2], ConnectednessOptions::Volume);
        
            match r {
                Ok(t) => {
                    let error = t.get_error_sum();
                    if error == 0 { avg_corr += 100.0; }
                    avg_err += error as f32 / (t.w*t.w) as f32; // ONLY WORKS FOR SQUARE SHAPE PLANES
                },
                Err(e) => println!("{}", e),
            }

            if i % 1000 == 0 { print!("."); }
            let _ = stdout().flush();
        }

        print!("-");
        let _ = stdout().flush();

        averages_err.push(avg_err / (n as f32));
        averages_corr.push(avg_corr / (n as f32));
    }
    println!("");

    return (averages_err, averages_corr);
}

fn get_user_input(message: &str) -> String {
    let mut s=String::new();
    println!("{}", message);
    let _ = stdout().flush();
    stdin().read_line(&mut s).expect("Please enter something");
    if let Some('\n')=s.chars().next_back() {
        s.pop();
    }
    if let Some('\r')=s.chars().next_back() {
        s.pop();
    }

    return s;
}