import { ShapePlaneEditor } from "@/components/triplets/ShapePlaneEditor";
import { MemoizedViewGLCanvas } from "@/components/triplets/ViewGLCanvas/MemoizedViewGLCanvas";
import { GridProvider } from "@/components/triplets/lib/GridContext";
import { useGridSize } from "@/components/triplets/lib/GridContext/hooks";
import clsx from "clsx";
import Head from "next/head";

export default function TripletDesigner() {
    const { changeGridSize } = useGridSize();

    return (
        <GridProvider>
            <div className={clsx("flex", "flex-col", "h-full", "px-2", "pt-2")}>
                <Head>
                    <title>Trip-Let Designer</title>
                </Head>
                <div className={clsx("flex")}>
                    <MemoizedViewGLCanvas
                        className={clsx(
                            "border-2",
                            "border-slate-200",
                            "mx-2",
                            "mt-2",
                            "inline-block",
                        )}
                    />
                    <div>
                        <div className={clsx("grid", "grid-cols-3", "mx-2", "mt-2")}>
                            <div className={clsx("flex", "flex-col", "items-center")}>
                                <p className={clsx("text-center", "font-bold")}>Left</p>
                                <ShapePlaneEditor
                                    className={clsx("w-52")}
                                    onChange={() => 0}
                                    plane="left"
                                />
                            </div>
                            <div className={clsx("w-56")} />
                            <div className={clsx("flex", "flex-col", "items-center")}>
                                <p className={clsx("text-center", "font-bold")}>Right</p>
                                <ShapePlaneEditor
                                    className={clsx("w-52")}
                                    onChange={() => 0}
                                    plane="right"
                                />
                            </div>
                            <div />
                            <div className={clsx("flex", "flex-col", "items-center")}>
                                <p className={clsx("text-center", "font-bold")}>Bottom</p>
                                <ShapePlaneEditor
                                    className={clsx("w-52")}
                                    onChange={() => 0}
                                    plane="bottom"
                                />
                            </div>
                            <div
                                className={clsx(
                                    "col-span-3",
                                    "border-2",
                                    "border-slate-200",
                                    "mt-4",
                                    "p-4",
                                )}
                            >
                                <div className={clsx("max-w-[6rem]")}>
                                    <label
                                        htmlFor="first_name"
                                        className="block text-md text-gray-900 dark:text-white font-bold"
                                    >
                                        Grid size
                                    </label>
                                    <input
                                        type="number"
                                        id="first_name"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        defaultValue={5}
                                        onChange={(e) => {
                                            const newSize = parseInt(e.target.value);
                                            if (!isNaN(newSize)) changeGridSize(newSize);
                                        }}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GridProvider>
    );
}
