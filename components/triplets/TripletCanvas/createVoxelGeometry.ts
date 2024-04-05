import * as THREE from "three";

export default function createVoxelGeometry(
  vertices: number[],
  indices: number[],
  lines: number[],
  dims: [number, number, number],
  color: THREE.ColorRepresentation,
) {
  const geometry = new THREE.BufferGeometry();

  geometry.setIndex(indices);
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.computeVertexNormals();
  geometry.translate(-dims[0] / 2, -dims[1] / 2, -dims[2] / 2);
  geometry.scale(14 / dims[0], 14 / dims[0], 14 / dims[0]);

  const material = new THREE.MeshLambertMaterial({ color }); //color: 0xbd9476 });  0x74c4cf,
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;

  // add outlines
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x1c1c1c, depthWrite: false });
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(lines, 3));
  g.translate(-dims[0] / 2, -dims[1] / 2, -dims[2] / 2);
  g.scale(14 / dims[0], 14 / dims[0], 14 / dims[0]);

  const outline = new THREE.LineSegments(g, lineMaterial);

  return { mesh, outline };
}
