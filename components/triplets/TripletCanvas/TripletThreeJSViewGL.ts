import { saveAs } from "file-saver";
import toast from "react-hot-toast";
import * as THREE from "three";
import { STLExporter } from "three/addons/exporters/STLExporter.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { greedyMesh } from "../lib/greedyMesh";
import { Triplet } from "../models";

// const rotationalAxis = new THREE.Vector3(Math.sqrt(3), Math.sqrt(3), Math.sqrt(3));
// const halfPI = (Math.PI * 2) / 9;

/** Renders a triplet */
export default class TripletThreeJSViewGL {
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;

  private tripletMesh: THREE.Mesh | undefined;
  private tripletGroup: THREE.Group = new THREE.Group();
  private tripletOutline: THREE.BufferGeometry | undefined;
  private outlineOffsetVec: THREE.Vector3 = new THREE.Vector3(1, 1, 1).normalize();
  private outlineOffset = 0.02;

  // Rotation timer
  private radiansRotated = 0;
  private radiansRotated2 = 0;

  public canvas?: HTMLCanvasElement;

  public setSize(width: number, height: number) {
    this.renderer.setSize(width, height);
  }

  public exportTriplet(name?: string) {
    if (!this.tripletMesh) {
      toast.error("Nothing to export");
      return;
    }

    const exporter = new STLExporter();
    const result = exporter.parse(this.tripletMesh, { binary: true });
    const blob = new Blob([result], { type: "application/octet-binary" });
    saveAs(blob, name ? name : "triplet.stl");
  }

  public removeTriplet() {
    if (this.tripletMesh) this.scene.remove(this.tripletMesh);
    this.tripletMesh = undefined;

    this.tripletGroup.clear();
  }

