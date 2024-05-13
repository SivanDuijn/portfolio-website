import * as THREE from "three";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";

export default function getOutlinedDisc(
  nSides: number,
  radius: number,
  height: number,
  color: number,
  resolution: THREE.Vector2,
  outlineWidth = 3,
) {
  const points: number[][] = [];

  let p = [radius, 0];
  const PI2 = Math.PI * 2;
  const angle = PI2 / nSides;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  points.push(p);
  for (let i = 1; i < nSides; i++) {
    const nx = p[0] * cos - p[1] * sin;
    const nz = p[0] * sin + p[1] * cos;
    p = [nx, nz];
    points.push(p);
  }

  // Build THREE geometry
  const vertices = new Float32Array((nSides * 2 + 2) * 3);
  const outlineVertices = new Float32Array((nSides * 2 + 2) * 3);
  const nso = (nSides + 1) * 3; // Number of sides offset
  vertices[4] = -height;
  points.forEach((p, i) => {
    let io = i * 6 + 6; // index offset
    vertices[io] = p[0];
    vertices[io + 2] = p[1];
    vertices[io + 3] = p[0];
    vertices[io + 4] = -height;
    vertices[io + 5] = p[1];

    io = i * 3;
    outlineVertices[io] = p[0];
    outlineVertices[io + 2] = p[1];
    outlineVertices[io + nso] = p[0];
    outlineVertices[io + nso + 1] = -height;
    outlineVertices[io + nso + 2] = p[1];
  });
  const ns3 = nSides * 3;
  outlineVertices[ns3] = points[0][0];
  outlineVertices[ns3 + 2] = points[0][1];
  outlineVertices[ns3 * 2 + 3] = points[0][0];
  outlineVertices[ns3 * 2 + 4] = -height;
  outlineVertices[ns3 * 2 + 5] = points[0][1];

  const indices: number[] = [];
  let loop = true;
  let i = 2;
  while (loop) {
    let ni = i + 2;
    if (i == nSides * 2) {
      ni = 2;
      loop = false;
    }

    indices.push(0, ni, i, 1, i + 1, ni + 1);
    indices.push(i, ni, ni + 1, i, ni + 1, i + 1);

    i += 2;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(indices);
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

  const material = new THREE.MeshBasicMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);

  const lineGeometry = new LineGeometry();
  lineGeometry.setPositions(outlineVertices);
  const lineMaterial = new LineMaterial({
    color: 0x000000,
    linewidth: outlineWidth,
    alphaToCoverage: false,
    resolution: resolution,
  });

  const lines = [new Line2(lineGeometry, lineMaterial)];

  // Add missing vertical outlines
  for (let i = 1; i < points.length; i++) {
    const p = points[i];
    const lg = new LineGeometry();
    lg.setPositions(new Float32Array([p[0], 0, p[1], p[0], -height, p[1]]));
    lines.push(new Line2(lg, lineMaterial));
  }

  return { mesh, lines };
}
