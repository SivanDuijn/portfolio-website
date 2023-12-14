import * as THREE from "three";
import { Triplet } from "./buildTriplet";
import { getTripletComponents } from "./componentLabelling";

export function verifyComponentLabelling(triplet: Triplet, meshGroup: THREE.Group) {
  const colors = [
    0x264653, 0x2a9d8f, 0xe9c46a, 0xf4a261, 0xe76f51, 0xc1121f, 0x669bbc, 0x386641, 0x283618,
    0xa2d2ff,
  ];
  const cube = new THREE.BoxGeometry();
  const { labels } = getTripletComponents(triplet, "volume");
  for (let i = 0; i < triplet.dims[0]; i++)
    for (let j = 0; j < triplet.dims[1]; j++)
      for (let k = 0; k < triplet.dims[2]; k++) {
        const index = i + triplet.dims[0] * (j + triplet.dims[1] * k);
        if (!triplet.volume[index]) continue;

        const color = colors[labels[index] - 1];
        const m = new THREE.Mesh(cube, new THREE.MeshStandardMaterial({ color }));
        m.position.x = i - triplet.dims[0] / 2 + 0.5;
        m.position.y = j - triplet.dims[1] / 2 + 0.5;
        m.position.z = k - triplet.dims[2] / 2 + 0.5;
        m.castShadow = true;
        meshGroup.add(m);
      }
}
