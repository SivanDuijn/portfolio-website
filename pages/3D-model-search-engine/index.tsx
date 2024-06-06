import clsx from "clsx";
import Link from "next/link";
import { ProjectContainer } from "@/components/ProjectContainer";

export default function ModelSearchEngineOverview() {
  return (
    <ProjectContainer
      index={6}
      title="3D Model Search Engine"
      thumbnailUrl="/imgs/projects/3D-model-search-engine/thumbnail.png"
    >
      <p className={clsx("mb-8")}>
        This multimedia retrieval pipeline was developed for the Multimedia Retrieval course at
        Utrecht University. It functions as a 3D search engine that accepts a 3D model as input and
        returns the top 10 most similar models from the database. Each model in the database
        undergoes normalization, which includes fitting it into a unit box, standardizing the number
        of vertices, and orienting it using Principal Component Analysis. Models are then compared
        based on specific descriptors and histograms.
        <br />
        <br />
        Although the previous version allowed users to upload a model and query the database, the
        current version lacks a backend for preprocessing uploaded models. Nevertheless, it remains
        an interesting demo for visualizing models and identifying similar ones.
      </p>

      <div className={clsx("text-center")}>
        <Link
          href={"3D-model-search-engine/engine"}
          className={clsx(
            "text-2xl",
            "underline",
            "text-blue-400",
            "hover:text-blue-600",
            "font-bold",
          )}
          target="_blank"
        >
          Go to the application!
        </Link>
      </div>
    </ProjectContainer>
  );
}
