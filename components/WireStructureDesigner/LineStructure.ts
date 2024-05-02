/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";
import { LineGeometry } from "three/addons/lines/LineGeometry.js";

class Line {
  public start = new THREE.Vector3();
  public dir = new THREE.Vector3();
  public end = new THREE.Vector3();
  public length = 1;

  public set(start: THREE.Vector3, dir: THREE.Vector3) {
    this.start = start;
    this.dir = dir;
  }

  public getPositions(length: number | undefined) {
    if (length) {
      this.length = length;
    }
    this.end.set(this.start.x, this.start.y, this.start.z).addScaledVector(this.dir, this.length);

    return [this.start.toArray(), this.end.toArray()];
  }
}

class Curve {
  public startPoint = new THREE.Vector3();
  public startDir = new THREE.Vector3();
  public endDir = new THREE.Vector3();
  public endPoint = new THREE.Vector3();
  public controlPoint = new THREE.Vector3();
  public size = 0.3;

  public set(startPoint: THREE.Vector3, startDir: THREE.Vector3) {
    this.startPoint = startPoint;
    this.startDir = startDir;
  }

  public getPoints(endDir: THREE.Vector3, length: number) {
    this.endDir = endDir;

    this.controlPoint
      .set(this.startPoint.x, this.startPoint.y, this.startPoint.z)
      .addScaledVector(this.startDir, this.size);

    this.endPoint
      .set(this.startPoint.x, this.startPoint.y, this.startPoint.z)
      .addScaledVector(this.startDir, this.size)
      .addScaledVector(this.endDir, this.size);

    const curve = new THREE.QuadraticBezierCurve3(
      this.startPoint,
      this.controlPoint,
      this.endPoint,
    );

    const points = curve.getPoints(20).map((v) => v.toArray());
    this.endPoint.addScaledVector(this.endDir, length);
    points.push([this.endPoint.x, this.endPoint.y, this.endPoint.z]);

    return points;
  }
}

export default class LineStructure {
  public line: Line;
  public curve: Curve;

  public geometry: LineGeometry = new LineGeometry();
  public mode: "line" | "curve" = "line";

  private instanceEndBuffer: any;
  private instanceStartBuffer: any;
  private indicesCount = 0;

  constructor() {
    this.line = new Line();
    // this.line.set(start, new THREE.Vector3(0, 1, 0));
    this.curve = new Curve();
    this.curve.set(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0));

    this.geometry.setPositions(new Float32Array((10 * 2 + 10 * 20) * 3));

    this.instanceEndBuffer = this.geometry.getAttribute("instanceEnd");
    this.instanceStartBuffer = this.geometry.getAttribute("instanceStart");
  }

  public setLineLength(length: number) {
    const positions = this.line.getPositions(length);
    this.setPositions(positions);
  }

  public updateNewLine(dir: THREE.Vector3, length: number) {
    const curvePositions = this.curve.getPoints(dir, length);
    this.setPositions(curvePositions);
  }

  public addNewLine() {
    this.curve.set(
      new THREE.Vector3().copy(this.curve.endPoint),
      new THREE.Vector3().copy(this.curve.endDir),
    );
    this.indicesCount += 21;
  }

  private setPositions(positions: number[][]) {
    positions.map((p, i) => {
      this.instanceEndBuffer.setXYZ(this.indicesCount + i, ...p);
      this.instanceStartBuffer.setXYZ(this.indicesCount + i + 1, ...p);
    });
    this.instanceEndBuffer.setXYZ(
      this.indicesCount + positions.length,
      ...positions[positions.length - 1],
    );
    this.instanceStartBuffer.setXYZ(
      this.indicesCount + positions.length,
      ...positions[positions.length - 1],
    );
    this.instanceEndBuffer.needsUpdate = true;
    this.instanceStartBuffer.needsUpdate = true;
  }
}
