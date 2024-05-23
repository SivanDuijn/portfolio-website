import * as THREE from "three";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import getOutlinedDisc from "@/lib/threeOutlinedDisc";
import WSDWire from "./WSDWire";

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
  private footerDisc: THREE.Mesh;

  private lineMaterial: LineMaterial;

  private wires: WSDWire[] = [];
  private currentWire: WSDWire | undefined;
  private tempLine = new Line2(new LineGeometry());
  private tempStart = new THREE.Vector3();
  private lanternsShown = true;

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
    this.controls.target.set(0, 9, 0);

    this.renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    this.renderer.setSize(width, height);
    if (window) this.renderer.setPixelRatio(window.devicePixelRatio);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xfffdf0);

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

    this.loadFromLocalStorage();

    this.scene.add(this.group);

    const { mesh, lines } = getOutlinedDisc(6, 20, 5, 0xffd0a8, resolution);
    this.footerDisc = mesh;
    this.scene.add(mesh);
    lines.forEach((l) => this.scene.add(l));

    // this.scene.add(new THREE.Mesh(new THREE.SphereGeometry(1, 10, 10)));

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

    if (window) {
      window.onkeydown = (e) => {
        if (e.key == "Alt" && this.state == "newWireStart") selectWire();
      };
      window.onkeyup = (e) => {
        if (e.key == "Alt" && this.state == "newWireStart")
          this.wires.forEach((w) => w.resetColor());
      };
    }

    if (this.canvas) {
      this.canvas.onclick = (e) => {
        // Delete wire
        if (e.ctrlKey) {
          if (this.state == "addingToWire") {
            // Finishing up current line
            if (this.currentWire) {
              this.currentWire.addLanternToEnd(this.wires);
              if (this.lanternsShown) this.currentWire.showLantern();
            }
            this.saveToLocalStorage();
          }
          this.state = "newWireStart";
          this.tempLine.geometry.setPositions(new Float32Array([0, 0, 0, 0, 0, 0]));
        } else if (e.altKey && this.state == "newWireStart") {
          const wireIndex = selectWire();
          if (wireIndex == -1) return;
          this.group.remove(this.wires[wireIndex].linesGroup);
          // Add color back in pool
          const c = this.wires[wireIndex].color;
          this.colorPool.push(c);
          this.wires.splice(wireIndex, 1);
          this.saveToLocalStorage();
        } //
        else if (e.shiftKey) {
          if (this.state == "newWireStart") {
            // Intersect with disc where y = 0
            const intersections = this.raycaster.intersectObject(this.footerDisc);
            if (intersections.length == 0) return;

            const point = intersections[0].point;
            if (point.y != 0) return;

            this.tempStart = point;
            this.state = "newWireHeight";
          } //
          else if (this.state == "newWireHeight") {
            const p2 = getNewWireHeight();
            const newWire = new WSDWire(
              this.lineMaterial,
              this.popColorFromPool(),
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

  public showLanterns() {
    this.wires.forEach((w) => w.showLantern());
    this.lanternsShown = true;
  }
  public hideLanterns() {
    this.wires.forEach((w) => w.hideLantern());
    this.lanternsShown = false;
  }

  private update() {
    requestAnimationFrame(this.update.bind(this));
    this.renderer.render(this.scene, this.camera);

    this.controls.update();
  }

  private popColorFromPool() {
    return this.colorPool.pop() ?? new THREE.Color(Math.random(), Math.random(), Math.random());
  }

  private saveToLocalStorage() {
    const s = this.wires.map((w) => w.serialize()).join("$$");
    localStorage.setItem("wires", s);
  }
  private loadFromLocalStorage() {
    const text = localStorage.getItem("wires");
    if (text?.length == 0) return;
    const wires = text
      ?.split("$$")
      .filter((w) => !w.includes("NaN"))
      .map((w) => WSDWire.fromString(w, this.lineMaterial));

    if (!wires) return;

    // Remove known colors from color pool
    wires.forEach((w) => {
      const i = this.colorPool.findIndex((c) => c.getHex() == w.color.getHex());
      if (i >= 0) this.colorPool.splice(i, 1);
      w.addLanternToEnd(wires);
      if (this.lanternsShown) w.showLantern();
    });
    // Add meshes to group to render
    wires.forEach((w) => this.group.add(w.linesGroup));

    this.wires = wires;
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

// wires backup
// 0.20563039974370412,0,-0.4428556452672343;0.20563039974370412,11.354290770276823,-0.4428556452672343;2.0550323642304633,11.354290770276823,-0.4428556452672343;2.0550323642304633,11.354290770276823,2.7308741001282613;2.0550323642304633,19.004232000673074,2.7308741001282613;2.0550323642304633,19.004232000673074,5.258322630773497;8.855393945219877,19.004232000673074,5.258322630773497;8.855393945219877,17.417239116579573,5.258322630773497color=16769305 -0.32587458219262544,7.105427357601002e-15,0.129255551327482;-0.32587458219262544,14.401383060110899,0.129255551327482;-0.32587458219262544,14.401383060110899,2.158907632633351;-4.235986938976277,14.401383060110899,2.158907632633351;-4.235986938976277,22.11291070976989,2.158907632633351;-11.050009360717356,22.11291070976989,2.158907632633351;-11.050009360717356,20.178075609844036,2.158907632633351color=3978315 0.6702267361003855,0,-0.6843045088157567;0.6702267361003855,10.255400650983145,-0.6843045088157567;5.753414187212095,10.255400650983145,-0.6843045088157567;5.753414187212095,17.579377711087755,-0.6843045088157567;5.753414187212095,17.579377711087755,-5.59421876109576;5.753414187212095,19.170370227365463,-5.59421876109576;5.753414187212095,19.170370227365463,-8.458436629468682;5.753414187212095,17.370907177460527,-8.458436629468682;5.753414187212095,17.370907177460527,-8.412421413634393;5.753414187212095,16.64149762722439,-8.412421413634393color=15741670 0.41725400526249246,0,0.07643846070859084;0.41725400526249246,16.432586320151554,0.07643846070859084;0.41725400526249246,16.432586320151554,12.530840419555078;0.41725400526249246,14.162814665407069,12.530840419555078;0.41725400526249246,14.162814665407069,8.925850539517285;0.41725400526249246,11.708709972396395,8.925850539517285color=4649200 -0.2183159469417042,0,-0.24557857824338036;-0.2183159469417042,16.102239188898636,-0.24557857824338036;-0.2183159469417042,16.102239188898636,-1.578808391173561;-2.3452560952652597,16.102239188898636,-1.578808391173561;-2.3452560952652597,19.100301335294034,-1.578808391173561;-2.3452560952652597,19.100301335294034,-8.405399487253625;-2.3452560952652597,17.716272359462504,-8.405399487253625;-2.3452560952652597,17.716272359462504,-9.933102848767765;-2.3452560952652597,16.656550629378557,-9.933102848767765color=4416472 -0.23684559811948347,0,-0.7272310444830277;-0.23684559811948347,12.321007652384807,-0.7272310444830277;-0.23684559811948347,12.321007652384807,-3.827671520416062;-0.23684559811948347,16.25209091735063,-3.827671520416062;-6.648693372039329,16.25209091735063,-3.827671520416062;-6.648693372039329,11.789928529354057,-3.827671520416062color=12383756 0.5820133435922088,-7.105427357601002e-15,-0.03122428989921744;0.5820133435922088,24.799007968695022,-0.03122428989921744;4.255028527314849,24.799007968695022,-0.03122428989921744;4.255028527314849,26.58656557367383,-0.03122428989921744;9.210624803852426,26.58656557367383,-0.03122428989921744;9.210624803852426,24.06000643039935,-0.03122428989921744color=15079755 0.24159630537825194,0,0.04403253010080377;0.24159630537825194,18.157421696852158,0.04403253010080377;-2.875275090016018,18.157421696852158,0.04403253010080377;-2.875275090016018,18.157421696852158,6.922256031299829;-0.06954963988764362,18.157421696852158,6.922256031299829;-0.06954963988764362,13.456260058379115,6.922256031299829;-0.06954963988764362,13.456260058379115,8.948349333570503;-0.06954963988764362,11.798375013968258,8.948349333570503color=16089649 0.08042096081972083,0,-0.4722835687749338;0.08042096081972083,16.351194304672596,-0.4722835687749338;2.476324416750977,16.351194304672596,-0.4722835687749338;2.476324416750977,21.248415329112934,-0.4722835687749338;4.391627257228103,21.248415329112934,-0.4722835687749338;4.391627257228103,21.248415329112934,5.0170741415166455;4.391627257228103,19.970629385044518,5.0170741415166455;8.800217219512056,19.970629385044518,5.0170741415166455;8.800217219512056,17.460566178762313,5.0170741415166455color=9510580 0.29554479503745223,0,-0.5472922236714481;0.29554479503745223,13.90910974634403,-0.5472922236714481;3.2338143647026896,13.90910974634403,-0.5472922236714481;3.2338143647026896,13.90910974634403,-4.061671789988098;3.2338143647026896,20.093696054821002,-4.061671789988098;3.2338143647026896,20.093696054821002,-8.605297831037873;3.2338143647026896,18.49664471474798,-8.605297831037873;5.571616948484742,18.49664471474798,-8.605297831037873;5.571616948484742,16.75001909408173,-8.605297831037873color=11206595 0.14997896841476432,0,-0.7197396096931072;0.14997896841476432,21.82414379765143,-0.7197396096931072;0.14997896841476432,21.82414379765143,-2.648560280406617;0.14997896841476432,23.958714253495074,-2.648560280406617;2.9029131574260987,23.958714253495074,-2.648560280406617;2.9029131574260987,24.776299788124973,-2.648560280406617;2.9029131574260987,24.776299788124973,-1.0620512973668355;9.343498243481534,24.776299788124973,-1.0620512973668355;9.343498243481534,24.692814776960212,-1.0620512973668355;9.343498243481534,24.692814776960212,-0.22158421092541625;9.343498243481534,24.069122219334858,-0.22158421092541625color=8388608 0.005825034644488802,0,0.26508637248834055;0.005825034644488802,20.048175345369827,0.26508637248834055;0.005825034644488802,20.048175345369827,3.9621189913326305;-4.24321478129105,20.048175345369827,3.9621189913326305;-4.24321478129105,18.413931476124745,3.9621189913326305;-5.70856882436275,18.413931476124745,3.9621189913326305;-5.70856882436275,21.899221955854166,3.9621189913326305;-8.95395553885814,21.899221955854166,3.9621189913326305;-8.95395553885814,21.899221955854166,3.222675181602721;-11.266273291971773,21.899221955854166,3.222675181602721;-11.266273291971773,21.899221955854166,2.4706518754659053;-11.266273291971773,20.13669458846172,2.4706518754659053color=8421376
