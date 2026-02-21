<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import Skeleton from './Skeleton.svelte';
	import { reducedMotion } from '$lib/stores/reducedMotion';
	import * as m from '$lib/paraglide/messages.js';

	// Use import('three') type for type annotations without bundling
	type THREE = typeof import('three');
	type ThreePerspectiveCamera = import('three').PerspectiveCamera;
	type ThreeScene = import('three').Scene;
	type ThreeWebGLRenderer = import('three').WebGLRenderer;
	type ThreeMesh = import('three').Mesh;
	type ThreeDirectionalLight = import('three').DirectionalLight;
	type ThreePoints = import('three').Points;

	let hover = $state(false);
	let isDragging = $state(false);
	let isLoaded = $state(false);
	let isVisible = $state(false);
	let hasInteracted = $state(false);
	let previousMouseX = 0;

	let canvasContainer: HTMLElement | undefined = $state();
	let camera: ThreePerspectiveCamera | undefined = $state();
	let scene: ThreeScene | undefined = $state();
	let renderer: ThreeWebGLRenderer | undefined = $state();
	let mountainMesh: ThreeMesh | undefined;
	let sunLight: ThreeDirectionalLight | undefined;
	let snowParticles: ThreePoints | undefined;
	let observer: IntersectionObserver;

	function toRadians(number: number) {
		return (number * Math.PI) / 180;
	}

	if (browser) {
		let lastTimestamp = 0;
		let animationId: number;

		const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

		if (isMobile) {
			hover = true;
		}

		onMount(async () => {
			if (!canvasContainer) return;

			// Dynamically import Three.js to keep it out of the main chunk
			const THREE = await import('three');

			scene = new THREE.Scene();

			// Add subtle fog for atmospheric depth
			scene.fog = new THREE.FogExp2(0x0a0a1a, 0.02);

			camera = new THREE.PerspectiveCamera(
				75,
				canvasContainer.clientWidth / canvasContainer.clientHeight,
				0.1,
				1000
			);
			camera.position.set(5, 5, 5);
			camera.lookAt(scene.position);

			renderer = new THREE.WebGLRenderer({
				alpha: true,
				antialias: !isMobile
			});

			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
			renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
			renderer.domElement.classList.add('w-full', 'h-full', 'overflow-hidden');
			renderer.toneMapping = THREE.ACESFilmicToneMapping;
			renderer.toneMappingExposure = 1.2;

			if (!isMobile) {
				renderer.shadowMap.enabled = true;
				renderer.shadowMap.type = THREE.PCFSoftShadowMap;
			}

			canvasContainer.appendChild(renderer.domElement);

			const textureLoader = new THREE.TextureLoader();
			let loadedCount = 0;
			const checkLoaded = () => {
				loadedCount++;
				if (loadedCount >= 2) isLoaded = true;
			};

			const mountain = new THREE.MeshStandardMaterial({
				displacementMap: textureLoader.load('/assets/terainHeightMap.png', checkLoaded),
				displacementScale: 12,
				map: textureLoader.load('/assets/terain.png', checkLoaded),
				roughness: 0.85,
				metalness: 0.1
			});

			const plane = new THREE.PlaneGeometry(15, 15, isMobile ? 64 : 128, isMobile ? 64 : 128);
			mountainMesh = new THREE.Mesh(plane, mountain);
			mountainMesh.rotation.x = -Math.PI / 2;
			mountainMesh.position.y = -1;
			mountainMesh.castShadow = !isMobile;
			mountainMesh.receiveShadow = !isMobile;
			scene.add(mountainMesh);

			// ── Snow particles ──
			if (!isMobile) {
				const snowCount = 300;
				const snowGeo = new THREE.BufferGeometry();
				const snowPositions = new Float32Array(snowCount * 3);
				for (let i = 0; i < snowCount; i++) {
					snowPositions[i * 3] = (Math.random() - 0.5) * 20;
					snowPositions[i * 3 + 1] = Math.random() * 14;
					snowPositions[i * 3 + 2] = (Math.random() - 0.5) * 20;
				}
				snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPositions, 3));

				const snowMat = new THREE.PointsMaterial({
					color: 0xeef4ff,
					size: 0.08,
					transparent: true,
					opacity: 0.7,
					depthWrite: false,
					blending: THREE.AdditiveBlending
				});
				snowParticles = new THREE.Points(snowGeo, snowMat);
				scene.add(snowParticles);
			}

			// ── Lighting ──
			const ambientLight = new THREE.AmbientLight(0x8899bb, 0.35);
			scene.add(ambientLight);

			// Cool-toned key light
			sunLight = new THREE.DirectionalLight(0x99ccee, 3.5);
			sunLight.position.set(10, 8, 10);
			scene.add(sunLight);

			// Warm rim light for contrast
			const rimLight = new THREE.DirectionalLight(0xffa366, 1.5);
			rimLight.position.set(-8, 4, -6);
			scene.add(rimLight);

			// Subtle blue fill from below
			const fillLight = new THREE.PointLight(0x4488ff, 0.8, 30);
			fillLight.position.set(0, -2, 0);
			scene.add(fillLight);

			if (!isMobile) {
				sunLight.castShadow = true;
				sunLight.shadow.mapSize.width = 1024;
				sunLight.shadow.mapSize.height = 1024;
			}

			// Visibility tracking
			observer = new IntersectionObserver(
				(entries) => {
					isVisible = entries[0].isIntersecting;
					if (isVisible) {
						animate(performance.now());
					} else {
						cancelAnimationFrame(animationId);
					}
				},
				{ threshold: 0.1 }
			);

			observer.observe(canvasContainer);

			canvasContainer.addEventListener('mousedown', onMouseDown);
			window.addEventListener('mouseup', onMouseUp);
			canvasContainer.addEventListener('mousemove', onMouseMove);

			canvasContainer.addEventListener('touchstart', onTouchStart, { passive: false });
			window.addEventListener('touchend', onTouchEnd);
			canvasContainer.addEventListener('touchmove', onTouchMove, { passive: false });

			// Closure-capture THREE for interaction handlers
			onMouseMoveHandler = (event: MouseEvent) => {
				if (isDragging && mountainMesh && canvasContainer) {
					hasInteracted = true;
					const deltaX = event.clientX - previousMouseX;
					const deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(
						new THREE.Euler(0, toRadians(deltaX * 0.5), 0, 'XYZ')
					);
					mountainMesh.quaternion.multiplyQuaternions(
						deltaRotationQuaternion,
						mountainMesh.quaternion
					);
					previousMouseX = event.clientX;
				}
			};

			onTouchMoveHandler = (event: TouchEvent) => {
				if (isDragging && mountainMesh && canvasContainer) {
					hasInteracted = true;
					const deltaX = event.touches[0].clientX - previousMouseX;
					const deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(
						new THREE.Euler(0, toRadians(deltaX * 0.5), 0, 'XYZ')
					);
					mountainMesh.quaternion.multiplyQuaternions(
						deltaRotationQuaternion,
						mountainMesh.quaternion
					);
					previousMouseX = event.touches[0].clientX;
					event.preventDefault();
				}
			};

			return () => {
				observer?.disconnect();
				cancelAnimationFrame(animationId);
				window.removeEventListener('mouseup', onMouseUp);
				window.removeEventListener('touchend', onTouchEnd);
			};
		});

		const animate = (timestamp: number) => {
			if (!isVisible || !renderer || !scene || !camera || !mountainMesh || !sunLight) return;
			animationId = requestAnimationFrame(animate);

			const delta = (timestamp - lastTimestamp) / 1000;
			lastTimestamp = timestamp;

			camera.lookAt(scene.position);

			if (hover && !isDragging && !$reducedMotion) {
				mountainMesh.rotation.z += delta * 0.1;
				sunLight.rotation.z += delta * 0.1;
			}

			// Animate snow falling
			if (snowParticles && !$reducedMotion) {
				const positions = snowParticles.geometry.attributes.position.array as Float32Array;
				for (let i = 0; i < positions.length; i += 3) {
					positions[i + 1] -= delta * (0.5 + Math.sin(i) * 0.3); // fall speed
					positions[i] += Math.sin(timestamp * 0.001 + i) * delta * 0.15; // drift
					// Reset when below terrain
					if (positions[i + 1] < -2) {
						positions[i + 1] = 14;
						positions[i] = (Math.random() - 0.5) * 20;
						positions[i + 2] = (Math.random() - 0.5) * 20;
					}
				}
				snowParticles.geometry.attributes.position.needsUpdate = true;
			}

			renderer.render(scene, camera);
		};

		function onMouseDown(event: MouseEvent) {
			isDragging = true;
			hasInteracted = true;
			previousMouseX = event.clientX;
		}

		function onMouseUp() {
			isDragging = false;
		}

		// These will be assigned after THREE is loaded
		let onMouseMoveHandler: (event: MouseEvent) => void;
		let onTouchMoveHandler: (event: TouchEvent) => void;

		function onMouseMove(event: MouseEvent) {
			onMouseMoveHandler?.(event);
		}

		function onTouchStart(event: TouchEvent) {
			isDragging = true;
			hasInteracted = true;
			previousMouseX = event.touches[0].clientX;
		}

		function onTouchEnd() {
			isDragging = false;
		}

		function onTouchMove(event: TouchEvent) {
			onTouchMoveHandler?.(event);
		}
	}
