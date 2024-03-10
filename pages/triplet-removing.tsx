/* eslint-disable no-console */
import { useEffect, useRef, useState } from "react";
import characters1D from "@/components/triplets/data/Characters1D";
import perfectMediumCombinations from "@/components/triplets/data/perfectMediumBoldCombinations.json";
import { TripletWebWorker } from "@/components/triplets/lib/tripletWebWorker";
import { ConnectednessOptions } from "@/modules/rust-triplet/pkg/triplet_wasm_lib";

// const letterCombinations = ["DJM", "EMP", "FGR", "BOS", "DFW", "ADJ", "INU", "MUY", "BGV", "GRW"];
const letterCombinations = perfectMediumCombinations;

const shapePlanes = letterCombinations.map((c) => [
  { values: characters1D[c[0] as "A"][1], w: 14, h: 14 },
  { values: characters1D[c[1] as "A"][1], w: 14, h: 14 },
  { values: characters1D[c[2] as "A"][1], w: 14, h: 14 },
]);

export default function TripletRemoving() {
  const workers = useRef([
    new TripletWebWorker(),
    new TripletWebWorker(),
    new TripletWebWorker(),
    new TripletWebWorker(),
    new TripletWebWorker(),
  ]);
  const data = useRef<{
    initialCubes: number[];
    afterRemoveCubes: number[];
    maxNCubesRemoved: number[];
    maxNCellsInPlane: number[];
    newMaxNCellsInPlane: number[];
  }>({
    initialCubes: [],
    afterRemoveCubes: [],
    maxNCubesRemoved: new Array(letterCombinations.length).fill(0).map(() => 0),
    maxNCellsInPlane: new Array(letterCombinations.length).fill(0).map(() => 0),
    newMaxNCellsInPlane: new Array(letterCombinations.length).fill(0).map(() => 0),
  });
  const letterCombIndex = useRef(0);

  const [nWorkersFinished, setNWorkersFinished] = useState(0);

  useEffect(() => {
    workers.current.forEach((w) => {
      w.setOnRemoveCellsFinished((nCubesRemoved, maxNCellsInPlane, newMaxNCellsInPlane) => {
        data.current.maxNCubesRemoved[letterCombIndex.current] =
          nCubesRemoved > data.current.maxNCubesRemoved[letterCombIndex.current]
            ? nCubesRemoved
            : data.current.maxNCubesRemoved[letterCombIndex.current];
        nCubesRemoved / workers.current.length;
        data.current.maxNCellsInPlane[letterCombIndex.current] +=
          Math.max(...maxNCellsInPlane) / workers.current.length;
        data.current.newMaxNCellsInPlane[letterCombIndex.current] +=
          Math.max(...newMaxNCellsInPlane) / workers.current.length;
        setNWorkersFinished((prev) => prev + 1);
      });
    });

    workers.current[0].setOnMultipleFinished((ts) => {
      ts.forEach((t) => data.current.initialCubes.push(t.volume.filter((v) => v > 0).length));

      workers.current.forEach((w) => {
        w.buildTriplet(
          shapePlanes[letterCombIndex.current][0],
          shapePlanes[letterCombIndex.current][1],
          shapePlanes[letterCombIndex.current][2],
          ConnectednessOptions.Volume,
        );
        w.removeCellsOfPreviousTriplet(10000000, 0.7, 0);
      });
    });

    Promise.all(workers.current.map((w) => w.init())).then(() => {
      workers.current[0].buildMultipleTriplets(shapePlanes, ConnectednessOptions.Volume);
    });
  }, []);

  useEffect(() => {
    if (nWorkersFinished == workers.current.length) {
      data.current.afterRemoveCubes.push(
        data.current.initialCubes[letterCombIndex.current] -
          data.current.maxNCubesRemoved[letterCombIndex.current],
      );
      console.log(letterCombIndex.current);
    }

    if (
      nWorkersFinished == workers.current.length &&
      letterCombIndex.current < letterCombinations.length - 1
    ) {
      setNWorkersFinished(0);
      letterCombIndex.current++;
      workers.current.forEach((w) => {
        w.buildTriplet(
          shapePlanes[letterCombIndex.current][0],
          shapePlanes[letterCombIndex.current][1],
          shapePlanes[letterCombIndex.current][2],
          ConnectednessOptions.Volume,
        );
        w.removeCellsOfPreviousTriplet(100000, 0.7, 0);
      });
    }

    if (
      nWorkersFinished == workers.current.length &&
      letterCombIndex.current == shapePlanes.length - 1
    )
      console.log(JSON.stringify(data.current));
  }, [nWorkersFinished]);

  return <div></div>;
}

// afterRemoveCubes: [280.6, 275.59999999999997, 257, 279, 275.79999999999995, 255.19999999999993, 276.20000000000005, 271.20000000000005, 278.2] (9)

// initialCubes: [716, 606, 668, 730, 687, 660, 735, 828, 760, 863] (10)

// maxNCubesRemoved: [435.4, 330.40000000000003, 411, 451, 411.20000000000005, 404.80000000000007, 458.79999999999995, 556.8, 481.8, 577.6] (10)
