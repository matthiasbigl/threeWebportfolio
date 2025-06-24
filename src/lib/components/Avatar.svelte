<script lang="ts">
    import { browser } from '$app/environment';
    import { onMount, onDestroy } from 'svelte';
    import * as THREE from 'three';
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

    // Component state
    let canvasContainer: HTMLDivElement = $state();
    let camera: THREE.PerspectiveCamera;
    let scene: THREE.Scene;
    let renderer: THREE.WebGLRenderer;
    let isLoading = $state(true);
    let animationId: number;
    let flickerIntervals: number[] = [];

    // Cleanup function
    const cleanup = () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        
        flickerIntervals.forEach(id => clearInterval(id));
        flickerIntervals = [];
        
        if (renderer) {
            renderer.dispose();
            if (canvasContainer && renderer.domElement) {
                canvasContainer.removeChild(renderer.domElement);
            }
        }
        
        if (scene) {
            scene.traverse((object) => {
                if (object instanceof THREE.Mesh) {
                    object.geometry.dispose();
                    if (object.material instanceof THREE.Material) {
                        object.material.dispose();
                    }
                }
            });
        }
    };

    // Random flicker timing helper
    const getRandomFlickerDelay = () => Math.random() * 400 + 300; // 300-700ms

    // Light flicker effect
    const createFlickerEffect = (
        light: THREE.Light, 
        targetIntensity: number, 
        flickerCount: number, 
        startDelay: number
    ) => {
        const timeoutId = setTimeout(() => {
            let count = 0;
            const intervalId = setInterval(() => {
                light.intensity = light.intensity === 0 
                    ? targetIntensity 
                    : Math.random() * targetIntensity * 0.5;
                
                count++;
                if (count > flickerCount) {
                    clearInterval(intervalId);
                    light.intensity = targetIntensity;
                    flickerIntervals = flickerIntervals.filter(id => id !== intervalId);
                }
            }, getRandomFlickerDelay());
            
            flickerIntervals.push(intervalId);
        }, startDelay);    };

    // Handle resize function - accessible to svelte:window
    const handleResize = () => {
        if (!browser || !camera || !renderer || !canvasContainer) return;
        
        camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
        renderer.render(scene, camera);
    };

    onMount(() => {
        if (!browser) return;

        const initializeThreeJS = () => {
            if (!canvasContainer) return;

            // Create Three.js scene, camera, and renderer
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(35, 1, 0.1, 1000);
            renderer = new THREE.WebGLRenderer({ alpha: true });
            renderer.setPixelRatio(window.devicePixelRatio);

            // Calculate canvas size and setup renderer
            const canvasWidth = canvasContainer.clientWidth;
            const canvasHeight = canvasContainer.clientHeight;
            renderer.setSize(canvasWidth, canvasHeight);
            renderer.domElement.classList.add('w-full', 'h-full');
            canvasContainer.appendChild(renderer.domElement);

            // Setup camera
            camera.position.z = 9;
            camera.fov = 35;
            camera.updateProjectionMatrix();
            camera.rotation.set(-Math.PI / 28, 0, 0);

            // Setup lighting
            setupLighting();

            // Load the avatar model
            loadAvatarModel();

            // Start animation loop
            animate();
        };

        const setupLighting = () => {
            // Front light with flicker effect
            const frontLight = new THREE.DirectionalLight(0xffffff, 0);
            frontLight.position.set(0, 1, 4);
            scene.add(frontLight);
            createFlickerEffect(frontLight, 4.0, 9, 500);

            // Blue light with flicker effect
            const blueLight = new THREE.DirectionalLight(0x0000ff, 0);
            blueLight.position.set(1.5, 0.5, 1);
            scene.add(blueLight);
            createFlickerEffect(blueLight, 2.0, 7, 600);

            // Red light with flicker effect
            const redLight = new THREE.DirectionalLight(0xff0000, 0);
            redLight.position.set(-1.5, 0.5, 1);
            scene.add(redLight);
            createFlickerEffect(redLight, 2.0, 11, 700);

            // Ambient and fill lights
            const ambientLight = new THREE.AmbientLight(0x404040, 2.0);
            scene.add(ambientLight);

            const fillLight = new THREE.DirectionalLight(0xffffff, 1.5);
            fillLight.position.set(0, -1, 2);
            scene.add(fillLight);
        };

        const loadAvatarModel = () => {
            const loader = new GLTFLoader();
            
            loader.load(
                '/assets/MatthiasBigl.glb',
                (gltf) => {
                    gltf.scene.scale.set(3, 3, 3);
                    gltf.scene.position.y = -1.5;
                    scene.add(gltf.scene);
                    isLoading = false;
                },
                (xhr) => {
                    console.log(`Loading progress: ${(xhr.loaded / xhr.total) * 100}%`);
                },
                (error) => {
                    console.error('Error loading avatar model:', error);
                    isLoading = false;
                }
            );
        };

        const render = () => {
            renderer.clear();
            renderer.render(scene, camera);
        };

        const animate = () => {
            animationId = requestAnimationFrame(animate);
            
            if (!canvasContainer) return;
            
            render();
        };

        // Wait for DOM to be ready, then initialize
        requestAnimationFrame(() => {
            initializeThreeJS();
        });
    });

    onDestroy(() => {
        cleanup();
    });
</script>

<svelte:window onresize={handleResize} />

<section
        bind:this={canvasContainer}
        class="w-full aspect-square bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg overflow-hidden {isLoading ? 'pulsing-loading' : ''}">
    <!-- The canvas element will be appended here -->
</section>

<style>
    .pulsing-loading {
        animation: pulse-brightness 2s ease-in-out infinite;
    }

    @keyframes pulse-brightness {
        0%, 100% {
            filter: brightness(0.7);
        }
        50% {
            filter: brightness(1.1);
        }
    }
</style>
