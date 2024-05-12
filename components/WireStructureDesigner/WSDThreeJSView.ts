import * as THREE from "three";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import getOutlinedDisc from "@/lib/threeOutlinedDisc";
import WSDWire from "./WSDWire";

const upVector = new THREE.Vector3(0, 1, 0);
const highlightColor = new THREE.Color(0x00ff00);

const colors = [
  0x008080, 0xe6beff, 0x9a6324, 0x800000, 0xaaffc3, 0x808000, 0xf58231, 0x911eb4, 0x46f0f0,
  0xf032e6, 0xbcf60c, 0xe6194b, 0x3cb44b, 0xffe119, 0x4363d8,
];

export default class WSDThreeJSView {
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private pointer = new THREE.Vector2();
  private raycaster = new THREE.Raycaster();
  private colorPool = colors.map((c) => new THREE.Color(c));

  private lineMaterial: LineMaterial;

  private wires: WSDWire[] = [];
  private currentWire: WSDWire | undefined;
  private tempLine = new Line2(new LineGeometry());
  private tempStart = new THREE.Vector3();

  public state: "newWireStart" | "newWireHeight" | "addingToWire" = "newWireStart";

  public canvas?: HTMLCanvasElement;

  private group: THREE.Group = new THREE.Group();

  constructor(canvas: HTMLCanvasElement | undefined, width = 800, height = 600) {
    this.canvas = canvas;

    const clippingPlane = [0.1, 1000];
    this.camera = new THREE.PerspectiveCamera(50, width / height, ...clippingPlane);
    this.camera.position.set(17.2, 19.6, 56.9);

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enablePan = false;

    this.renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    this.renderer.setSize(width, height);
    if (window) this.renderer.setPixelRatio(window.devicePixelRatio);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xfffdf0);

    // this.scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    // const lightRight = new THREE.DirectionalLight(0xffffff, 0.8);
    // lightRight.position.set(30, 35, 10);
    // this.scene.add(lightRight);

    const resolution = new THREE.Vector2(
      width * window.devicePixelRatio,
      height * window.devicePixelRatio,
    );
    this.lineMaterial = new LineMaterial({
      color: 0x666666,
      linewidth: 3,
      alphaToCoverage: false,
      resolution,
    });

    this.tempLine.material = this.lineMaterial;
    this.tempLine.geometry.setPositions(new Float32Array(2 * 3));
    this.group.add(this.tempLine);

    this.scene.add(this.group);

    this.scene.add(getOutlinedDisc(6, 20, 5, 0xffd0a8, resolution));

    const getNewWireHeight = () => {
      const cameraDir = new THREE.Vector3();
      this.camera.getWorldDirection(cameraDir);
      cameraDir.y = 0;
      cameraDir.normalize();
      const plane = new THREE.Plane(cameraDir, 0);
      const d = plane.distanceToPoint(this.tempStart);
      plane.constant = -d;
      const intersection = new THREE.Vector3();
      this.raycaster.ray.intersectPlane(plane, intersection);

      const p2 = new THREE.Vector3().copy(this.tempStart);
      p2.y = intersection.y;
      return p2;
    };

    const selectWire = () => {
      let minD = Number.MAX_VALUE;
      let minI = -1;
      for (let i = 0; i < this.wires.length; i++) {
        // Intersect ray with wire
        const d = this.wires[i].getDistance(this.raycaster.ray);
        if (d < minD) {
          minD = d;
          minI = i;
        }
      }

      this.wires.forEach((w, i) => (i == minI ? w.setColor(highlightColor) : w.resetColor()));
      return minI;
    };

