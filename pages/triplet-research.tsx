import clsx from "clsx";
import Head from "next/head";
import { useCallback, useEffect, useRef, useState } from "react";
import characters1D from "@/components/triplets/data/characters1D.json";
import { Triplet } from "@/components/triplets/lib/buildTriplet";
import createTripletWebWorker from "@/components/triplets/lib/tripletWebWorker";
import { ConnectednessOptions } from "@/modules/rust-triplet/pkg/triplet_wasm";
import alphabetCombinations from "../components/triplets/data/alphabetCombinations.json";

export default function TripletResearch() {
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

  const createWebWorkers = useCallback(() => {
    for (let i = 0, j = 0; i < 6; i++) {
      const end = j + 546; //819;

      const letters = alphabetCombinations.slice(j, end);
      j = end;

      const { thickness, connectedness } = configurations[configurationIndex.current];

      createTripletWebWorker(
        letters.map((l) => [
          { values: characters1D[l[0] as "A"][thickness], w: 14, h: 14 },
          { values: characters1D[l[1] as "A"][thickness], w: 14, h: 14 },
          { values: characters1D[l[2] as "A"][thickness], w: 14, h: 14 },
        ]),
        connectedness,
        (amount) => {
          setProgress((prev) => {
            prev[configurationIndex.current] += amount;
            return [...prev];
          });
        },
        (triplets) => {
          finishedTriplets.current[configurationIndex.current].push(...triplets);
          setNWorkersFinished((prev) => prev + 1);
        },
      );
    }
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
      } else setNWorkersFinished(1);
    } else if (nWorkersFinished == 0) createWebWorkers();
  }, [nWorkersFinished]);

  return (
    <div className={clsx("flex", "flex-col", "items-center")}>
      <Head>
        <title>Triplet research page</title>
      </Head>
      <h1 className={clsx("font-bold", "text-xl", "mt-16", "mb-8")}>Triplet research page</h1>
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
    </div>
  );
}
