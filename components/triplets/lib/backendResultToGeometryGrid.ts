import toast from "react-hot-toast";
import * as THREE from "three";

export type TripletBackendResult =
  | {
      status: string;
      triplet: number[][][];
    }
  | { message: string };

export default function backendResultToGeometryGrid(result: TripletBackendResult): THREE.Group {
  const geometryGrid = new THREE.Group();

  if ("message" in result) {
    toast.error(result.message);
    return geometryGrid;
  }

  const gridSize = result.triplet.length;

  const material = new THREE.MeshBasicMaterial({ color: 0xbd9476 });
  const cube = new THREE.BoxGeometry(2, 2, 2);

  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x1c1c1c });
  //   const shape = new THREE.Mesh(cube, material);
  //   shape.castShadow = true;

  const edges = new THREE.EdgesGeometry(cube);
  //   const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x1c1c1c }));

  result.triplet.forEach((slice, z) =>
    slice.forEach((row, y) =>
      row.forEach((cell, x) => {
        if (cell == 0) return;

        // const material = new THREE.MeshBasicMaterial({ color: 0xbd9476 });
        // const cube = new THREE.BoxGeometry(2, 2, 2);
        const shape = new THREE.Mesh(cube, material);
        shape.castShadow = true;

        // const edges = new THREE.EdgesGeometry(shape.geometry);
        const lines = new THREE.LineSegments(edges, lineMaterial);

        const shapeGroup = new THREE.Group();
        shapeGroup.add(shape);
        shapeGroup.add(lines);

        shapeGroup.position.x = x * 2 - gridSize + 1;
        shapeGroup.position.y = y * 2 - gridSize + 1;
        shapeGroup.position.z = z * 2 - gridSize + 1;

        geometryGrid.add(shapeGroup);
      }),
    ),
  );

  return geometryGrid;
}
