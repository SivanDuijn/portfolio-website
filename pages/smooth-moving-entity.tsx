import clsx from "clsx";
import { ProjectContainer } from "@/components/ProjectContainer";
import { SmoothMovingEntity } from "@/components/smoothMovingEntity/SmoothMovingEntity";
import { useIsSmallScreen } from "@/lib/hooks/useIsSmalScreen";

export default function SmoothMovingEntityPage() {
  const isSmallScreen = useIsSmallScreen();

  return (
    <ProjectContainer
      index={9}
      title="Smooth Moving Entity"
      thumbnailUrl="/imgs/projects/flocking-simulation/thumbnail.png"
    >
      <p className={clsx("mb-8")}>An entity moving smoothly avoiding the sides of the box.</p>
      <SmoothMovingEntity size={isSmallScreen ? 300 : 600} />
    </ProjectContainer>
  );
}
