import clsx from "clsx";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { ConnectednessOptions } from "@/components/triplets/lib/componentLabelling";
import calculateSomeTriplets from "@/components/triplets/lib/research/calculateSomeTriplets";

export default function TripletResearch() {
  const nTriplets = useRef(0);
  const configurationIndex = useRef(0);

  const configurations: { thickness: 0 | 1 | 2; connectedness: ConnectednessOptions }[] = [
    { thickness: 0, connectedness: "volume" },
    { thickness: 0, connectedness: "edge" },
    { thickness: 0, connectedness: "vertex" },
    { thickness: 1, connectedness: "volume" },
    { thickness: 1, connectedness: "edge" },
    { thickness: 1, connectedness: "vertex" },
    { thickness: 2, connectedness: "volume" },
    { thickness: 2, connectedness: "edge" },
    { thickness: 2, connectedness: "vertex" },
  ];

  const [progress, setProgress] = useState<number[]>(Array(configurations.length).fill(0));
  const results = useRef<{ avgError: number; percCorrect: number }[]>(
    Array(configurations.length)
      .fill([])
      .map(() => ({ avgError: 0, percCorrect: 0 })),
  );

  const calcSomeTriplets = () => {
    const { thickness, connectedness } = configurations[configurationIndex.current];
    const triplets = calculateSomeTriplets(thickness, connectedness, {
      start: nTriplets.current,
      end: nTriplets.current + 100,
    });

    // 200, 300
    // (200 / 300) * avgError + (100 / 300) * errorSum

    // 200, 276
    // (200 / 276) * avgError + (76 / 200) * errorSum

    const prevTotal = nTriplets.current;
    const newTotal = nTriplets.current + triplets.length;
    const currAvgProportion = prevTotal / newTotal;
    const extraAvgProportion = triplets.length / newTotal;

    results.current[configurationIndex.current].avgError =
      currAvgProportion * results.current[configurationIndex.current].avgError +
      extraAvgProportion *
        (triplets.reduce((prev, curr) => prev + curr.error.sum, 0) / triplets.length);
    results.current[configurationIndex.current].percCorrect =
      currAvgProportion * results.current[configurationIndex.current].percCorrect +
      extraAvgProportion *
        (triplets.reduce((prev, curr) => prev + (curr.error.sum == 0 ? 1 : 0), 0) /
          triplets.length) *
        100;

    nTriplets.current += 100;
    if (nTriplets.current > 3276) {
      nTriplets.current = 3276;
      progress[configurationIndex.current] = 3276;
      setProgress([...progress]);

      configurationIndex.current++;
      if (configurationIndex.current == configurations.length) return;

      nTriplets.current = 0;
    } else {
      progress[configurationIndex.current] = nTriplets.current;
      setProgress([...progress]);
    }

    setTimeout(() => {
      calcSomeTriplets();
    }, 1);
  };

  useEffect(() => calcSomeTriplets(), []);

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
            style={{ width: `${(p / 3276) * 100}%` }}
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
