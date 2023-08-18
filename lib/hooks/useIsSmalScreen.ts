import { useEffect, useState } from "react";

export function useIsSmallScreen() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const smallScreenSize = 630;

  const updateMedia = (): void => {
    setIsSmallScreen(window.innerWidth <= smallScreenSize);
  };

  useEffect(() => {
    updateMedia();
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, []);

  return isSmallScreen;
}
