import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { TextPlugin } from "gsap/TextPlugin";
import { SplitText } from "gsap/SplitText";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { Observer } from "gsap/Observer";
import { Physics2DPlugin } from "gsap/Physics2DPlugin";
import { PhysicsPropsPlugin } from "gsap/PhysicsPropsPlugin";
import { CustomEase } from "gsap/CustomEase";
import { CustomWiggle } from "gsap/CustomWiggle";
import { CustomBounce } from "gsap/CustomBounce";
import { EasePack } from "gsap/EasePack";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(
  ScrollTrigger,
  Flip,
  MotionPathPlugin,
  MorphSVGPlugin,
  DrawSVGPlugin,
  TextPlugin,
  SplitText,
  Draggable,
  InertiaPlugin,
  Observer,
  Physics2DPlugin,
  PhysicsPropsPlugin,
  CustomEase,
  CustomWiggle,
  CustomBounce,
  EasePack,
  ScrambleTextPlugin
);

if (import.meta.env.DEV) {
  import("gsap/GSDevTools").then(({ GSDevTools }) =>
    gsap.registerPlugin(GSDevTools)
  );
}

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

CustomEase.create(
  "resonanceReveal",
  "M0,0 C0.126,0.382 0.282,1.04 0.582,1.04 0.852,1.04 0.874,0.618 1,0"
);
CustomEase.create(
  "memoryDrift",
  "M0,0 C0.25,0.1 0.35,0.9 0.55,0.95 0.75,1 0.9,0.95 1,0"
);
CustomEase.create(
  "terminalSnap",
  "M0,0 C0.5,0 0.5,1 1,1"
);

gsap.defaults({
  ease: "power2.out",
  duration: 0.8,
  overwrite: "auto",
});

gsap.config({
  nullTargetWarn: false,
});

export default gsap;
export { gsap, ScrollTrigger, prefersReducedMotion };
