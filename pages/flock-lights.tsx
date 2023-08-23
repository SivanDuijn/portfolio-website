import { ProjectContainer } from "@/components/ProjectContainer";
import { P5Flocking } from "@/components/p5Flocking/p5Flocking";

export default function FlockLights() {
  return (
    <ProjectContainer
      index={1}
      title="Flock Lights"
      thumbnailUrl="/imgs/projects/flock-lights/thumbnail.jpeg"
    >
      <p>
        The idea behind this decorative light is that it visualizes birds
        flocking. There are multiple glowing spheres hanging in the air. Now
        picture birds flocking through these lights. Each light will adjust its
        luminance based on how close birds are to this light.
        <br />
        <br />
        On a much larger scale, with a lot more spheres, this might look like
        birds flocking. You would be able to see groups of birds breaking apart
        and reuniting later, for example. Right now this is not quite the case.
        But it still gives a nice effect. You can get the idea of something
        moving between the spheres.
        <br />
        <br />
        The lamp is made from WS118B individually adressable LED&apos;s attached
        to ping pong balls. A Raspberry PI is controlling these LED&apos;s and
        is running a simulation of birds flocking. It knows the coordinates of
        each ping pong ball. (This was quite a job to measure the location of
        each ball.) This is how it can calculate the distance between each
        sphere and bird and adjust the LED&apos;s intensity base on that
        distance. A bicycle wheel with rope woven between the spokes as a
        ceiling for the spheres to hang from.
      </p>
    </ProjectContainer>
  );
}
