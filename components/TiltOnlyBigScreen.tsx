import { useIsSmallScreen } from "@/lib/hooks/useIsSmalScreen";
import clsx from "clsx";
import { ReactNode, useEffect, useState } from "react";
import Tilt from "react-parallax-tilt";

export type TiltOnlyBigScreenProps = {
  className?: string;
  children?: ReactNode;
};

export function TiltOnlyBigScreen(props: TiltOnlyBigScreenProps) {
  const isSmallScreen = useIsSmallScreen();

  if (isSmallScreen)
    return (
      <div
        className={props.className}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {props.children}
      </div>
    );

  return (
    <Tilt
      perspective={500}
      glareMaxOpacity={0}
      tiltMaxAngleX={13}
      tiltMaxAngleY={13}
      className={props.className}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      {props.children}
    </Tilt>
  );
}
