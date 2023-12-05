import topClosest from "./../data/closest_models.json";

export default function GetTopKClosest(modelInDatabase: string) {
  return (topClosest as unknown as Record<string, (string | number)[][]>)[modelInDatabase].map(
    (cm) => ({ name: cm[0] as string, dist: cm[1] as number }),
  );
}
