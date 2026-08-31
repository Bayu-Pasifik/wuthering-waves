import { useRef, useEffect } from "react";
import { gsap } from "../gsapSetup";

export default function useGsapContext(scope) {
  const ctx = useRef(null);

  useEffect(() => {
    ctx.current = gsap.context(() => {}, scope);
    return () => ctx.current?.revert();
  }, [scope]);

  return ctx.current;
}
