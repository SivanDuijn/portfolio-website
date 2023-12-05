// Greedy meshing inspired by: https://github.com/mikolalysenko/mikolalysenko.github.com/blob/gh-pages/MinecraftMeshes/js/greedy.js
/** Greedy meshes a triplet (3D grid cell volume) */
export function greedyMesh(volume: number[][][], dims: number[]) {
  function f(i: number, j: number, k: number) {
    // return volume[i + dims[0] * (j + dims[1] * k)];
    return volume[i][j][k];
  }
  //Sweep over 3-axes
  // const quads = [];
  const vertices: number[] = [];
  const indices: number[] = [];
  let nVerts = 0;
  for (let d = 0; d < 3; ++d) {
    let i, j, k, l, w, h;
    // u and v are the other two axis/dimensions than d
    const u = (d + 1) % 3,
      v = (d + 2) % 3,
      x = [0, 0, 0],
      q = [0, 0, 0],
      mask = new Int8Array(dims[u] * dims[v]);
    q[d] = 1;
    // x[d] goes from -1 to max x dim
    // So basically "slice" through the x dimension, take a slice each time
    for (x[d] = -1; x[d] < dims[d]; ) {
      //Compute mask
      let n = 0;
      for (x[v] = 0; x[v] < dims[v]; ++x[v])
        for (x[u] = 0; x[u] < dims[u]; ++x[u]) {
          const cell = 0 <= x[d] ? f(x[0], x[1], x[2]) : false;
          const above = x[d] < dims[d] - 1 ? f(x[0] + q[0], x[1] + q[1], x[2] + q[2]) : false;
          if (cell != above) {
            if (cell) mask[n++] = 1;
            else mask[n++] = 2;
          } else mask[n++] = 0;
        }
      //Increment x[d]
      ++x[d];
      //Generate mesh for mask using lexicographic ordering
      n = 0;
      for (j = 0; j < dims[v]; ++j)
        for (i = 0; i < dims[u]; ) {
          if (mask[n]) {
            //Compute width
            // eslint-disable-next-line no-empty
            for (w = 1; mask[n + w] == mask[n] && i + w < dims[u]; ++w) {}
            //Compute height (this is slightly awkward)
            let done = false;
            for (h = 1; j + h < dims[v]; ++h) {
              for (k = 0; k < w; ++k) {
                if (mask[n + k + h * dims[u]] != mask[n]) {
                  done = true;
                  break;
                }
              }
              if (done) {
                break;
              }
            }
            //Add quad
            x[u] = i;
            x[v] = j;
            const du = [0, 0, 0];
            du[u] = w;
            const dv = [0, 0, 0];
            dv[v] = h;

            vertices.push(
              ...[
                x[0],
                x[1],
                x[2],
                x[0] + du[0],
                x[1] + du[1],
                x[2] + du[2],
                x[0] + du[0] + dv[0],
                x[1] + du[1] + dv[1],
                x[2] + du[2] + dv[2],
                x[0] + dv[0],
                x[1] + dv[1],
                x[2] + dv[2],
              ],
            );

            if (mask[n] == 1)
              indices.push(...[nVerts, nVerts + 1, nVerts + 3, nVerts + 2, nVerts + 3, nVerts + 1]);
            else
              indices.push(...[nVerts, nVerts + 3, nVerts + 1, nVerts + 2, nVerts + 1, nVerts + 3]);
            nVerts += 4;

            //Zero-out mask
            for (l = 0; l < h; ++l)
              for (k = 0; k < w; ++k) {
                mask[n + k + l * dims[u]] = 0;
              }
            //Increment counters and continue
            i += w;
            n += w;
          } else {
            ++i;
            ++n;
          }
        }
    }
  }
  return { vertices, indices };
}
