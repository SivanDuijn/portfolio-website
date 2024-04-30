import { saveAs } from "file-saver";
import toast from "react-hot-toast";
import * as THREE from "three";
import { STLExporter } from "three/addons/exporters/STLExporter.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { greedyMeshSetVolume, greedyMeshTriplet } from "../lib/greedyMesh";
import { Triplet } from "../models";
import createVoxelGeometry from "./createVoxelGeometry";

// const rotationalAxis = new THREE.Vector3(Math.sqrt(3), Math.sqrt(3), Math.sqrt(3));
// const halfPI = (Math.PI * 2) / 9;

/** Renders a triplet */
export default class TripletThreeJSViewGL {
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;

  private tripletMesh: THREE.Mesh | undefined;
  private tripletGroup = new THREE.Group();
  private outlineGroup = new THREE.Group();
  private outlineOffsetVec: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  private outlineOffset = 0.02;

  // These are used to store all objects like lights and planes for different render types
  private scientificGroup = new THREE.Group();
  private singleShadowGroup = new THREE.Group();

  private showRemovedComponents = false;
  private rotate = false;

  private actions: THREE.AnimationAction[] = [];
  private clock = new THREE.Clock();

  private triplet: Triplet | null = null;

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
    this.tripletMesh = undefined;

    this.tripletGroup.clear();
    this.outlineGroup.clear();
  }

  public setShowRemovedComponents(v: boolean) {
    this.showRemovedComponents = v;
    if (this.triplet) this.updateTriplet(this.triplet);
  }

  public setRotate(v: boolean) {
    this.rotate = v;
    if (v) this.actions.forEach((a) => a.play());
    else this.actions.forEach((a) => a.stop());
  }

  public setSpotLight(v: boolean) {
    const size = new THREE.Vector2();
    this.renderer.getSize(size);

    if (v) {
      this.camera.setViewOffset(size.x, size.y, -100, 0, size.x, size.y);
      this.scene.background = new THREE.Color(0x3d3d3d);
      this.scene.remove(this.scientificGroup);
      this.scene.add(this.singleShadowGroup);
    } else {
      this.camera.setViewOffset(size.x, size.y, 0, 50, size.x, size.y);
      this.scene.background = new THREE.Color("white");
      this.scene.remove(this.singleShadowGroup);
      this.scene.add(this.scientificGroup);
    }
  }

  /** Build a mesh from 3D grid triplet definition, and updates the rendered canvas. */
  public updateTriplet(triplet: Triplet) {
    this.actions.forEach((a) => a.stop());
    this.triplet = triplet;
    this.tripletGroup.clear();
    this.outlineGroup.clear();

    const { vertices, indices, lines } = greedyMeshTriplet(triplet);

    const { mesh, outline } = createVoxelGeometry(vertices, indices, lines, triplet.dims, 0x67c2cf); //36c9b8
    this.tripletGroup.add(mesh);
    this.tripletMesh = mesh;

    this.outlineGroup.add(outline);

    // If there are any removed components, show them if option is enabled
    if (this.showRemovedComponents) {
      // orange, blue, yellow, red, green
      const colors = [0xed9078, 0xeed490, 0x96bfcf, 0xf7ba88, 0x9ae4dc];
      triplet.removedComponents.forEach((rc, i) => {
        const { vertices, indices, lines } = greedyMeshSetVolume(rc, triplet.dims);
        const { mesh, outline } = createVoxelGeometry(
          vertices,
          indices,
          lines,
          triplet.dims,
          colors[i % 5],
        );

        this.tripletGroup.add(mesh);
        this.outlineGroup.add(outline);
      });
    }

    // const times = [0, 2, 3, 5, 6, 8, 9];
    const times = [0, 1, 2, 3, 4, 5, 6];

    const hPI = Math.PI / 2;

    // Extra rotations needed if the shape planes were rotated
    const reverseR = (r: number) => (r > Math.PI * 1.5 ? -hPI : r); // reverse rotation if rotating 270 degrees
    const er1 = hPI * triplet.rotations[0];
    const er2 = hPI * triplet.rotations[1];
    const er3 = hPI * triplet.rotations[2];

    // x, y, z rotations per shapeplane
    const sp1R = [er1, 0, 0];
    const sp2R = [0, reverseR(er2 + hPI), -hPI];
    const sp3R = [hPI, reverseR(-er3 + hPI), hPI];
    // const sp1R = [er1, 0, 0];
    // const sp2R = [0, reverseR(er2 - hPI), 0];
    // const sp3R = [hPI, reverseR(-er3), 0];

    const aX = new THREE.Vector3(1, 0, 0).normalize();
    const aY = new THREE.Vector3(0, 1, 0).normalize();
    const aZ = new THREE.Vector3(0, 0, 1).normalize();

    const spRsToArr = (rs: number[]) => {
      const qX = new THREE.Quaternion().setFromAxisAngle(aX, rs[0]);
      const qY = new THREE.Quaternion().setFromAxisAngle(aY, rs[1]);
      const qZ = new THREE.Quaternion().setFromAxisAngle(aZ, rs[2]);
      const q = qZ.multiply(qY.multiply(qX));

      return [q.x, q.y, q.z, q.w];
    };

    const quaternionKFs = new THREE.QuaternionKeyframeTrack(".quaternion", times, [
      ...spRsToArr(sp1R),
      ...spRsToArr(sp1R),
      ...spRsToArr(sp2R),
      ...spRsToArr(sp2R),
      ...spRsToArr(sp3R),
      ...spRsToArr(sp3R),
      ...spRsToArr(sp1R),
    ]);

    // just one track for now
    const tracks = [quaternionKFs];

    // use duration -1 to automatically calculate duration
    const clip = new THREE.AnimationClip(undefined, -1, tracks);
    this.actions = [];
    this.actions.push(new THREE.AnimationMixer(this.tripletGroup).clipAction(clip));
    this.actions.push(new THREE.AnimationMixer(this.outlineGroup).clipAction(clip));

    if (this.rotate) this.actions.forEach((a) => a.play());
  }

  constructor(canvas: HTMLCanvasElement | undefined, width = 600, height = 600) {
    const clippingPlane = [0.1, 1000];
    this.camera = new THREE.PerspectiveCamera(50, 1, ...clippingPlane);
    this.camera.setViewOffset(width, height, 0, 50, width, height);
    this.camera.position.set(43, 16, 47);
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enablePan = false;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });
    this.renderer.setSize(width, height);
    if (window) this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; //THREE.VSMShadowMap;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("white");

    // LIGHTS
    const addLight = (x: number, y: number, z: number, i: number) => {
      const light = new THREE.DirectionalLight(0xffffff, i);
      light.position.set(x, y, z); //default; light shining from top
      light.castShadow = true;
      light.shadow.mapSize.width = 255;
      light.shadow.mapSize.height = 255;
      light.shadow.camera.left = -20;
      light.shadow.camera.right = 20;
      light.shadow.camera.top = 20;
      light.shadow.camera.bottom = -20;
      light.shadow.radius = 3;
      light.shadow.blurSamples = 15;
      this.scientificGroup.add(light);
    };
    addLight(0, 200, 0, 1);
    addLight(200, 0, 0, 0.8);
    addLight(0, 0, 200, 0.9);

    // const helper = new THREE.DirectionalLightHelper(lightFront, 5);
    // this.scene.add(helper);

    const lightBottom = new THREE.DirectionalLight(0xffffff, 0.4);
    lightBottom.position.set(0, -10, 0); //default; light shining from top
    this.scene.add(lightBottom);
    const lightLeft = new THREE.DirectionalLight(0xffffff, 0.45);
    lightLeft.position.set(-10, 0, 0); //default; light shining from top
    this.scene.add(lightLeft);
    const lightBack = new THREE.DirectionalLight(0xffffff, 0.35);
    lightBack.position.set(0, 0, -10); //default; light shining from top
    this.scene.add(lightBack);

    // 0.075 when not fancy
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.075); // soft white light
    this.scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 0.8, 0, Math.PI / 30, 1, 1);
    spotLight.position.set(150, 0, 0);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 256;
    spotLight.shadow.mapSize.height = 256;
    this.singleShadowGroup.add(spotLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 30, 20);
    this.singleShadowGroup.add(dirLight);
    // this.scene.add(new THREE.DirectionalLightHelper(dirLight, 5));

    // PLANES
    const planeGeometry = new THREE.PlaneGeometry(400, 400);
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
    this.scientificGroup.add(planeBottom);
    this.scientificGroup.add(planeLeft);
    this.scientificGroup.add(planeBack);

    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xcfcfcf }); //0x9f9f9f });
    const yzPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    yzPlane.rotateY(Math.PI / 2);
    yzPlane.position.x = -40;
    yzPlane.receiveShadow = true;
    this.singleShadowGroup.add(yzPlane);
    spotLight.target = yzPlane;

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
    this.scientificGroup.add(xAxisCylinder);
    this.scientificGroup.add(yAxisCylinder);
    this.scientificGroup.add(zAxisCylinder);

    this.scene.add(this.tripletGroup);
    this.scene.add(this.outlineGroup);
    this.scene.add(this.scientificGroup);

    requestAnimationFrame(this.update.bind(this));
  }

  private update() {
    requestAnimationFrame(this.update.bind(this));
    this.renderer.render(this.scene, this.camera);

    this.controls.update();

    this.outlineGroup.position.sub(this.outlineOffsetVec);

    this.outlineOffsetVec = new THREE.Vector3(
      this.camera.position.x,
      this.camera.position.y,
      this.camera.position.z,
    ).normalize();
    this.outlineOffsetVec.multiplyScalar(this.outlineOffset);
    this.outlineGroup.position.add(this.outlineOffsetVec);

    const delta = this.clock.getDelta();
    this.actions.forEach((a) => a.getMixer().update(delta));
  }
}
