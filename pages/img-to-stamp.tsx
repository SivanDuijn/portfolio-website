import clsx from "clsx";
import saveAs from "file-saver";
import { useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { STLExporter } from "three/examples/jsm/exporters/STLExporter.js";
import Button from "@/components/triplets/atoms/Button";

export default function ImageToStamp() {
  const imageCanvasRef = useRef<HTMLCanvasElement>(null);
  const threeCanvasRef = useRef<HTMLCanvasElement>(null);
  const viewGLRef = useRef<StampThreeJSViewGL>();
  const whiteThreshold = useRef<number>(255);
  const blackThreshold = useRef<number>(0);
  const depth = useRef<number>(0.05);

  const imageDataRef = useRef<ImageData>();

  useEffect(() => {
    viewGLRef.current = new StampThreeJSViewGL(threeCanvasRef.current || undefined);
  }, []);

  const onFileChange = useCallback(
    (files: FileList | null) => {
      if (files == null || files.length == 0) return;
      const context = imageCanvasRef.current?.getContext("2d");
      if (!context) return;

      const image = new Image();
      image.onload = () => {
        if (!imageCanvasRef.current) return;
        imageCanvasRef.current.width = image.width;
        imageCanvasRef.current.height = image.height;

        context.drawImage(image, 0, 0, image.width, image.height);

        const imageData = context.getImageData(0, 0, image.width, image.height);
        imageDataRef.current = imageData;
        calculateMesh();
      };

      const fr = new FileReader();
      fr.onload = () => {
        if (typeof fr.result == "string") image.src = fr.result;
      };
      fr.readAsDataURL(files[0]);
    },
    [imageCanvasRef.current],
  );

  const calculateMesh = useCallback(() => {
    if (imageDataRef.current)
      viewGLRef.current?.setMesh(
        imageDataRef.current,
        whiteThreshold.current,
        blackThreshold.current,
        depth.current,
      );
  }, []);

  return (
    <div className={clsx("text-black", "bg-white", "min-h-[100svh]")}>
      <div className={clsx("flex", "justify-evenly", "items-center")}>
        <input
          type="file"
          id="img"
          name="img"
          accept="image/png, image/jpeg"
          onChange={(event) => onFileChange(event.target.files)}
        />
        <div className={clsx("flex", "my-4", "font-mono")}>
          <div>
            <p>White threshold</p>
            <input
              type="range"
              step={10}
              defaultValue={0}
              min={0}
              max={255}
              className={clsx(
                "transparent",
                "h-[4px]",
                "w-full",
                "rounded",
                "cursor-pointer",
                "appearance-none",
                "border-transparent",
                "bg-red-500",
              )}
              onChange={(e) => {
                whiteThreshold.current = 255 - parseFloat(e.target.value);
                calculateMesh();
              }}
            />
          </div>
          <div className={clsx("ml-8")}>
            <p>Black threshold</p>
            <input
              type="range"
              step={10}
              defaultValue={0}
              min={0}
              max={255}
              className={clsx(
                "transparent",
                "h-[4px]",
                "w-full",
                "rounded",
                "cursor-pointer",
                "appearance-none",
                "border-transparent",
                "bg-red-500",
              )}
              onChange={(e) => {
                blackThreshold.current = parseFloat(e.target.value);
                calculateMesh();
              }}
            />
          </div>
          <div className={clsx("ml-8")}>
            <p className={clsx("text-center")}>Depth</p>
            <input
              type="range"
              step={0.01}
              defaultValue={0.05}
              min={0}
              max={0.15}
              className={clsx(
                "transparent",
                "h-[4px]",
                "w-40",
                "rounded",
                "cursor-pointer",
                "appearance-none",
                "border-transparent",
                "bg-red-500",
              )}
              onChange={(e) => {
                depth.current = parseFloat(e.target.value);
                calculateMesh();
              }}
            />
          </div>
          <Button label="Export" className="ml-8" onClick={() => viewGLRef.current?.export()} />
        </div>
      </div>
      <div className={clsx("flex", "justify-evenly", "items-center")}>
        <div className="w-md">
          <canvas className="max-w-md" ref={imageCanvasRef} width={300} height={300}></canvas>
        </div>
        <canvas ref={threeCanvasRef} />
      </div>
    </div>
  );
}

class StampThreeJSViewGL {
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;

  public canvas?: HTMLCanvasElement;

  private mesh: THREE.Mesh | undefined;

  public setSize(width: number, height: number) {
    this.renderer.setSize(width, height);
  }

  public export(name?: string) {
    if (!this.mesh) {
      toast.error("Nothing to export");
      return;
    }

    const exporter = new STLExporter();
    const result = exporter.parse(this.mesh, { binary: true });
    const blob = new Blob([result], { type: "application/octet-binary" });
    saveAs(blob, name ? name : "stamp.stl");
  }

  public removeMesh() {
    if (this.mesh) this.scene.remove(this.mesh);
    this.mesh = undefined;
  }

  public setMesh(imageData: ImageData, whiteThreshold = 0, blackThreshold = 0, depth = 0.05) {
    const pixels = imageData.data;
    const { width, height } = imageData;

    const indices: number[] = []; //new Array((width - 1) * (height - 1) * 2);
    const w = width + 2;
    for (let i = 0; i < width + 1; i++)
      for (let j = 0; j < height + 1; j++) {
        const index = j * w + i;
        indices.push(
          ...[index + 1, index, index + w, index + w, index + 1 + w, index + 1],
          // ...[index, index + width + 1, index + 1, index, index + width, index + width + 1],
        );
      }

    const vertices = new Float32Array((width + 2) * (height + 2) * 3 + 12);
    let pi = 0;
    let vi = 0;
    for (let j = 0; j < height + 2; j++)
      for (let i = 0; i < w; i++, vi += 3) {
        // Average the rgb values to a greyscale value
        let value = 255;
        if (j != 0 && i != 0 && j < height + 1 && i < width + 1) {
          value = (pixels[pi] + pixels[pi + 1] + pixels[pi + 2]) / 3;
          pi += 4;
        }

        if (value > whiteThreshold) value = 255;
        if (value < blackThreshold) value = 0;

        value = 255 - value;

        // value = 255 - value;
        // Use the pixel value as the height here
        vertices[vi] = i;
        vertices[vi + 1] = -value * depth;
        vertices[vi + 2] = j;
      }

    const h = -255 * depth - 100;
    vertices[vi] = 0;
    vertices[vi + 1] = h;
    vertices[vi + 2] = 0;
    vertices[vi + 3] = width + 2;
    vertices[vi + 4] = h;
    vertices[vi + 5] = 0;
    vertices[vi + 6] = width + 2;
    vertices[vi + 7] = h;
    vertices[vi + 8] = height + 2;
    vertices[vi + 9] = 0;
    vertices[vi + 10] = h;
    vertices[vi + 11] = height + 2;
    const wh = (width + 2) * (height + 2);
    indices.push(...[wh, 0, wh + 1, 0, width + 1, wh + 1]);
    indices.push(...[0, wh, wh + 3, 0, wh + 3, (width + 2) * (height + 1)]);
    indices.push(...[wh + 1, width + 1, wh + 2, width + 1, (width + 2) * (height + 2) - 1, wh + 2]);
    indices.push(
      ...[
        wh + 2,
        (width + 2) * (height + 2) - 1,
        wh + 3,
        (width + 2) * (height + 2) - 1,
        (width + 2) * (height + 1),
        wh + 3,
      ],
    );
    indices.push(...[wh, wh + 1, wh + 2, wh, wh + 2, wh + 3]);

    const geometry = new THREE.BufferGeometry();
    geometry.setIndex(indices);
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();
    geometry.translate(-width / 2, 0, -height / 2);
    geometry.scale(80 / width, 80 / width, 80 / width);
    const material = new THREE.MeshStandardMaterial({ color: 0x74c4cf });

    this.removeMesh();
    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);
  }

  // public update() {}

  constructor(canvas: HTMLCanvasElement | undefined, width = 600, height = 600) {
    this.canvas = canvas;

    const clippingPlane = [0.1, 1000];
    this.camera = new THREE.PerspectiveCamera(50, 1, ...clippingPlane);
    this.camera.position.set(13, 56, 47);
    this.controls = new OrbitControls(this.camera, this.canvas);
    // this.controls.enablePan = false;

    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });
    this.renderer.setSize(width, height);
    if (window) this.renderer.setPixelRatio(window.devicePixelRatio);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("white");

    const lightRight = new THREE.DirectionalLight(0xffffff, 0.8);
    lightRight.position.set(10, 10, 10); //default; light shining from right
    this.scene.add(lightRight);

    // this.scene.add(
    //   new THREE.Mesh(
    //     new THREE.BoxGeometry(0.1, 0.1, 0.1),
    //     new THREE.MeshBasicMaterial({ color: "red" }),
    //   ),
    // );

    requestAnimationFrame(this.update.bind(this));
  }

  private update() {
    requestAnimationFrame(this.update.bind(this));
    this.renderer.render(this.scene, this.camera);

    this.controls.update();
  }
}
