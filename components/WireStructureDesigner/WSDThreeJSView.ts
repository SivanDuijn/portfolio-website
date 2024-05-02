import * as THREE from "three";
import { Line2 } from "three/addons/lines/Line2.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import LineStructure from "./LineStructure";

export default class WSDThreeJSView {
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private pointer = new THREE.Vector2();
  private raycaster = new THREE.Raycaster();

  public canvas?: HTMLCanvasElement;

  private group: THREE.Group = new THREE.Group();

  public line = new LineStructure();

  // public setSize(width: number, height: number) {
  //   this.renderer.setSize(width, height);
  // }

  constructor(canvas: HTMLCanvasElement | undefined, width = 800, height = 600) {
    this.canvas = canvas;

    const clippingPlane = [0.1, 1000];
    this.camera = new THREE.PerspectiveCamera(50, width / height, ...clippingPlane);
    this.camera.position.set(13, 56, 47);

    if (this.canvas) {
      this.canvas.onclick = (e) => {
        if (!e.shiftKey) return;
        this.line.addNewLine();
      };

      this.canvas.onmousemove = (e) => {
        this.pointer.x = (e.offsetX / width) * 2 - 1;
        this.pointer.y = -(e.offsetY / height) * 2 + 1;
        this.raycaster.setFromCamera(this.pointer, this.camera);

        const s = new THREE.Vector3()
          .copy(this.line.curve.startPoint)
          .addScaledVector(this.line.curve.startDir, this.line.curve.size)
          .projectOnVector(new THREE.Vector3().copy(this.line.curve.startDir).negate());
        const plane = new THREE.Plane(this.line.curve.startDir, -s.length());

        const intersection = new THREE.Vector3();
        this.raycaster.ray.intersectPlane(plane, intersection);
        const endP = new THREE.Vector3()
          .copy(this.line.curve.startPoint)
          .addScaledVector(this.line.curve.startDir, this.line.curve.size);

        const dir = new THREE.Vector3().subVectors(intersection, endP).normalize();
        this.line.updateNewLine(
          dir,
          Math.max(0, intersection.distanceTo(endP) - this.line.curve.size),
        );

        // if (this.line.mode == "line") {
        //   const cameraDir = new THREE.Vector3();
        //   this.camera.getWorldDirection(cameraDir);
        //   cameraDir.y = 0;
        //   cameraDir.normalize();
        //   const plane = new THREE.Plane(cameraDir, 0);
        //   const intersection = new THREE.Vector3();
        //   this.raycaster.ray.intersectPlane(plane, intersection);

        //   this.line.setLineLength(intersection.y);
        // } else if (this.line.mode == "curve") {
        //   const plane = new THREE.Plane(up, -(this.line.line.end.y + this.line.curve.size));
        //   const intersection = new THREE.Vector3();
        //   this.raycaster.ray.intersectPlane(plane, intersection);

        //   const endP = new THREE.Vector3(
        //     this.line.line.end.x,
        //     this.line.line.end.y,
        //     this.line.line.end.z,
        //   ).addScaledVector(this.line.line.dir, this.line.curve.size);

        //   const dir = new THREE.Vector3().subVectors(intersection, endP).normalize();
        //   this.line.setCurve(dir);
        // }
      };
    }

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enablePan = false;

    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });
    this.renderer.setSize(width, height);
    if (window) this.renderer.setPixelRatio(window.devicePixelRatio);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xfffdec);

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const lightRight = new THREE.DirectionalLight(0xffffff, 0.8);
    lightRight.position.set(30, 35, 10); //default; light shining from right
    this.scene.add(lightRight);

    const lineMat = new LineMaterial({
      color: 0x000000,
      linewidth: 3,
      alphaToCoverage: false,
      resolution: new THREE.Vector2(
        width * window.devicePixelRatio,
        height * window.devicePixelRatio,
      ),
    });

    this.group.add(new Line2(this.line.geometry, lineMat));

    // const curve = new THREE.QuadraticBezierCurve3(
    //   new THREE.Vector3(10, 0, 0),
    //   new THREE.Vector3(10, 10, 0),
    //   new THREE.Vector3(0, 10, 0),
    // );
    // const points = curve.getPoints(50);
    // const geometry = new LineGeometry().setPositions(points.map((v) => v.toArray()).flat());
    // this.group.add(new Line2(geometry, lineMat));

    this.group.add(
      new THREE.Mesh(
        new THREE.CylinderGeometry(20, 20, 10, 6),
        new THREE.MeshBasicMaterial({ color: 0xc2b49f, wireframe: true }),
      ).translateY(-5),
    );

    this.scene.add(this.group);

    requestAnimationFrame(this.update.bind(this));
  }

  private update() {
    requestAnimationFrame(this.update.bind(this));
    this.renderer.render(this.scene, this.camera);

    this.controls.update();
  }
}
