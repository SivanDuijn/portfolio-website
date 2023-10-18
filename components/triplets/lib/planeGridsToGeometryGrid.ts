import * as THREE from "three";
import { Brush, Evaluator, INTERSECTION } from "three-bvh-csg";
import getHalfCube from "./getHalfCube";

/** Given the three shape planes, construct the final 3D shape grid, by using boolean operations (CSG) */
export default function planeGridsToGeometryGrid(
    left: number[][],
    right: number[][],
    bottom: number[][],
    gridSize: number,
): THREE.Group {
    const geometryGrid = new THREE.Group();

    const leftAllFalse = !left.some((rows) => rows.some((v) => v != 0));
    const rightAllFalse = !right.some((rows) => rows.some((v) => v != 0));
    const bottomAllFalse = !bottom.some((rows) => rows.some((v) => v != 0));
    if (leftAllFalse && rightAllFalse && bottomAllFalse) return geometryGrid;

    const material = new THREE.MeshBasicMaterial({ color: 0xbd9476 });
    const cube = new THREE.BoxGeometry(2, 2, 2);

    for (let x = 0; x < gridSize; x++)
        for (let y = 0; y < gridSize; y++)
            for (let z = 0; z < gridSize; z++) {
                let leftValue = left[gridSize - z - 1][gridSize - y - 1];
                let rightValue = right[x][gridSize - y - 1];
                let bottomValue = bottom[x][z];

                if (leftAllFalse) leftValue = 1;
                if (rightAllFalse) rightValue = 1;
                if (bottomAllFalse) bottomValue = 1;

                if (!(leftValue && rightValue && bottomValue)) continue;

                const shapeGroup = new THREE.Group();
                let shape: Brush | THREE.Mesh | undefined;
                if (leftValue > 1 || rightValue > 1 || bottomValue > 1) {
                    const leftBrush = getBrush("left", leftValue, cube, material);
                    const rightBrush = getBrush("right", rightValue, cube, material);
                    const bottomBrush = getBrush("bottom", bottomValue, cube, material);

                    const csgEvaluator = new Evaluator();
                    shape = csgEvaluator.evaluate(leftBrush, rightBrush, INTERSECTION);
                    shape = csgEvaluator.evaluate(shape as Brush, bottomBrush, INTERSECTION);
                } else shape = new THREE.Mesh(cube, material);

                shape.castShadow = true;
                shapeGroup.add(shape);
                const edges = new THREE.EdgesGeometry(shape.geometry);
                const line = new THREE.LineSegments(
                    edges,
                    new THREE.LineBasicMaterial({ color: 0x1c1c1c }),
                );
                shapeGroup.add(line);
                shapeGroup.position.x = x * 2 - gridSize + 1;
                shapeGroup.position.y = y * 2 - gridSize + 1;
                shapeGroup.position.z = z * 2 - gridSize + 1;
                geometryGrid.add(shapeGroup);
            }

    return geometryGrid;
}

function getBrush(
    plane: "right" | "left" | "bottom",
    value: number,
    cubeGeometry: THREE.BufferGeometry,
    material: THREE.Material,
) {
    let geometry = cubeGeometry;
    if (value > 1) {
        geometry = getHalfCube();

        if (value == 4) geometry.rotateZ(-Math.PI / 2);
        if (value == 5) geometry.rotateZ(-Math.PI);
        if (value == 2) geometry.rotateZ(-Math.PI * 1.5);

        if (plane == "bottom") geometry.rotateX(-Math.PI / 2);
        if (plane == "left") geometry.rotateY(Math.PI / 2);
    }

    const brush = new Brush(geometry, material);

    return brush;
}