    if (this.canvas) {
      this.canvas.onclick = (e) => {
        if (e.ctrlKey) {
          this.state = "newWireStart";
          this.tempLine.geometry.setPositions(new Float32Array([0, 0, 0, 0, 0, 0]));
        }
        // Delete wire
        else if (e.altKey && this.state == "newWireStart") {
          const wireIndex = selectWire();
          if (wireIndex == -1) return;
          this.group.remove(this.wires[wireIndex].linesGroup);
          // Add color back in pool
          const c = this.wires[wireIndex].color;
          this.colorPool.push(c);
          this.wires.splice(wireIndex, 1);
        } //
        else if (e.shiftKey) {
          if (this.state == "newWireStart") {
            // Intersect with plane in xy axis
            const plane = new THREE.Plane(upVector, 0);
            const intersection = new THREE.Vector3();
            this.raycaster.ray.intersectPlane(plane, intersection);

            this.tempStart = intersection;
            this.state = "newWireHeight";
          } //
          else if (this.state == "newWireHeight") {
            const p2 = getNewWireHeight();
            const newWire = new WSDWire(
              this.lineMaterial,
              this.colorPool.pop() ?? new THREE.Color(Math.random(), Math.random(), Math.random()),
              this.tempStart,
              p2,
            );
            this.group.add(newWire.linesGroup);

            this.currentWire = newWire;
            this.wires.push(newWire);
            this.state = "addingToWire";
          } //
          else if (this.state == "addingToWire") {
            if (!this.currentWire) return;
            const intersection = this.currentWire.getIntersectionForNewPoint(this.raycaster.ray);
            this.currentWire.addPoint(intersection);
          }
        }
      };

      if (window) {
        window.onkeyup = (e) => {
          if (e.key == "Alt" && this.state == "newWireStart")
            this.wires.forEach((w) => w.resetColor());
        };
        window.onkeydown = (e) => {
          if (e.key == "Alt" && this.state == "newWireStart") selectWire();
        };
      }
      this.canvas.onmousemove = (e) => {
        this.pointer.x = (e.offsetX / width) * 2 - 1;
        this.pointer.y = -(e.offsetY / height) * 2 + 1;
        this.raycaster.setFromCamera(this.pointer, this.camera);

        if (this.state == "newWireStart" && e.altKey) {
          selectWire();
        } //
        else if (this.state == "newWireHeight") {
          const p2 = getNewWireHeight();
          this.tempLine.geometry.setPositions(
            new Float32Array([...this.tempStart.toArray(), ...p2.toArray()]),
          );
        } //
        else if (this.state == "addingToWire") {
          if (!this.currentWire) return;
          const intersection = this.currentWire.getIntersectionForNewPoint(this.raycaster.ray);

          if (intersection.length() == 0) return;

          this.tempLine.geometry.setPositions(
            new Float32Array([
              ...this.currentWire.points[this.currentWire.points.length - 1].toArray(),
              ...intersection.toArray(),
            ]),
          );
        }
      };
    }

    requestAnimationFrame(this.update.bind(this));
  }

  private update() {
    requestAnimationFrame(this.update.bind(this));
    this.renderer.render(this.scene, this.camera);
    // console.log(this.camera.position);

    this.controls.update();
    // console.log(this.camera.position.toArray());
    // console.log(this.controls.target.toArray());
  }
}

// AXIS
// const xMat = new LineMaterial().copy(this.lineMaterial);
// xMat.color = new THREE.Color(0x00aa00);
// this.scene.add(
//   new Line2(new LineGeometry().setPositions(new Float32Array([0, 0, 0, 30, 0, 0])), xMat),
// );
// const yMat = new LineMaterial().copy(this.lineMaterial);
// yMat.color = new THREE.Color(0xaa0000);
// this.scene.add(
//   new Line2(new LineGeometry().setPositions(new Float32Array([0, 0, 0, 0, 30, 0])), yMat),
// );
// const zMat = new LineMaterial().copy(this.lineMaterial);
// zMat.color = new THREE.Color(0x0000aa);
// this.scene.add(
//   new Line2(new LineGeometry().setPositions(new Float32Array([0, 0, 0, 0, 0, 30])), zMat),
// );
