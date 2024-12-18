import * as THREE from "three";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";

/** A wire consists of a list of points which are connected by lines
 * ONLY 90 DEG ANGLES BETWEEN LINE SEGMENTS
 */
export default class WSDWire {
  public points: THREE.Vector3[] = [];
  public color: THREE.Color;
  public hasLantern = false;

  // --- THREE properties for rendering ---
  private material: LineMaterial;
  private lineGeometries: LineGeometry[] = [];
  public linesGroup = new THREE.Group();
  public lanternMesh: THREE.Mesh | undefined;

  constructor(
    material: LineMaterial,
    color: THREE.Color,
    sp1 = new THREE.Vector3(0, 0, 0),
    sp2 = new THREE.Vector3(0, 10, 0),
  ) {
    this.material = new LineMaterial().copy(material);
    this.color = color;
    this.material.color = this.color;
    this.points.push(sp1);
    this.addPoint(sp2);
  }

  public setColor(color: THREE.Color) {
    this.material.color = color;
  }
  public resetColor() {
    this.material.color = this.color;
  }
  public setCopperColor() {
    this.material.color = new THREE.Color(0x804916);
  }

  public addPoint(point: THREE.Vector3) {
    const lineGeometry = new LineGeometry();
    const prevPoint = this.points[this.points.length - 1];
    lineGeometry.setPositions(new Float32Array([...prevPoint.toArray(), ...point.toArray()]));

    this.linesGroup.add(new Line2(lineGeometry, this.material));

    this.points.push(point);
    this.lineGeometries.push(lineGeometry);
    return this;
  }

  /** Adds lantern mesh to end of wire, not shown yet! */
  public addLanternToEnd(otherWires: WSDWire[] = [], radius = 3) {
    const lp = this.points[this.points.length - 1]; // last point
    if (
      otherWires.some((w) => w.hasLantern && lp.distanceTo(w.points[w.points.length - 1]) < radius)
    )
      return;

    this.lanternMesh = new THREE.Mesh(
      new THREE.SphereGeometry(radius),
      new THREE.MeshBasicMaterial({ opacity: 0.55, color: "orange", transparent: true }),
    );
    this.lanternMesh.position.set(lp.x, lp.y - radius, lp.z);
    this.hasLantern = true;
  }

  public getIntersectionForNewPoint(ray: THREE.Ray): THREE.Vector3 {
    const p1 = this.points[this.points.length - 1];
    const p2 = this.points[this.points.length - 2];
    const planeVector = new THREE.Vector3().subVectors(p1, p2).normalize();
    const plane = new THREE.Plane(planeVector, 0);
    const d = plane.distanceToPoint(p1);
    plane.constant = -d;
    const intersection = new THREE.Vector3();
    ray.intersectPlane(plane, intersection);

    const dir = new THREE.Vector3().subVectors(intersection, p1).normalize().toArray();
    const maxI = dir
      .map((v) => Math.abs(v))
      .reduce((maxI, v, i, arr) => (v > arr[maxI] ? i : maxI), 0);
    for (let i = 0; i < 3; i++) dir[i] = i != maxI ? 0 : dir[maxI] > 0 ? 1 : -1;

    const l = Math.abs(intersection.toArray()[maxI] - p1.toArray()[maxI]);

    return new THREE.Vector3().copy(p1).addScaledVector(new THREE.Vector3(...dir), l);
  }

  public getDistance(ray: THREE.Ray, minDist = 1): number {
    let p1 = this.points[0];
    let p2 = this.points[1];
    let minD = Number.MAX_VALUE;
    for (let pi = 1; pi < this.points.length; pi++) {
      p2 = this.points[pi];
      const d = ray.distanceSqToSegment(p1, p2);
      if (d <= minDist && d < minD) minD = d;

      p1 = p2;
    }

    return minD;
  }

  public showLantern() {
    if (this.lanternMesh) this.linesGroup.add(this.lanternMesh);
  }
  public hideLantern() {
    if (this.lanternMesh) this.linesGroup.remove(this.lanternMesh);
  }

  public serialize(): string {
    return (
      this.points
        .map((p) =>
          p
            .toArray()
            .map((c) => c.toFixed(4))
            .join(","),
        )
        .join(";") +
      "color=" +
      this.color.toJSON()
    );
  }
  public static fromString(s: string, lineMaterial: LineMaterial) {
    const [pts, clr] = s.split("color=");
    const [p1, p2, ...points] = pts
      .split(";")
      .map((p) => new THREE.Vector3(...p.split(",").map((c) => parseFloat(c))));

    const color = new THREE.Color(parseInt(clr));

    const wire = new this(lineMaterial, color, p1, p2);
    points.forEach((p) => wire.addPoint(p));
    return wire;
  }
}
