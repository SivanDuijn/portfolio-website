import saveAs from "file-saver";
import * as THREE from "three";
import { BoxHelper } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { VertexNormalsHelper } from "three/examples/jsm/helpers/VertexNormalsHelper";
import LoadOBJModel from "../lib/OBJLoader";
import LoadOFFModel from "../lib/OFFLoader";
import { initialState } from "../lib/contexts";
import { ModelState } from "../lib/contexts/reducer";
import GetModelStats from "../lib/getModelStats";
import { GetModelfiletype, CreateThreeLineBox } from "../lib/utils";

export const PI2 = Math.PI * 2;

export enum RenderMaterial {
  Flat,
  Phong,
  Normals,
  WireframeOnly,
  PointCloud,
  Cartoon,
}

export default class ThreeJSViewGL {
  private totalTime = 0;

  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;

  private group: THREE.Group = new THREE.Group();
  private mesh?: THREE.Mesh;
  private wireframe?: THREE.LineSegments;
  private vertexNormalsHelper?: VertexNormalsHelper;
  private pointCloud?: THREE.Points;
  private unitBox?: THREE.LineSegments<
    THREE.EdgesGeometry<THREE.BoxGeometry>,
    THREE.LineBasicMaterial
  >;
  private boundingBox?: BoxHelper;

  private material: THREE.Material = new THREE.Material();

  // OPTIONS
  private renderMaterial: RenderMaterial;
  private vertexNormalsEnabled: boolean;
  private wireframeEnabled: boolean;
  private autoRotateEnabled: boolean;
  private boundingBoxEnabled = true;
  private unitBoxEnabled = true;

  private mouseIsDown = true;

  private onModelStatsChanged?: (stats: ModelState["modelStats"]) => void;
  private currentModel: string | undefined;

  private captureNextFrame = false;

  public canvas?: HTMLCanvasElement;

