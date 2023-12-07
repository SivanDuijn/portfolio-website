import { saveAs } from "file-saver";
import toast from "react-hot-toast";
import * as THREE from "three";
import { STLExporter } from "three/addons/exporters/STLExporter.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Triplet } from "../lib/buildTriplet";
import { greedyMesh } from "../lib/greedyMesh";

/** Renders a triplet */
export default class TripletThreeJSViewGL {
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;

  private tripletMesh: THREE.Mesh | undefined;

  public canvas?: HTMLCanvasElement;

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
  }

  /** Build a triplet object from 3D grid triplet definition, and updates the rendered canvas. */
  public updateTriplet(triplet: Triplet) {
    const material = new THREE.MeshLambertMaterial({ color: 0xbd9476 }); //color: 0xbd9476 });
    // const lineMaterial = new THREE.LineBasicMaterial({ color: 0x1c1c1c });

    const { vertices, indices } = greedyMesh(triplet);

    const geometry = new THREE.BufferGeometry();

    const verticesFloat32 = Float32Array.from(vertices);

    geometry.setIndex(indices);
    geometry.setAttribute("position", new THREE.BufferAttribute(verticesFloat32, 3));
    geometry.computeVertexNormals();
    geometry.translate(-triplet.dims[0] / 2, -triplet.dims[1] / 2, -triplet.dims[2] / 2);

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    if (this.tripletMesh) this.scene.remove(this.tripletMesh);
    this.tripletMesh = mesh;
    // const edges = new THREE.EdgesGeometry(geometry);
    // const lines = new THREE.LineSegments(edges, lineMaterial);
    // shapeGroup.add(lines);

    // this.shape.add(shapeGroup);
    this.scene.add(this.tripletMesh);
  }

  constructor(canvas: HTMLCanvasElement | undefined, width = 600, height = 600) {
    this.canvas = canvas;

    const clippingPlane = [0.1, 1000];
    this.camera = new THREE.PerspectiveCamera(75, 1, ...clippingPlane);
    this.camera.position.x = 37;
    this.camera.position.y = 19;
    this.camera.position.z = 41;
    // this.camera.lookAt(new THREE.Vector3(100, 30, 0));

    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });
    this.renderer.setSize(width, height);
    if (window) this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; //THREE.VSMShadowMap;

    this.controls = new OrbitControls(this.camera, this.canvas);

    this.scene = new THREE.Scene();

    // LIGHTS
    const xySpotLight = new THREE.SpotLight(0xfff6d1, 0.8, 0, Math.PI / 16, 1, 1);
    xySpotLight.position.set(0, 0, 150);
    xySpotLight.castShadow = true;
    xySpotLight.shadow.mapSize.width = 256;
    xySpotLight.shadow.mapSize.height = 256;

    const xzSpotLight = new THREE.SpotLight();
    xzSpotLight.copy(xySpotLight, true);
    xzSpotLight.position.set(0, 150, 0);

    const yzSpotLight = new THREE.SpotLight();
    yzSpotLight.copy(xySpotLight, true);
    yzSpotLight.position.set(150, 0, 0);

    this.scene.add(xySpotLight);
    this.scene.add(xzSpotLight);
    this.scene.add(yzSpotLight);

    // const sph = new THREE.SpotLightHelper(xySpotLight);
    // this.scene.add(sph);

    const AmbientLight = new THREE.AmbientLight(0xffffff, 0.15); // soft white light
    this.scene.add(AmbientLight);

    // PLANES
    const planeGeometry = new THREE.PlaneGeometry(80, 80);
    const planeMaterial = new THREE.MeshStandardMaterial();
    const xyPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    xyPlane.position.z = -40;
    xyPlane.receiveShadow = true;
    this.scene.add(xyPlane);
    xySpotLight.target = xyPlane;

    const xzPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    xzPlane.rotateX(-Math.PI / 2);
    xzPlane.position.y = -40;
    xzPlane.receiveShadow = true;
    this.scene.add(xzPlane);
    xzSpotLight.target = xzPlane;

    const yzPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    yzPlane.rotateY(Math.PI / 2);
    yzPlane.position.x = -40;
    yzPlane.receiveShadow = true;
    this.scene.add(yzPlane);
    yzSpotLight.target = yzPlane;

    // AXIS
    const axisGeometry = new THREE.CylinderGeometry(0.3, 0.3, 80, 32);
    const xAxisMaterial = new THREE.MeshBasicMaterial({ color: 0x00aa00 });
    const xAxisCylinder = new THREE.Mesh(axisGeometry, xAxisMaterial);
    xAxisCylinder.rotateX(Math.PI / 2);
    xAxisCylinder.position.x = -40;
    xAxisCylinder.position.y = -40;
    this.scene.add(xAxisCylinder);
    const yAxisMaterial = new THREE.MeshBasicMaterial({ color: 0x0000cc });
    const yAxisCylinder = new THREE.Mesh(axisGeometry, yAxisMaterial);
    yAxisCylinder.position.x = -40;
    yAxisCylinder.position.z = -40;
    this.scene.add(yAxisCylinder);
    const zAxisMaterial = new THREE.MeshBasicMaterial({ color: 0xdd0000 });
    const zAxisCylinder = new THREE.Mesh(axisGeometry, zAxisMaterial);
    zAxisCylinder.rotateZ(Math.PI / 2);
    zAxisCylinder.position.z = -40;
    zAxisCylinder.position.y = -40;
    this.scene.add(zAxisCylinder);

    // this.scene.add(this.tripletMesh);

    requestAnimationFrame(this.update.bind(this));
  }

  private update() {
    this.renderer.render(this.scene, this.camera);

    this.controls.update();

    requestAnimationFrame(this.update.bind(this));
  }
}
