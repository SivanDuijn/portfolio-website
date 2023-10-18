import * as THREE from "three";

export default function getHalfCube(): THREE.BufferGeometry {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([0, 2, 0, 2, 2, 0, 2, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 2]);
    const indices = [0, 1, 2, 3, 1, 0, 3, 4, 1, 1, 4, 5, 1, 5, 2, 0, 2, 5, 0, 5, 3, 5, 4, 3];

    geometry.setIndex(indices);
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geometry.setAttribute("uv", new THREE.BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();
    geometry.translate(-1, -1, -1);
    return geometry;
}
