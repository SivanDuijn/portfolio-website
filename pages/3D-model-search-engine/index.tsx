import { ProjectContainer } from "@/components/ProjectContainer";
import { useIsSmallScreen } from "@/lib/hooks/useIsSmalScreen";
import clsx from "clsx";
import Link from "next/link";

export default function ModelSearchEngineOverview() {
  const isSmallScreen = useIsSmallScreen();

  return (
    <ProjectContainer
      index={4}
      title="3D Model Search Engine"
      thumbnailUrl="/imgs/projects/3D-model-search-engine/thumbnail.png"
    >
      <p className={clsx("mb-8")}>
        This is a multimedia retrieval pipeline build for the course Multimedia Retrieval at Utrecht
        University. It is a 3D search engine that takes as input a 3D model, and gives as output the
        top 10 closest models that should look similar. Each model in the database is normalized,
        that is, it is put in a unit box, uniformed the number of vertices and oriented using PCA.
        Then, the models are compared against each other based on certain descriptors and
        histograms.
        <br />
        <br />
        Previously it was possible to upload a model and query the database against it. But,
        currently, there is no backend connected to preprocess the uploaded model. It is still a
        valuable showcase for visualizing models and seeing which ones are the most similar.
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
