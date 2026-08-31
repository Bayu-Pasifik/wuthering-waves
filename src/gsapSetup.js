import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { TextPlugin } from 'gsap/TextPlugin';
import { SplitText } from 'gsap/SplitText';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { Observer } from 'gsap/Observer';
import { Physics2DPlugin } from 'gsap/Physics2DPlugin';
import { PhysicsPropsPlugin } from 'gsap/PhysicsPropsPlugin';
import { CustomEase } from 'gsap/CustomEase';
import { CustomWiggle } from 'gsap/CustomWiggle';
import { CustomBounce } from 'gsap/CustomBounce';
import { EasePack } from 'gsap/EasePack';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

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

// Dev-only GSDevTools
if (import.meta.env.DEV) {
  import('gsap/GSDevTools').then(({ GSDevTools }) => {
    gsap.registerPlugin(GSDevTools);
  });
}

// Global GSAP defaults
gsap.defaults({
  ease: 'power3.out',
  duration: 0.8
});

// Reduced motion check
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export { gsap, ScrollTrigger, prefersReducedMotion };
export default gsap;
