import clsx from "clsx";
import Head from "next/head";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import characters1D from "@/components/triplets/data/characters1D.json";
import { TripletWebWorker } from "@/components/triplets/lib/tripletWebWorker";
import { Triplet } from "@/components/triplets/models";
import { ConnectednessOptions } from "@/modules/rust-triplet/pkg/triplet_wasm";
import alphabetCombinations from "../components/triplets/data/alphabetCombinations.json";

export default function TripletResearchFonts() {
  const configurations: { thickness: 0 | 1 | 2; connectedness: ConnectednessOptions }[] = [
    { thickness: 0, connectedness: 0 },
    { thickness: 0, connectedness: 1 },
    { thickness: 0, connectedness: 2 },
    { thickness: 1, connectedness: 0 },
    { thickness: 1, connectedness: 1 },
    { thickness: 1, connectedness: 2 },
    { thickness: 2, connectedness: 0 },
    { thickness: 2, connectedness: 1 },
    { thickness: 2, connectedness: 2 },
  ];
  const configurationIndex = useRef(0);

  // ASSUMES SQUARE INPUT GRIDS
  const gridSize = useMemo(() => Math.sqrt(characters1D["A"][0].length), []);

  // Use 6 web workers
  const tripletWebWorkers = useRef<TripletWebWorker[]>(
    new Array(6).fill(0).map(() => new TripletWebWorker()),
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

  const [fillPercentages, setFillPercentages] = useState<number[]>();
  useEffect(() => {
    const percentages = Object.values(characters1D)
      .reduce(
        (prev, curr) => curr.map((sp, i) => sp.filter((v) => v > 0).length + prev[i]),
        [0, 0, 0],
      )
      .map((p) => p / (Object.keys(characters1D).length * characters1D["A"][0].length));
    setFillPercentages(percentages);

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
    // Total alphabet combinations equals 3276
    tripletWebWorkers.current.forEach((worker, i) => {
      const start = i * 546;
      const end = (i + 1) * 546; // 3276 / 6 = 546, since we use 6 workers
      const letters = alphabetCombinations.slice(start, end);

      const { thickness, connectedness } = configurations[configurationIndex.current];

      worker.buildMultipleTriplets(
        letters.map((l) => [
          { values: characters1D[l[0] as "A"][thickness], w: gridSize, h: gridSize },
          { values: characters1D[l[1] as "A"][thickness], w: gridSize, h: gridSize },
          { values: characters1D[l[2] as "A"][thickness], w: gridSize, h: gridSize },
        ]),
        connectedness,
      );
    });
  }, []);

  useEffect(() => {
    if (nWorkersFinished == 6) {
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
        <title>Triplet Font Research</title>
      </Head>
      <h1 className={clsx("font-bold", "text-xl", "mt-16", "mb-8")}>Triplet Font Research</h1>
      {progress.map((p, i) => (
        <div key={i} className={clsx("h-4", "w-80", "my-1.5", "border-2", "border-white")}>
          <div
            className={clsx("h-full", "bg-green-600")}
            style={{ width: `${(p / 3276) * 100}%`, transition: "width .5s" }}
          ></div>
        </div>
      ))}

      {results.current && (
        <div className={clsx("grid", "grid-cols-7", "mt-8", "text-center")}>
          <div></div>
          <p className={clsx("col-span-2", "font-bold")}>Volume connected</p>
          <p className={clsx("col-span-2", "font-bold")}>Edge connected</p>
          <p className={clsx("col-span-2", "font-bold")}>Vertex connected</p>

          <div></div>
          <p className={clsx("font-semibold", "mb-1")}>Error</p>
          <p className={clsx("font-semibold")}>% correct</p>
          <p className={clsx("font-semibold")}>Error</p>
          <p className={clsx("font-semibold")}>% correct</p>
          <p className={clsx("font-semibold")}>Error</p>
          <p className={clsx("font-semibold")}>% correct</p>

          <p className={clsx("font-bold", "text-left")}>Thin font</p>
          <p className={clsx("font-mono")}>{results.current[0].avgError.toFixed(4)}</p>
          <p className={clsx("font-mono")}>{results.current[0].percCorrect.toFixed(2)}</p>
          <p className={clsx("font-mono")}>{results.current[1].avgError.toFixed(4)}</p>
          <p className={clsx("font-mono")}>{results.current[1].percCorrect.toFixed(2)}</p>
          <p className={clsx("font-mono")}>{results.current[2].avgError.toFixed(4)}</p>
          <p className={clsx("font-mono")}>{results.current[2].percCorrect.toFixed(2)}</p>

          <p className={clsx("font-bold", "text-left")}>Medium font</p>
          <p className={clsx("font-mono")}>{results.current[3].avgError.toFixed(4)}</p>
          <p className={clsx("font-mono")}>{results.current[3].percCorrect.toFixed(2)}</p>
          <p className={clsx("font-mono")}>{results.current[4].avgError.toFixed(4)}</p>
          <p className={clsx("font-mono")}>{results.current[4].percCorrect.toFixed(2)}</p>
          <p className={clsx("font-mono")}>{results.current[5].avgError.toFixed(4)}</p>
          <p className={clsx("font-mono")}>{results.current[5].percCorrect.toFixed(2)}</p>

          <p className={clsx("font-bold", "text-left")}>Thick font</p>
          <p className={clsx("font-mono")}>{results.current[6].avgError.toFixed(4)}</p>
          <p className={clsx("font-mono")}>{results.current[6].percCorrect.toFixed(2)}</p>
          <p className={clsx("font-mono")}>{results.current[7].avgError.toFixed(4)}</p>
          <p className={clsx("font-mono")}>{results.current[7].percCorrect.toFixed(2)}</p>
          <p className={clsx("font-mono")}>{results.current[8].avgError.toFixed(4)}</p>
          <p className={clsx("font-mono")}>{results.current[8].percCorrect.toFixed(2)}</p>
        </div>
      )}
      <div className={clsx("mt-12", "grid", "grid-cols-2")}>
        <p className={clsx("font-bold", "col-span-2", "text-center")}>Input info</p>
        <p>Grid size:</p>
        <p className={clsx("font-mono", "text-center")}>
          {gridSize}x{gridSize}
        </p>
        <p>Thin fill %:</p>
        <p className={clsx("font-mono", "text-center")}>
          {fillPercentages ? fillPercentages[0].toFixed(3) : "loading..."}
        </p>
        <p>Medium fill %:</p>
        <p className={clsx("font-mono", "text-center")}>
          {fillPercentages ? fillPercentages[1].toFixed(3) : "loading..."}
        </p>
        <p>Thick fill %:</p>
        <p className={clsx("font-mono", "text-center")}>
          {fillPercentages ? fillPercentages[2].toFixed(3) : "loading..."}
        </p>
      </div>
    </div>
  );
}
