/* eslint-disable no-console */
import clsx from "clsx";
import Head from "next/head";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import Button from "@/components/atoms/Button";
import NumberInput from "@/components/NumberInput";
import { TripletWebWorker } from "@/components/triplets/lib/tripletWebWorker";

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

  const [gridSize, setGridSize] = useState(14);
  const [randomness, setRandomness] = useState(2);

  const [progress, setProgress] = useState<number[]>(Array(configurations.length).fill(0));
  const results = useRef<{ avgError: number; percCorrect: number }[]>(
    Array(configurations.length)
      .fill([])
      .map(() => ({ avgError: 0, percCorrect: 0 })),
  );
  const [nWorkersFinished, setNWorkersFinished] = useState(-2);
  const accumulatedError = useRef<{ avgError: number; percCorrect: number }>({
    avgError: 0,
    percCorrect: 0,
  });

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
        accumulatedError.current.avgError += triplets.reduce(
          (acc, triplet) => acc + triplet.error.totalPercentage,
          0,
        );
        accumulatedError.current.percCorrect += triplets.reduce(
          (acc, triplet) => acc + (triplet.error.totalPercentage == 0 ? 1 : 0),
          0,
        );
        setNWorkersFinished((prev) => prev + 1);
      });
    });

    Promise.all(tripletWebWorkers.current.map((worker) => worker.init())).then(() =>
      setNWorkersFinished(-1),
    );

    return () => {
      tripletWebWorkers.current.forEach((worker) => worker.destroy());
    };
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
  }, [gridSize, randomness]);

  const start = useCallback(() => {
    // First reset progress
    configurationIndex.current = 0;
    accumulatedError.current.avgError = 0;
    accumulatedError.current.percCorrect = 0;
    setProgress(Array(configurations.length).fill(0));
    results.current = Array(configurations.length)
      .fill([])
      .map(() => ({ avgError: 0, percCorrect: 0 }));

    setNWorkersFinished(0);
    setTimeout(buildTriplets, 400);
  }, [buildTriplets]);

  useEffect(() => {
    if (nWorkersFinished == nWorkers) {
      results.current[configurationIndex.current].avgError =
        accumulatedError.current.avgError / nTriplets;
      results.current[configurationIndex.current].percCorrect =
        (accumulatedError.current.percCorrect / nTriplets) * 100;

      if (configurationIndex.current < configurations.length - 1) {
        accumulatedError.current.avgError = 0;
        accumulatedError.current.percCorrect = 0;
        configurationIndex.current++;
        setNWorkersFinished(0);
        buildTriplets();
      } else {
        setNWorkersFinished(-1); // To terminate the loop
        // Print results to console for copy-pasting
        let out = "\n";
        results.current.forEach((r) => (out += r.avgError + "\n"));
        console.log(out);
        out = "\n";
        results.current.forEach((r) => (out += r.percCorrect + "\n"));
        console.log(out);
      }
    }
  }, [nWorkersFinished]);

  return (
    <div className={clsx("flex", "flex-col", "items-center")}>
      <Head>
        <title>Triplet Random Research</title>
      </Head>
      <h1 className={clsx("font-bold", "text-xl", "mt-12", "mb-8")}>
        Triplet Random Shapeplanes Research
      </h1>
      <div className={clsx("flex", "items-center")}>
        <p className={clsx("font-bold", "mr-2")}>Grid size</p>
        <NumberInput
          darkTheme
          value={gridSize}
          min={2}
          max={100}
          onChange={(v) => setGridSize(v)}
        />
        <div className={clsx("ml-12", "mb-5")}>
          <p className={clsx("text-center", "mb-0.5", "font-bold")}>Random generation</p>
          <div className={clsx("flex")}>
            {["Fully", "EdgeConnected", "Weighted"].map((thicknessName, i) => (
              <div
                key={thicknessName}
                className={clsx(
                  "px-2",
                  "py-1",
                  "text-sm",
                  "font-bold",
                  i == 0 && "rounded-l",
                  i == 2 && "rounded-r",
                  i == randomness ? "bg-gray-800" : "bg-gray-700",
                  "hover:cursor-pointer",
                  "hover:bg-gray-800",
                )}
                onClick={() => setRandomness(i)}
              >
                {thicknessName}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Button
        darkTheme
        className={clsx("mt-8", "mb-4")}
        label="Start"
        disabled={nWorkersFinished != -1}
        onClick={start}
      />
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
            <p className={clsx("font-semibold", "mb-1")}>Fill %</p>
            <p className={clsx("font-semibold")}>Error</p>
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
        <p>Random generation:</p>
        <p className={clsx("font-mono", "text-center")}>
          {["Fully", "EdgeConnected", "Weighted"][randomness]}
        </p>
      </div>
    </div>
  );
}
