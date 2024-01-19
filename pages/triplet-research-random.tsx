import clsx from "clsx";
import Head from "next/head";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { TripletWebWorker } from "@/components/triplets/lib/tripletWebWorker";
import { Triplet } from "@/components/triplets/models";
import { ShapePlaneFillRandomness } from "@/modules/rust-triplet/pkg/triplet_wasm";

const randomness = ShapePlaneFillRandomness.NeighborWeighted;
const gridSize = 14;
const nWorkers = 4;
const nTripletsPerWorker = 1000;
const nTriplets = nWorkers * nTripletsPerWorker; // 6 * 750 = 4500 triplets generated in total per configuration

const configurations = [
  { fillPercentage: 0.3 },
  { fillPercentage: 0.35 },
  { fillPercentage: 0.4 },
  { fillPercentage: 0.45 },
  { fillPercentage: 0.5 },
  { fillPercentage: 0.55 },
  { fillPercentage: 0.6 },
  { fillPercentage: 0.65 },
  { fillPercentage: 0.7 },
  { fillPercentage: 0.75 },
  { fillPercentage: 0.8 },
  { fillPercentage: 0.85 },
  { fillPercentage: 0.9 },
];

export default function TripletResearchRandom() {
  const configurationIndex = useRef(0);

  // Use 6 web workers
  const tripletWebWorkers = useRef<TripletWebWorker[]>(
    new Array(nWorkers).fill(0).map(() => new TripletWebWorker()),
  );

  const [progress, setProgress] = useState<number[]>(Array(configurations.length).fill(0));
  const results = useRef<{ avgError: number; percCorrect: number }[]>(
    Array(configurations.length)
      .fill([])
      .map(() => ({ avgError: 0, percCorrect: 0 })),
  );
  const [nWorkersFinished, setNWorkersFinished] = useState(0);
  const finishedTriplets = useRef<Triplet[][]>(
    Array(configurations.length)
      .fill([])
      .map(() => []),
  );

  useEffect(() => {
    // Initialize webworkers
    tripletWebWorkers.current.forEach((worker) => {
      worker.setOnProgressUpdate((amount) =>
        setProgress((prev) => {
          prev[configurationIndex.current] += amount;
          return [...prev];
        }),
      );
      worker.setOnMultipleFinished((triplets) => {
        finishedTriplets.current[configurationIndex.current].push(...triplets);
        setNWorkersFinished((prev) => prev + 1);
      });
    });

    Promise.all(tripletWebWorkers.current.map((worker) => worker.init())).then(() =>
      buildTriplets(),
    );
  }, []);

  const buildTriplets = useCallback(() => {
    tripletWebWorkers.current.forEach((worker) => {
      const { fillPercentage } = configurations[configurationIndex.current];

      worker.buildRandomTriplets(
        gridSize,
        gridSize,
        fillPercentage,
        randomness,
        nTripletsPerWorker,
      );
    });
  }, []);

  useEffect(() => {
    if (nWorkersFinished == nWorkers) {
      const triplets = finishedTriplets.current[configurationIndex.current];
      results.current[configurationIndex.current].avgError =
        triplets.reduce((acc, triplet) => acc + triplet.error.sum, 0) / triplets.length;
      results.current[configurationIndex.current].percCorrect =
        (triplets.reduce((acc, triplet) => acc + (triplet.error.sum == 0 ? 1 : 0), 0) /
          triplets.length) *
        100;

      if (configurationIndex.current < configurations.length - 1) {
        configurationIndex.current++;
        setNWorkersFinished(0);
        buildTriplets();
      } else {
        setNWorkersFinished(1); // To terminate the loop
        tripletWebWorkers.current.forEach((worker) => worker.destroy());
      }
    }
  }, [nWorkersFinished]);

  return (
    <div className={clsx("flex", "flex-col", "items-center")}>
      <Head>
        <title>Triplet Random Research</title>
      </Head>
      <h1 className={clsx("font-bold", "text-xl", "mt-16", "mb-8")}>
        Triplet Random Shapeplanes Research
      </h1>
      <div className={clsx("flex")}>
        <div className={clsx("mt-[24px]", "mr-4")}>
          {progress.map((p, i) => (
            <div key={i} className={clsx("h-4", "w-80", "mt-[8px]", "border-2", "border-white")}>
              <div
                className={clsx("h-full", "bg-green-600")}
                style={{ width: `${(p / nTriplets) * 100}%`, transition: "width .5s" }}
              ></div>
            </div>
          ))}
        </div>

        {results.current && (
          <div className={clsx("grid", "grid-cols-3", "text-center")}>
            <div></div>
            <p className={clsx("font-semibold", "mb-1")}>Error</p>
            <p className={clsx("font-semibold")}>% correct</p>

            {configurations.map((config, i) => (
              <Fragment key={config.fillPercentage}>
                <p className={clsx("font-bold", "text-center")}>
                  {config.fillPercentage.toFixed(2)}
                </p>
                <p className={clsx("font-mono")}>{results.current[i].avgError.toFixed(4)}</p>
                <p className={clsx("font-mono")}>{results.current[i].percCorrect.toFixed(2)}</p>
              </Fragment>
            ))}
          </div>
        )}
      </div>
      <div className={clsx("mt-12", "grid", "grid-cols-2")}>
        <p className={clsx("font-bold", "col-span-2", "text-center")}>Input info</p>
        <p>Grid size:</p>
        <p className={clsx("font-mono", "text-center")}>
          {gridSize}x{gridSize}
        </p>
        <p># Triplets:</p>
        <p className={clsx("font-mono", "text-center")}>{nTriplets}</p>
      </div>
    </div>
  );
}