  constructor(
    canvas: HTMLCanvasElement | undefined,
    width = 600,
    height = 600
  ) {
    this.canvas = canvas;

    this.renderMaterial = initialState.renderSettings.material;
    this.wireframeEnabled = initialState.renderSettings.showWireframe;
    this.vertexNormalsEnabled = initialState.renderSettings.showVertexNormals;
    this.autoRotateEnabled = initialState.renderSettings.autoRotateEnabled;

    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });
    // objects which are near or far away won't be rendered
    const clippingPlane = [0.1, 1000];
    this.camera = new THREE.PerspectiveCamera(75, 1, ...clippingPlane);

    this.renderer.setSize(width, height);
    if (window) this.renderer.setPixelRatio(window.devicePixelRatio);

    const pointLight = new THREE.PointLight(0xffffff, 2.4, 100);
    pointLight.position.set(50, 20, 40);
    this.scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0x404040, 1.4); // soft white light
    this.scene.add(ambientLight);

    this.scene.add(this.group);

    this.scene.background = new THREE.Color(0x000000);

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableRotate = false;

    this.camera.position.z = 1.4;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.setMaterial(this.renderMaterial);

    requestAnimationFrame(this.update.bind(this));
  }

  setOnModelStatsChanged(
    onModelStatsChanged: (stats: ModelState["modelStats"]) => void
  ) {
    this.onModelStatsChanged = onModelStatsChanged;
  }

  loadModelByText(text: string, modelName?: string) {
    let filetype: string | null = "OFF";
    if (modelName) filetype = GetModelfiletype(modelName);
    if (filetype === null) alert("Model file type not supported!");
    this.currentModel = modelName;

    const oldRotation = this.group.rotation;

    // Remove group and create new to reset rotations
    this.group.clear();
    this.group = new THREE.Group();

    const geometry =
      filetype == "OFF" ? LoadOFFModel(text) : LoadOBJModel(text);
    this.mesh = new THREE.Mesh(geometry, this.material);
    if (this.onModelStatsChanged && modelName)
      this.onModelStatsChanged(GetModelStats(modelName, this.mesh));

    this.vertexNormalsHelper = new VertexNormalsHelper(
      this.mesh,
      0.05,
      0xff0000
    );
    if (!this.vertexNormalsEnabled) this.vertexNormalsHelper.visible = false;

    this.wireframe = new THREE.LineSegments(
      new THREE.WireframeGeometry(this.mesh.geometry),
      new THREE.LineBasicMaterial({ color: 0x636363 })
    );
    if (
      !this.wireframeEnabled ||
      this.renderMaterial == RenderMaterial.WireframeOnly
    )
      this.wireframe.visible = false;

    this.pointCloud = new THREE.Points(
      this.mesh.geometry,
      new THREE.PointsMaterial({ size: 0.003, color: 0xffffff })
    );
    this.pointCloud.visible = false;
    if (this.renderMaterial == RenderMaterial.PointCloud) {
      this.pointCloud.visible = true;
      this.mesh.visible = false;
    }

    this.boundingBox = new THREE.BoxHelper(this.mesh, 0xff0000);
    if (!this.boundingBoxEnabled) this.boundingBox.visible = false;
    this.unitBox = CreateThreeLineBox(1, 1, 1, 0x7d7d7d);
    if (!this.unitBoxEnabled) this.unitBox.visible = false;

    // Add unit bounding box
    this.group.add(this.boundingBox);
    // Add model boundingbox
    this.group.add(this.unitBox);
    this.group.add(this.wireframe);
    this.group.add(this.pointCloud);
    this.group.add(this.mesh);
    this.scene.add(this.group);

    this.group.add(this.vertexNormalsHelper);

    this.group.rotation.x = oldRotation.x;
    this.group.rotation.y = oldRotation.y;
    this.group.rotation.z = oldRotation.z;
  }

  loadModelByUrl(url: string) {
    fetch(url)
      .then((response) => response.text())
      .then((text) => {
        const m = url.split("/");
        this.loadModelByText(text, m[m.length - 1]);
      });
  }

  // SET OPTIONS FUNCTIONS
  setMaterial(renderMaterial: RenderMaterial) {
    if (this.renderMaterial == renderMaterial && this.mesh) return;

    this.renderMaterial = renderMaterial;

    const options = {
      color: 0xf7e5ae,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    };

    if (this.mesh) this.mesh.visible = true;
    if (this.wireframeEnabled && this.wireframe && !this.wireframe.visible)
      this.wireframe.visible = true;
    if (this.renderMaterial != RenderMaterial.PointCloud && this.pointCloud)
      this.pointCloud.visible = false;
    // if (this.renderMaterial != RenderMaterial.PointCloud && this.mesh && !this.mesh.visible)

    switch (renderMaterial) {
      case RenderMaterial.Phong:
        this.material = new THREE.MeshPhongMaterial(options);
        break;

      case RenderMaterial.WireframeOnly:
        this.material = new THREE.MeshPhongMaterial({
          ...options,
          wireframe: true,
          color: 0x30ea1c,
        });
        if (this.wireframe) this.wireframe.visible = false;
        break;

      case RenderMaterial.Normals:
        this.material = new THREE.MeshNormalMaterial(options);
        break;

      case RenderMaterial.Cartoon:
        this.material = new THREE.MeshToonMaterial({
          ...options,
          color: 0x049ef4,
        });

        break;

      case RenderMaterial.PointCloud:
        if (this.mesh && this.pointCloud && this.wireframe) {
          this.material = new THREE.MeshBasicMaterial({
            opacity: 0,
            transparent: true,
          });
          this.pointCloud.visible = true;
        }
        break;

      default:
        this.material = new THREE.MeshStandardMaterial({
          ...options,
          flatShading: true,
        });
        break;
    }

    if (this.mesh) this.mesh.material = this.material;
  }
  showVertexNormals(show: boolean) {
    if (this.vertexNormalsEnabled == show) return;

    this.vertexNormalsEnabled = show;

    if (this.vertexNormalsHelper)
      this.vertexNormalsHelper.visible = this.vertexNormalsEnabled;
  }
  showWireframe(show: boolean) {
    if (this.wireframeEnabled == show) return;

    this.wireframeEnabled = show;
    if (this.wireframe) this.wireframe.visible = this.wireframeEnabled;
  }
  showBoundingBox(show: boolean) {
    if (this.boundingBoxEnabled == show) return;
    this.boundingBoxEnabled = show;
    if (this.boundingBox) this.boundingBox.visible = this.boundingBoxEnabled;
  }
  showUnitBox(show: boolean) {
    if (this.unitBoxEnabled == show) return;
    this.unitBoxEnabled = show;
    if (this.unitBox) this.unitBox.visible = this.unitBoxEnabled;
  }
  setAutoRotateEnabled(enabled: boolean) {
    this.autoRotateEnabled = enabled;
  }
  setCameraZ(z: number) {
    this.camera.position.z = z;
  }
  capture() {
    this.captureNextFrame = true;
  }
  // ---

  onMouseDown() {
    this.mouseIsDown = false;
  }
  onMouseUp() {
    this.mouseIsDown = true;
  }
  onMouseDrag(xd: number, yd: number) {
    if (this.mesh) {
      this.group.rotation.y += xd / 125;
      this.group.rotation.x += yd / 125;
    }
  }

  private update(time: number) {
    time *= 0.001; // convert time to seconds
    const deltaTime = time - this.totalTime;
    this.totalTime = time;

    this.renderer.render(this.scene, this.camera);

    if (this.captureNextFrame) {
      this.canvas?.toBlob(
        (blob) => {
          if (blob) saveAs(blob, this.currentModel?.split(".")[0] + ".png");
        },
        "image/png",
        1
      );

      this.captureNextFrame = false;
    }

    this.controls.update();

    if (this.mesh && this.mouseIsDown && this.autoRotateEnabled)
      this.group.rotation.y += PI2 * 0.05 * deltaTime; // 0.05 revolutions per second

    requestAnimationFrame(this.update.bind(this));
  }
}
