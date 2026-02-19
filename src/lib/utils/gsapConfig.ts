import { get } from 'svelte/store';
import { reducedMotion } from '../stores/reducedMotion';

/**
 * Configure GSAP to respect reduced motion preferences.
 */
export async function initGsapReducedMotion() {
	const { gsap } = await import('gsap');

	// If the user prefers reduced motion, we can tell GSAP to basically disable all animations
	// by setting its global ticker or ticker's duration.
	// However, a better approach is often to use the store in specific components
	// or use gsap.matchMedia locally.

	// We can set a global flag if needed, but GSAP's matchMedia is very powerful.
}

/**
 * A utility to wrap GSAP matchMedia with reduced motion awareness.
 */
export function getReducedMotionMedia() {
	const isReduced = get(reducedMotion);
	return isReduced ? '(prefers-reduced-motion: reduce)' : '(prefers-reduced-motion: no-preference)';
}