</script>

<svelte:window
	onresize={() => {
		if (canvasContainer && camera && renderer) {
			camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
		}
	}}
/>

<figure
	bind:this={canvasContainer}
	onmouseenter={() => (hover = true)}
	onmouseleave={() => {
		hover = false;
		isDragging = false;
	}}
	onblur={() => {
		hover = false;
		isDragging = false;
	}}
	class="mountain-canvas relative w-full h-full rounded-lg overflow-hidden group cursor-grab active:cursor-grabbing"
	aria-label={m["hobbies.mountainAlt"]()}
	role="img"
>
	<!-- Atmospheric overlay gradients -->
	<div class="pointer-events-none absolute inset-0 z-[1] rounded-lg mountain-atmosphere"></div>

	<!-- Subtle vignette -->
	<div class="pointer-events-none absolute inset-0 z-[1] rounded-lg mountain-vignette"></div>

	{#if !isLoaded}
		<div class="absolute inset-0 z-10 transition-opacity duration-500" class:opacity-0={isLoaded}>
			<Skeleton className="w-full h-full" />
		</div>
	{/if}

	<!-- Interactive hint -->
	{#if isLoaded && !hasInteracted}
		<div
			class="mountain-hint absolute bottom-2 left-1/2 -translate-x-1/2 z-[2] flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/10"
		>
			<svg
				class="w-3.5 h-3.5 text-white/60 mountain-hint-icon"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
				/>
			</svg>
			<span class="text-[10px] text-white/50 font-medium tracking-wide whitespace-nowrap"
				>{m["hobbies.mountainHint"]()}</span
			>
		</div>
	{/if}
</figure>

<style>
	.mountain-canvas {
		transition:
			transform 0.5s cubic-bezier(0.4, 0, 0.2, 1),
			box-shadow 0.5s cubic-bezier(0.4, 0, 0.2, 1),
			filter 0.5s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.mountain-canvas:hover {
		transform: scale(1.04);
		box-shadow:
			0 0 30px rgba(100, 180, 255, 0.15),
			0 0 60px rgba(100, 180, 255, 0.08),
			0 20px 50px rgba(0, 0, 0, 0.4);
		filter: brightness(1.05) contrast(1.05);
	}

	.mountain-atmosphere {
		background:
			linear-gradient(180deg, rgba(100, 160, 255, 0.06) 0%, transparent 40%),
			linear-gradient(0deg, rgba(10, 10, 26, 0.5) 0%, transparent 30%);
	}

	.mountain-vignette {
		box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.4);
	}

	/* Hint animation */
	.mountain-hint {
		animation: mountain-hint-appear 0.8s 1.5s cubic-bezier(0.16, 1, 0.3, 1) both;
	}

	.mountain-hint-icon {
		animation: mountain-hint-wiggle 2s 2.5s ease-in-out 3;
	}

	@keyframes mountain-hint-appear {
		from {
			opacity: 0;
			transform: translateX(-50%) translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateX(-50%) translateY(0);
		}
	}

	@keyframes mountain-hint-wiggle {
		0%,
		100% {
			transform: rotate(0deg);
		}
		20% {
			transform: rotate(-12deg);
		}
		40% {
			transform: rotate(10deg);
		}
		60% {
			transform: rotate(-6deg);
		}
		80% {
			transform: rotate(4deg);
		}
	}
</style>
