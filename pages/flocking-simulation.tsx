import clsx from "clsx";
import { P5Flocking } from "@/components/p5Flocking/p5Flocking";
import { ProjectContainer } from "@/components/ProjectContainer";
import { useIsSmallScreen } from "@/lib/hooks/useIsSmalScreen";

export default function FlockingSimulation() {
  const isSmallScreen = useIsSmallScreen();

  return (
    <ProjectContainer
      index={5}
      title="Flocking Simulation"
      thumbnailUrl="/imgs/projects/flocking-simulation/thumbnail.png"
    >
      <p className={clsx("mb-8")}>
        A simulation of birds flocking. Using the boids technique introduced by{" "}
        <a
          href="http://www.red3d.com/cwr/boids/"
          className={clsx("underline", "hover:text-blue-300")}
          target="_blank"
        >
          Craig Reynolds
        </a>
        . He uses three forces to simulate flocking behavior. The first is Separation: steer to
        avoid crowding local flockmates . Alignment: steer towards the average heading of local
        flockmates. And finally, Cohesion: steer to move toward the average position of local
        flockmates.
      </p>
      <P5Flocking size={isSmallScreen ? 300 : 700} />
    </ProjectContainer>
  );
}
