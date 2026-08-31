import { useState, useEffect } from "react";

const query = window.matchMedia("(prefers-reduced-motion: reduce)");

export default function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    query.matches
  );

  useEffect(() => {
    const handler = (event) => setPrefersReducedMotion(event.matches);
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }, []);

  return prefersReducedMotion;
}
