import clsx from "clsx";
import Head from "next/head";
import React, { useCallback, useRef } from "react";
import { Toaster } from "react-hot-toast";
import DescriptorHistograms from "@/components/3D-model-search-engine/DescriptorHistograms";
import { ModelProvider } from "@/components/3D-model-search-engine/lib/contexts";
import { MemoizedViewGLCanvas } from "@/components/3D-model-search-engine/model-viewer/ModelViewer";
import ThreeJSViewGL from "@/components/3D-model-search-engine/model-viewer/viewGL";
import ModelDescriptors from "@/components/3D-model-search-engine/ModelDescriptors";
import ModelInformation from "@/components/3D-model-search-engine/ModelInformation";
import ModelSelector from "@/components/3D-model-search-engine/ModelSelector";
import Settings from "@/components/3D-model-search-engine/Settings";
import TopClosestModels from "@/components/3D-model-search-engine/TopClosestModels";

export default function ModelSearchEngine() {
  const viewGL = useRef<ThreeJSViewGL>();
  const onCanvasMounted = useCallback((viewGLFromCanvas: ThreeJSViewGL) => {
    viewGL.current = viewGLFromCanvas;
  }, []);

  return (
    <ModelProvider>
      <React.Fragment>
        <Toaster />
        <div
          className={clsx("flex", "flex-col", "h-full")}
          style={{ fontFamily: "'Courier Prime', sans-serif, monospace" }}
        >
          <Head>
            <title>Model Go BRRR</title>
          </Head>
          <div className={clsx("grid", "lg:grid-cols-[1fr_auto_1fr]")}>
            <div className={clsx("grid", "lg:grid-rows-[auto_1fr]")}>
              <ModelSelector className={clsx("border-2", "border-slate-200", "mx-2", "mt-4")} />
              <Settings className={clsx("border-2", "border-slate-200", "mx-2", "mt-4")} />
            </div>
            <div>
              <MemoizedViewGLCanvas
                className={clsx("border-2", "border-slate-200", "mx-2", "mt-4")}
                onMounted={onCanvasMounted}
              />
            </div>
            <div className={clsx("grid", "lg:grid-rows-[auto_1fr]")}>
              <ModelInformation className={clsx("border-2", "border-slate-200", "mx-2", "mt-4")} />
              <ModelDescriptors className={clsx("border-2", "border-slate-200", "mx-2", "mt-4")} />
            </div>
          </div>
          <TopClosestModels className={clsx("border-2", "border-slate-200", "mx-2", "mt-4")} />
          <DescriptorHistograms
            className={clsx(
              "border-2",
              "border-slate-200",
              "mx-2",
              "mt-4",
              "mb-2",
              "flex-grow",
              "min-w-[600px]",
            )}
          />
        </div>
      </React.Fragment>
    </ModelProvider>
  );
}
