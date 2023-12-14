import Head from "next/head";
import { useEffect, useRef } from "react";
import calculateAllTriplets from "@/components/triplets/lib/research/calculateSomeTriplets";

export default function TripletResearch() {
  const i = useRef(3000);

  const calcSomeTriplets = () => {
    const triplets = calculateAllTriplets(2, "volume", { start: i.current, end: i.current + 100 });
    console.log(triplets, i);
    i.current += 100;
    if (i.current > 3276) return;
    setTimeout(() => {
      calcSomeTriplets();
    }, 1);
  };

  useEffect(() => calcSomeTriplets());

  return (
    <div>
      <Head>
        <title>Triplet research page</title>
      </Head>
      <h1>Triplet research page</h1>
    </div>
  );
}