  /** Build a mesh from 3D grid triplet definition, and updates the rendered canvas. */
  public updateTriplet(triplet: Triplet) {
    this.tripletGroup.clear();

    const { vertices, indices, lines } = greedyMesh(triplet);

    const geometry = new THREE.BufferGeometry();

    geometry.setIndex(indices);
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();
    geometry.translate(-triplet.dims[0] / 2, -triplet.dims[1] / 2, -triplet.dims[2] / 2);
    geometry.scale(14 / triplet.dims[0], 14 / triplet.dims[0], 14 / triplet.dims[0]);

    const material = new THREE.MeshLambertMaterial({
      color: 0x74c4cf,
    }); //color: 0xbd9476 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    // mesh.receiveShadow = true;
    if (this.tripletMesh) this.scene.remove(this.tripletMesh);
    this.tripletMesh = mesh;

    // add outlines
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x1c1c1c, depthWrite: false });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(lines, 3));
    g.translate(-triplet.dims[0] / 2, -triplet.dims[1] / 2, -triplet.dims[2] / 2);
    g.scale(14 / triplet.dims[0], 14 / triplet.dims[0], 14 / triplet.dims[0]);
    this.tripletOutline = g;
    this.tripletOutline.translate(
      this.outlineOffsetVec.x * this.outlineOffset,
      this.outlineOffsetVec.y * this.outlineOffset,
      this.outlineOffsetVec.z * this.outlineOffset,
    );
    const l = new THREE.LineSegments(g, lineMaterial);
    this.tripletGroup.add(l);

    // Verify quads

    // const edges = new THREE.EdgesGeometry(geometry);
    // const lines = new THREE.LineSegments(edges, lineMaterial);
    // this.tripletGroup.add(lines);

    // this.radiansRotated = 0;
    // this.radiansRotated2 = 0;
    this.scene.add(this.tripletMesh);
  }

  constructor(canvas: HTMLCanvasElement | undefined, width = 600, height = 600) {
    this.canvas = canvas;

    const clippingPlane = [0.1, 1000];
    this.camera = new THREE.PerspectiveCamera(50, 1, ...clippingPlane);
    this.camera.setViewOffset(width, height, 0, 50, width, height);
    this.camera.position.set(43, 16, 47);
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enablePan = false;

    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });
    this.renderer.setSize(width, height);
    if (window) this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; //THREE.VSMShadowMap;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("white");

    // LIGHTS
    const lightTop = new THREE.DirectionalLight(0xffffff, 1);
    lightTop.position.set(0, 10, 0); //default; light shining from top
    lightTop.castShadow = true;
    lightTop.shadow.mapSize.width = 256;
    lightTop.shadow.mapSize.height = 256;
    lightTop.shadow.camera.left = -20;
    lightTop.shadow.camera.right = 20;
    lightTop.shadow.camera.top = 20;
    lightTop.shadow.camera.bottom = -20;
    lightTop.shadow.radius = 3;
    lightTop.shadow.blurSamples = 15;
    this.scene.add(lightTop);

    const lightRight = new THREE.DirectionalLight(0xffffff, 0.8);
    lightRight.position.set(10, 0, 0); //default; light shining from right
    lightRight.castShadow = true;
    lightRight.shadow.mapSize.width = 256;
    lightRight.shadow.mapSize.height = 256;
    lightRight.shadow.camera.left = -20;
    lightRight.shadow.camera.right = 20;
    lightRight.shadow.camera.top = 20;
    lightRight.shadow.camera.bottom = -20;
    lightRight.shadow.radius = 3;
    lightRight.shadow.blurSamples = 15;
    this.scene.add(lightRight);

    const lightFront = new THREE.DirectionalLight(0xffffff, 0.9);
    lightFront.position.set(0, 0, 10); //default; light shining from right
    lightFront.castShadow = true;
    lightFront.shadow.mapSize.width = 256;
    lightFront.shadow.mapSize.height = 256;
    lightFront.shadow.camera.left = -20;
    lightFront.shadow.camera.right = 20;
    lightFront.shadow.camera.top = 20;
    lightFront.shadow.camera.bottom = -20;
    lightFront.shadow.radius = 3;
    lightFront.shadow.blurSamples = 15;
    this.scene.add(lightFront);

    const lightBottom = new THREE.DirectionalLight(0xffffff, 0.4);
    lightBottom.position.set(0, -10, 0); //default; light shining from top
    this.scene.add(lightBottom);
    const lightLeft = new THREE.DirectionalLight(0xffffff, 0.45);
    lightLeft.position.set(-10, 0, 0); //default; light shining from top
    this.scene.add(lightLeft);
    const lightBack = new THREE.DirectionalLight(0xffffff, 0.35);
    lightBack.position.set(0, 0, -10); //default; light shining from top
    this.scene.add(lightBack);

    const AmbientLight = new THREE.AmbientLight(0xffffff, 0.075); // soft white light
    this.scene.add(AmbientLight);

    // PLANES
    const planeGeometry = new THREE.PlaneGeometry(400, 400);
    // const planeMaterial = new THREE.MeshPhongMaterial();
    const shadowMaterial = new THREE.ShadowMaterial({ color: 0x013840, opacity: 0.7 });
    const planeBottom = new THREE.Mesh(planeGeometry, shadowMaterial);
    planeBottom.rotateX(-Math.PI / 2);
    planeBottom.position.y = -30;
    planeBottom.receiveShadow = true;

    const planeLeft = new THREE.Mesh(planeGeometry, shadowMaterial);
    planeLeft.rotateY(Math.PI / 2);
    planeLeft.position.x = -30;
    planeLeft.receiveShadow = true;

    const planeBack = new THREE.Mesh(planeGeometry, shadowMaterial);
    planeBack.position.z = -30;
    planeBack.receiveShadow = true;
    this.scene.add(planeBottom);
    this.scene.add(planeLeft);
    this.scene.add(planeBack);

    // AXIS
    const axisGeometry = new THREE.CylinderGeometry(0.1, 0.1, 100, 32);
    const xAxisMaterial = new THREE.MeshBasicMaterial({ color: 0x8fd687 }); // 00aa00
    const xAxisCylinder = new THREE.Mesh(axisGeometry, xAxisMaterial);
    xAxisCylinder.rotateX(Math.PI / 2);
    xAxisCylinder.position.z = 20;
    xAxisCylinder.position.x = -30;
    xAxisCylinder.position.y = -30;
    const yAxisMaterial = new THREE.MeshBasicMaterial({ color: 0x80abb0 }); //0000cc
    const yAxisCylinder = new THREE.Mesh(axisGeometry, yAxisMaterial);
    yAxisCylinder.position.y = 20;
    yAxisCylinder.position.x = -30;
    yAxisCylinder.position.z = -30;
    const zAxisMaterial = new THREE.MeshBasicMaterial({ color: 0xe08486 }); //dd0000
    const zAxisCylinder = new THREE.Mesh(axisGeometry, zAxisMaterial);
    zAxisCylinder.rotateZ(Math.PI / 2);
    zAxisCylinder.position.x = 20;
    zAxisCylinder.position.z = -30;
    zAxisCylinder.position.y = -30;
    this.scene.add(xAxisCylinder);
    this.scene.add(yAxisCylinder);
    this.scene.add(zAxisCylinder);

    // const origin = new THREE.Mesh(
    //   new THREE.SphereGeometry(1),
    //   new THREE.MeshStandardMaterial({ color: "red" }),
    // );
    // origin.position.set(0, 0, 0);
    // this.scene.add(origin);

    this.scene.add(this.tripletGroup);

    requestAnimationFrame(this.update.bind(this));
  }

  private update() {
    requestAnimationFrame(this.update.bind(this));
    this.renderer.render(this.scene, this.camera);

    this.controls.update();

    this.tripletOutline?.translate(
      -this.outlineOffsetVec.x * this.outlineOffset,
      -this.outlineOffsetVec.y * this.outlineOffset,
      -this.outlineOffsetVec.z * this.outlineOffset,
    );
    this.outlineOffsetVec = new THREE.Vector3(
      this.camera.position.x,
      this.camera.position.y,
      this.camera.position.z,
    ).normalize();
    this.tripletOutline?.translate(
      this.outlineOffsetVec.x * this.outlineOffset,
      this.outlineOffsetVec.y * this.outlineOffset,
      this.outlineOffsetVec.z * this.outlineOffset,
    );

    // // Attempt at object rotation
    // if (this.tripletMesh && this.radiansRotated >= 0) {
    //   this.tripletMesh.rotateOnAxis(new THREE.Vector3(1, 1, 1).normalize(), Math.PI * 0.005);

    //   this.radiansRotated += Math.PI * 0.005;
    //   this.radiansRotated2 += Math.PI * 0.005;

    //   if (this.radiansRotated > (Math.PI * 2) / 3) {
    //     if (this.radiansRotated2 > Math.PI * 2) {
    //       this.tripletMesh.rotation.set(0, 0, 0);
    //       this.radiansRotated2 = 0;
    //     }

    //     // console.log(
    //     //   this.tripletMesh.rotation.x,
    //     //   this.tripletMesh.rotation.y,
    //     //   this.tripletMesh.rotation.z,
    //     // );

    //     this.radiansRotated = -1;
    //     setTimeout(() => {
    //       this.radiansRotated = 0;
    //     }, 500);
    //   }
    // }
  }
}
