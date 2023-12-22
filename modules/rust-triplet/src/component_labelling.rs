use std::collections::VecDeque;

use crate::{triplet::Triplet, get_best_triplet::ConnectednessOptions};

/// Alters the triplet in such a way that only the largest component is left.
/// Removes all other components that are smaller (or the same size, only one will be left)
/// 
/// * `connectedness` - Check for connecteness for either volume, edge or vertex. Volume means faces need to be connected, edge means edges ...
/// 
pub fn remove_smaller_components(triplet: &mut Triplet, connectedness: &ConnectednessOptions) {
    let (_, components) = get_triplet_components(triplet, connectedness);

    let (_, largest_component_index) = components.iter()
        .enumerate()
        .fold((0, 0), |(largest_size, largest_index), (i, c)| {
        if c.len() > largest_size {
            return (c.len(), i);
        }
        (largest_size, largest_index)
    });

    components.iter().enumerate().for_each(|(i, c)|  {
        if i == largest_component_index {
            return;
        }
        c.iter().for_each(|&index| {
            triplet.volume_mut()[index] = 0;
        }) 
    });
}

/// Returns an array containing labels for each voxel and a list of indices for each component.
///
/// # Arguments
/// * `triplet` - Reference to a triplet
/// * `connectedness` - Check for connecteness for either volume, edge or vertex. Volume means faces need to be connected, edge means edges ...
pub fn get_triplet_components(triplet: &Triplet, connectedness: &ConnectednessOptions) 
    -> (Vec<i32>, Vec<Vec<usize>>) 
{
    let mut labels: Vec<i32> = vec![0;triplet.volume().len()];
    let mut current_label = 1;

    // Store the indices of each component
    let mut components: Vec<Vec<usize>> = Vec::new();
    for i in 0..triplet.w {
        for j in 0..triplet.h {
            for k in 0..triplet.d {
                let index = i + triplet.w * (j + triplet.h * k);

                // If a voxel is on and not labeled yet, do depth first search for neighboring voxels and label them as well
                if triplet.volume()[index] > 0 && labels[index] == 0 {
                    let mut component_indices: Vec<usize> = Vec::new();
                    dfs_queue(triplet, &mut labels, i, j, k, current_label, &mut component_indices, connectedness);
                    
                    // Add the indices of this component to the list of indices
                    components.push(component_indices);
                    current_label += 1;
                }

            }
        }
    }

    return (labels, components);
}

pub fn dfs_queue(
    triplet: &Triplet,
    labels: &mut Vec<i32>,
    i: usize,
    j: usize,
    k: usize,
    current_label: i32,
    component_indices: &mut Vec<usize>,
    connectedness: &ConnectednessOptions) 
{
    let mut queue: VecDeque<(usize, usize, usize)> = VecDeque::new();
    queue.push_back((i,j,k));
    
    while let Some((i,j,k)) = queue.pop_front() {
        let index = i + triplet.w * (j + triplet.h * k);

        if  i < triplet.w && // Out of bounds checks
            j < triplet.h &&
            k < triplet.d && 
            triplet.volume()[index] > 0 &&
            labels[index] == 0 
        {
            labels[index] = current_label;
            component_indices.push(index);

            queue.push_back((i+1, j, k));
            queue.push_back((i-1, j, k));
            queue.push_back((i, j+1, k));
            queue.push_back((i, j-1, k));
            queue.push_back((i, j, k+1));
            queue.push_back((i, j, k-1));

            if *connectedness == ConnectednessOptions::Edge || *connectedness == ConnectednessOptions::Vertex {
                queue.push_back((i+1, j+1, k));
                queue.push_back((i+1, j, k+1));
                queue.push_back((i, j+1, k+1));
                queue.push_back((i-1, j-1, k));
                queue.push_back((i-1, j, k-1));
                queue.push_back((i, j-1, k-1));
                queue.push_back((i+1, j-1, k));
                queue.push_back((i-1, j+1, k));
                queue.push_back((i+1, j, k-1));
                queue.push_back((i-1, j, k+1));
                queue.push_back((i, j+1, k-1));
                queue.push_back((i, j-1, k+1));
            }

            if *connectedness == ConnectednessOptions::Vertex {
                queue.push_back((i+1,j+1,k+1));
                queue.push_back((i+1,j-1,k+1));
                queue.push_back((i+1,j+1,k-1));
                queue.push_back((i+1,j-1,k-1));
                queue.push_back((i-1,j+1,k+1));
                queue.push_back((i-1,j-1,k+1));
                queue.push_back((i-1,j+1,k-1));
                queue.push_back((i-1,j-1,k-1));
            }
        }   
    }
}