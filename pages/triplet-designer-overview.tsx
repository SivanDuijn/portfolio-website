import clsx from "clsx";
import Link from "next/link";
import { ProjectContainer } from "@/components/ProjectContainer";

export default function TripletDesignerOverview() {
  return (
    <ProjectContainer
      index={8}
      title="Triplet Designer"
      thumbnailUrl="/imgs/projects/triplet-designer/thumbnail.png"
    >
      <p className={clsx("mb-8")}>
        The triplet designer is a tool that can generate a 3D shape that will cast three predefined
        shadows. Such an object is called a triplet and was part of my Master research topic. As a
        practical deliverable I developed this website to experiment with various triplet shapes.
        <br />
        <br />
        The site allows the user to draw their own shadow shapes or select three letters with either
        a thin, medium or heavy font. Initially, the maximum number of cubes will be shown where the
        triplet correctly casts all three shadows, if possible. However, it is possible for the user
        to remove more cubes with a button. It is also possible to export the 3D object to a .stl
        file for 3D printing.
      </p>

      <div className={clsx("text-center")}>
        <Link
          href={"triplet-designer"}
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
