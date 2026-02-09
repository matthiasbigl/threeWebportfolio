<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import Skeleton from './Skeleton.svelte';

	// Use import('three') type for type annotations without bundling
	type THREE = typeof import('three');
	type ThreePerspectiveCamera = import('three').PerspectiveCamera;
	type ThreeScene = import('three').Scene;
	type ThreeWebGLRenderer = import('three').WebGLRenderer;
	type ThreeMesh = import('three').Mesh;
	type ThreeDirectionalLight = import('three').DirectionalLight;

	let hover = $state(false);
	let isDragging = $state(false);
	let isLoaded = $state(false);
	let isVisible = $state(false);
	let previousMouseX = 0;

	let canvasContainer: HTMLDivElement | undefined = $state();
	let camera: ThreePerspectiveCamera | undefined = $state();
	let scene: ThreeScene | undefined = $state();
	let renderer: ThreeWebGLRenderer | undefined = $state();
	let mountainMesh: ThreeMesh | undefined;
	let sunLight: ThreeDirectionalLight | undefined;
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
			renderer.domElement.classList.add('w-full', 'h-full', 'drop-shadow-2xl', 'overflow-hidden');

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
				map: textureLoader.load('/assets/terain.png', checkLoaded)
			});

			const plane = new THREE.PlaneGeometry(15, 15, isMobile ? 64 : 128, isMobile ? 64 : 128);
			mountainMesh = new THREE.Mesh(plane, mountain);
			mountainMesh.rotation.x = -Math.PI / 2;
			mountainMesh.position.y = -1;
			mountainMesh.castShadow = !isMobile;
			mountainMesh.receiveShadow = !isMobile;
			scene.add(mountainMesh);

			const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
			scene.add(ambientLight);

			sunLight = new THREE.DirectionalLight(0xaaddcc, 4);
			sunLight.position.set(10, 5, 10);
			scene.add(sunLight);

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

			if (hover && !isDragging) {
				mountainMesh.rotation.z += delta * 0.1;
				sunLight.rotation.z += delta * 0.1;
			}

			renderer.render(scene, camera);
		};

		function onMouseDown(event: MouseEvent) {
			isDragging = true;
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

<div
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
	class="relative w-full h-full rounded-lg overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-grab active:cursor-grabbing"
	aria-label="3D Interactive Mountains"
	role="img"
>
	{#if !isLoaded}
		<div class="absolute inset-0 z-10 transition-opacity duration-500" class:opacity-0={isLoaded}>
			<Skeleton className="w-full h-full" />
		</div>
	{/if}
</div>
