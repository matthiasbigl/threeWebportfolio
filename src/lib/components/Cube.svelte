<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import Skeleton from './Skeleton.svelte';
	import { reducedMotion } from '$lib/stores/reducedMotion';

	// Lazy-load Three.js types
	type THREE = typeof import('three');
	type ThreeScene = import('three').Scene;
	type ThreeCamera = import('three').OrthographicCamera;
	type ThreeRenderer = import('three').WebGLRenderer;
	type ThreeMesh = import('three').Mesh;

	interface Props {
		images?: string[];
		normalMaps?: string[];
		ariaLabel?: string;
	}

	let {
		images = $bindable([]),
		normalMaps = $bindable([]),
		ariaLabel = '3D Interactive Cube'
	}: Props = $props();

	let hover = $state(false);
	let isDragging = $state(false);
	let isLoaded = $state(false);
	let isVisible = $state(false);
	let threeLoaded = $state(false);
	let previousMouseX = 0;

	let canvasContainer: HTMLElement | undefined = $state();
	let camera: ThreeCamera | undefined = $state();
	let scene: ThreeScene | undefined = $state();
	let renderer: ThreeRenderer | undefined = $state();
	let cube: ThreeMesh | undefined;
	let observer: IntersectionObserver;
	let preloadObserver: IntersectionObserver;

	if (browser) {
		let lastTimestamp = 0;
		let animationId: number;

		onMount(() => {
			if (!canvasContainer) return;

			// Preload observer - triggers Three.js load when cube is about to enter viewport
			preloadObserver = new IntersectionObserver(
				async (entries) => {
					if (entries[0].isIntersecting && !threeLoaded) {
						preloadObserver.disconnect();
						await initThree();
					}
				},
				{ rootMargin: '200px' } // Start loading 200px before entering viewport
			);

			preloadObserver.observe(canvasContainer);

			return () => {
				observer?.disconnect();
				preloadObserver?.disconnect();
				cancelAnimationFrame(animationId);
				window.removeEventListener('mouseup', onMouseUp);
				window.removeEventListener('touchend', onTouchEnd);
			};
		});

		async function initThree() {
			if (!canvasContainer || threeLoaded) return;

			// Dynamically import Three.js
			const THREE = await import('three');
			threeLoaded = true;

			scene = new THREE.Scene();

			const near = 1;
			const far = 100;
			camera = new THREE.OrthographicCamera(-5, 5, 5, -5, near, far);
			camera.position.set(5, 5, 5);
			camera.lookAt(scene.position);

			const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

			renderer = new THREE.WebGLRenderer({
				alpha: true,
				antialias: !isMobile
			});

			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
			renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
			renderer.domElement.classList.add('w-full', 'h-full', 'drop-shadow-md');

			// Enable shadows ONLY on desktop for performance
			if (!isMobile) {
				renderer.shadowMap.enabled = true;
				renderer.shadowMap.type = THREE.PCFSoftShadowMap;
			}

			canvasContainer.appendChild(renderer.domElement);

			const textureLoader = new THREE.TextureLoader();
			let loadedCount = 0;

			const checkLoaded = () => {
				loadedCount++;
				if (loadedCount >= images.length) {
					isLoaded = true;
				}
			};

			// Build materials array - BoxGeometry needs 6 faces
			// Face order: right(+X), left(-X), top(+Y), bottom(-Y), front(+Z), back(-Z)
			// If only 5 images provided, insert a dark material for bottom face (index 3)
			let imagesToUse = [...images];
			let normalMapsToUse = [...normalMaps];

			if (imagesToUse.length === 5) {
				// Insert bottom face placeholder at index 3
				imagesToUse = [...imagesToUse.slice(0, 3), '', ...imagesToUse.slice(3)];
				normalMapsToUse = [...normalMapsToUse.slice(0, 3), '', ...normalMapsToUse.slice(3)];
			}

			const materials = imagesToUse.map((image, index) => {
				// Use a dark material for the bottom face (hidden from view)
				if (!image) {
					return new THREE.MeshStandardMaterial({
						color: 0x1a1a2e,
						side: THREE.DoubleSide
					});
				}
				const texture = textureLoader.load(image, () => checkLoaded());
				return new THREE.MeshStandardMaterial({
					map: texture,
					side: THREE.DoubleSide,
					normalScale: new THREE.Vector2(6.0, 6.0),
					normalMap: normalMapsToUse[index] ? textureLoader.load(normalMapsToUse[index]) : null
				});
			});

			const geometry = new THREE.BoxGeometry(4, 4, 4);
			cube = new THREE.Mesh(geometry, materials);
			cube.receiveShadow = true;
			cube.position.y = 2;
			scene.add(cube);

			const planeGeometry = new THREE.PlaneGeometry(10, 10);
			const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
			const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
			planeMesh.rotateX(-Math.PI / 2);
			planeMesh.position.y = -2;
			planeMesh.receiveShadow = true;
			scene.add(planeMesh);

			const directionalLeftLight = new THREE.DirectionalLight(0xffffff, 2.5);
			directionalLeftLight.position.set(5, 5, 2);
			directionalLeftLight.castShadow = !isMobile;
			scene.add(directionalLeftLight);

			const directionalRightLight = new THREE.DirectionalLight(0xffffff, 1);
			directionalRightLight.position.set(-5, 5, 2);
			directionalRightLight.castShadow = !isMobile;
			scene.add(directionalRightLight);

			const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
			scene.add(ambientLight);

			// Visibility tracking for animation
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

			// Mouse and touch event listeners
			canvasContainer.addEventListener('mousedown', onMouseDown);
			window.addEventListener('mouseup', onMouseUp);
			canvasContainer.addEventListener('mousemove', onMouseMove);

			canvasContainer.addEventListener('touchstart', onTouchStart, { passive: false });
			window.addEventListener('touchend', onTouchEnd);
			canvasContainer.addEventListener('touchmove', onTouchMove, { passive: false });
		}

		const animate = (timestamp: number) => {
			if (!isVisible || !renderer || !scene || !camera || !cube) return;

			animationId = requestAnimationFrame(animate);

			const delta = (timestamp - lastTimestamp) / 1000;
			lastTimestamp = timestamp;

			if (!isDragging && !$reducedMotion) {
				cube.rotation.y += 0.2 * delta;
			}

			if (hover && !$reducedMotion) {
				if (cube.position.y < 1) {
					cube.position.y = Math.min(cube.position.y + delta * 1.5, 1);
				}
			} else {
				if (cube.position.y > 0) {
					cube.position.y = Math.max(cube.position.y - delta * 1.5, 0);
				}
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

		function onMouseMove(event: MouseEvent) {
			if (isDragging && cube && canvasContainer) {
				const deltaX = event.clientX - previousMouseX;
				cube.rotation.y += (deltaX / canvasContainer.clientWidth) * Math.PI * 2;
				previousMouseX = event.clientX;
			}
		}

		function onTouchStart(event: TouchEvent) {
			isDragging = true;
			previousMouseX = event.touches[0].clientX;
		}

		function onTouchEnd() {
			isDragging = false;
		}

		function onTouchMove(event: TouchEvent) {
			if (isDragging && cube && canvasContainer) {
				const deltaX = event.touches[0].clientX - previousMouseX;
				cube.rotation.y += (deltaX / canvasContainer.clientWidth) * Math.PI * 2;
				previousMouseX = event.touches[0].clientX;
				event.preventDefault();
			}
		}
	}

	// Debounced resize handler for performance
	let resizeTimeout: ReturnType<typeof setTimeout>;
	function handleResize() {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(() => {
			if (canvasContainer && camera && renderer && scene) {
				camera.updateProjectionMatrix();
				renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
			}
		}, 100);
	}
</script>

<svelte:window onresize={handleResize} />

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
	class="w-full h-full overflow-hidden relative group cursor-grab active:cursor-grabbing will-change-transform"
	aria-label={ariaLabel}
	role="img"
>
	{#if !isLoaded}
		<div class="absolute inset-0 z-10 transition-opacity duration-500" class:opacity-0={isLoaded}>
			<Skeleton className="w-full h-full" />
		</div>
	{/if}
</figure>

<style>
	div {
		transition: transform 0.3s ease;
	}
	div:hover {
		transform: scale(1.05);
	}
</style>
