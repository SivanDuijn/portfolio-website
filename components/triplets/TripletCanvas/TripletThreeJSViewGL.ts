import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { greedyMesh } from "../lib/greedyMesh";

/** Renders a triplet */
export default class TripletThreeJSViewGL {
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;

  private shape: THREE.Group = new THREE.Group();

  public canvas?: HTMLCanvasElement;

  /** Build a triplet object from 3D grid triplet definition, and updates the rendered canvas. */
  public updateTriplet(triplet: number[][][]) {
    const gridSize = triplet.length;

    const material = new THREE.MeshBasicMaterial({ color: 0xbd9476 });
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x1c1c1c });

    const { vertices, indices } = greedyMesh(triplet, [gridSize, gridSize, gridSize]);

    const geometry = new THREE.BufferGeometry();

    const verticesFloat32 = Float32Array.from(vertices);

    geometry.setIndex(indices);
    geometry.setAttribute("position", new THREE.BufferAttribute(verticesFloat32, 3));

    this.shape.clear();

    const shapeGroup = new THREE.Group();
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    shapeGroup.add(mesh);
    const edges = new THREE.EdgesGeometry(geometry);
    const lines = new THREE.LineSegments(edges, lineMaterial);
    shapeGroup.add(lines);

    this.shape.add(shapeGroup);
  }

  constructor(canvas: HTMLCanvasElement | undefined, width = 600, height = 600) {
    this.canvas = canvas;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

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

    const lightRight = new THREE.DirectionalLight(0xffffff, 1);
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

    const lightFront = new THREE.DirectionalLight(0xffffff, 1);
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

    const AmbientLight = new THREE.AmbientLight(0x404040, 1); // soft white light
    this.scene.add(AmbientLight);

    // PLANES
    const planeGeometry = new THREE.PlaneGeometry(40, 40);
    const planeMaterial = new THREE.MeshPhongMaterial();
    const planeBottom = new THREE.Mesh(planeGeometry, planeMaterial);
    planeBottom.rotateX(-Math.PI / 2);
    planeBottom.position.y = -20;
    planeBottom.receiveShadow = true;
    this.scene.add(planeBottom);

    const planeLeft = new THREE.Mesh(planeGeometry, planeMaterial);
    planeLeft.rotateY(Math.PI / 2);
    planeLeft.position.x = -20;
    planeLeft.receiveShadow = true;
    this.scene.add(planeLeft);

    const planeBack = new THREE.Mesh(planeGeometry, planeMaterial);
    planeBack.position.z = -20;
    planeBack.receiveShadow = true;
    this.scene.add(planeBack);

    // AXIS
    const axisGeometry = new THREE.CylinderGeometry(0.3, 0.3, 40, 32);
    const xAxisMaterial = new THREE.MeshBasicMaterial({ color: 0x00aa00 });
    const xAxisCylinder = new THREE.Mesh(axisGeometry, xAxisMaterial);
    xAxisCylinder.rotateX(Math.PI / 2);
    xAxisCylinder.position.x = -20;
    xAxisCylinder.position.y = -20;
    this.scene.add(xAxisCylinder);
    const yAxisMaterial = new THREE.MeshBasicMaterial({ color: 0x0000cc });
    const yAxisCylinder = new THREE.Mesh(axisGeometry, yAxisMaterial);
    yAxisCylinder.position.x = -20;
    yAxisCylinder.position.z = -20;
    this.scene.add(yAxisCylinder);
    const zAxisMaterial = new THREE.MeshBasicMaterial({ color: 0xdd0000 });
    const zAxisCylinder = new THREE.Mesh(axisGeometry, zAxisMaterial);
    zAxisCylinder.rotateZ(Math.PI / 2);
    zAxisCylinder.position.z = -20;
    zAxisCylinder.position.y = -20;
    this.scene.add(zAxisCylinder);

    this.scene.add(this.shape);

    const clippingPlane = [0.1, 1000];
    this.camera = new THREE.PerspectiveCamera(75, 1, ...clippingPlane);
    this.camera.position.x = 22;
    this.camera.position.y = 13;
    this.camera.position.z = 31;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });
    this.renderer.setSize(width, height);
    if (window) this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.VSMShadowMap;

    this.controls = new OrbitControls(this.camera, this.canvas);

    requestAnimationFrame(this.update.bind(this));
  }

  private update() {
    this.renderer.render(this.scene, this.camera);

    this.controls.update();

    requestAnimationFrame(this.update.bind(this));
  }
}
