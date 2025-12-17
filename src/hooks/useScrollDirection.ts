import { useEffect, useRef, useState } from "react";

const useScrollDirection = (
  element: HTMLElement | null,
  threshold: number = 10
) => {
  const lastScrollY = useRef(0);
  const [direction, setDirection] = useState<"up" | "down">();

  useEffect(() => {
    if (!element) return;
    console.log(element)

    lastScrollY.current = element.scrollTop

    const onScroll = () => {
      const currentY = element.scrollTop;
      const diff = currentY - lastScrollY.current;

      if (Math.abs(diff) > threshold) {
        setDirection(diff > 0 ? "down" : "up");
        lastScrollY.current = currentY;
      }
    };

    element.addEventListener("scroll", onScroll, { passive: true });
    onScroll()
    return () => element.removeEventListener("scroll", onScroll);
  }, [element, threshold]);

  return direction;
};

export default useScrollDirection;
