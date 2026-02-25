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

	let isLoaded = $state(false);
	let isVisible = $state(false);

	let canvasContainer: HTMLElement | undefined = $state();
	let camera: ThreePerspectiveCamera | undefined = $state();
	let scene: ThreeScene | undefined = $state();
	let renderer: ThreeWebGLRenderer | undefined = $state();
	let mountainMesh: ThreeMesh | undefined;
	let sunLight: ThreeDirectionalLight | undefined;
	let snowParticles: ThreePoints | undefined;
	let observer: IntersectionObserver;

	if (browser) {
		let lastTimestamp = 0;
		let animationId: number;

		const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

		onMount(() => {
			if (!canvasContainer) return;

			let isMounted = true;

			(async () => {
				// Dynamically import Three.js to keep it out of the main chunk
				const THREE = await import('three');

				if (!isMounted || !canvasContainer) return;

				scene = new THREE.Scene();

				// Add subtle fog for atmospheric depth - lightened for visibility
				scene.fog = new THREE.FogExp2(0x1a1a2e, 0.015);

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
				renderer.toneMapping = THREE.LinearToneMapping;
				renderer.toneMappingExposure = 1.0;

				// Clean, neutral fog to let colors breathe
				scene.fog = new THREE.FogExp2(0xf0f4f8, 0.01);

				camera = new THREE.PerspectiveCamera(
					75,
					canvasContainer.clientWidth / canvasContainer.clientHeight,
					0.1,
					1000
				);
				camera.position.set(5, 5, 5);
				camera.lookAt(scene.position);

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

				const terainTexture = textureLoader.load('/assets/terain.png', checkLoaded);
				terainTexture.colorSpace = THREE.SRGBColorSpace;
				terainTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

				const mountain = new THREE.MeshStandardMaterial({
					displacementMap: textureLoader.load('/assets/terainHeightMap.png', checkLoaded),
					displacementScale: 12,
					map: terainTexture,
					roughness: 0.9,
					metalness: 0.0
				});

				// Programmatically increase contrast and saturation of the texture
				mountain.onBeforeCompile = (shader) => {
					shader.fragmentShader = shader.fragmentShader.replace(
						'#include <map_fragment>',
						`
						#include <map_fragment>
						// Contrast adjustment: (color - 0.5) * factor + 0.5
						diffuseColor.rgb = (diffuseColor.rgb - 0.5) * 1.4 + 0.52;
						// Saturation adjustment
						float luma = dot(diffuseColor.rgb, vec3(0.299, 0.587, 0.114));
						diffuseColor.rgb = mix(vec3(luma), diffuseColor.rgb, 1.3);
						`
					);
				};

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
						color: 0xffffff,
						size: 0.08,
						transparent: true,
						opacity: 0.8,
						depthWrite: false,
						blending: THREE.AdditiveBlending
					});
					snowParticles = new THREE.Points(snowGeo, snowMat);
					scene.add(snowParticles);
				}

				// ── Pure White Lighting (True Color Fidelity) ──
				const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
				scene.add(ambientLight);

				sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
				sunLight.position.set(5, 15, 5);
				scene.add(sunLight);

				const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
				fillLight.position.set(-5, 5, -5);
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
							lastTimestamp = performance.now();
							animate(lastTimestamp);
						} else {
							cancelAnimationFrame(animationId);
						}
					},
					{ threshold: 0.1 }
				);

				observer.observe(canvasContainer);
			})();

			return () => {
				isMounted = false;
				observer?.disconnect();
				cancelAnimationFrame(animationId);
				if (renderer) {
					renderer.dispose();
					if (canvasContainer && renderer.domElement) {
						canvasContainer.removeChild(renderer.domElement);
					}
				}
			};
		});

		const animate = (timestamp: number) => {
			if (!isVisible || !renderer || !scene || !camera || !mountainMesh || !sunLight) return;
			animationId = requestAnimationFrame(animate);

			const delta = (timestamp - lastTimestamp) / 1000;
			lastTimestamp = timestamp;

			camera.lookAt(scene.position);

			// Gentle auto-rotation
			if (!$reducedMotion) {
				mountainMesh.rotation.z += delta * 0.08;
				sunLight.rotation.z += delta * 0.08;
			}

			// Animate snow falling
			if (snowParticles && !$reducedMotion) {
				const positions = snowParticles.geometry.attributes.position.array as Float32Array;
				for (let i = 0; i < positions.length; i += 3) {
					positions[i + 1] -= delta * (0.5 + Math.sin(i) * 0.3);
					positions[i] += Math.sin(timestamp * 0.001 + i) * delta * 0.15;
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
	class="mountain-canvas relative w-full h-full overflow-hidden"
	aria-label={m['hobbies.mountainAlt']()}
	role="img"
>
	{#if !isLoaded}
		<div class="absolute inset-0 z-10 transition-opacity duration-500" class:opacity-0={isLoaded}>
			<Skeleton className="w-full h-full" />
		</div>
	{/if}
</figure>

<style>
	.mountain-canvas {
		transition: filter 0.5s cubic-bezier(0.4, 0, 0.2, 1);
	}
</style>
