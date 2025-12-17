import { useEffect, useRef, useState } from "react";

const useInView = (targetRef: React.RefObject<Element>, containerRef: React.RefObject<Element>) => {
  const [inView, setInView] = useState(false);


  useEffect(() => {
    if (!targetRef.current || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { root: containerRef.current, 
        threshold: 0.1
      }
    );
    observer.observe(targetRef.current);
    const rect = targetRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    setInView(rect.top >= containerRect.top && rect.bottom <= containerRect.bottom)
    return () => observer.disconnect();
  }, [targetRef, containerRef]);

  return { inView };
};

export default useInView;