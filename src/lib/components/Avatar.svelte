<script lang="ts">
    // Import required modules
    import { browser } from '$app/environment';
    import { onMount } from 'svelte';
    import * as THREE from 'three';
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

    // Declare a variable to hold the container element
    let canvasContainer: HTMLDivElement;

    let camera: THREE.PerspectiveCamera;
    let scene: THREE.Scene;
    let renderer: THREE.WebGLRenderer;
    let isLoading = true; // Added loading state
    // let pulsingLight: THREE.PointLight | null = null; // Removed pulsingLight

    // Check if the code is running in the browser environment
    if (browser) {
        // Declare variables for Three.js components

        // Declare a variable to store the timestamp of the last frame
        // let lastTimestamp = 0; // Removed lastTimestamp

        // Run this code when the component is mounted
        onMount(() => {
            // Create a Three.js scene, camera, and renderer
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera();
            renderer = new THREE.WebGLRenderer({ alpha: true });
            renderer.setPixelRatio(window.devicePixelRatio); // Set pixel ratio for higher resolution

            // Setup pulsing light for loading phase -- REMOVED
            // pulsingLight = new THREE.PointLight(0xffffff, 0, 100); // White, intensity 0, range 100
            // pulsingLight.position.set(0, 0.5, 1); // Positioned centrally
            // scene.add(pulsingLight);

            // Calculate initial canvas size based on the container
            const canvasWidth = canvasContainer.clientWidth;
            const canvasHeight = canvasContainer.clientHeight;

            // Set renderer size and add Tailwind classes to make it responsive
            renderer.setSize(canvasWidth, canvasHeight);
            renderer.domElement.classList.add('w-full', 'h-full');

            // Append renderer's canvas to the container
            canvasContainer.appendChild(renderer.domElement);

            // Load the avatar GLB file with animations using GLTFLoader
            const loader = new GLTFLoader();

            loader.load(
                '/assets/MatthiasBigl.glb',
                function (gltf) {
                    // Scale the loaded model (8 times bigger)
                    gltf.scene.scale.set(3,3,3); // Adjusted from (7,7,7) to (3,3,3)

                    // Move the loaded model down (50% down)
                    gltf.scene.position.y = -1; // Adjusted from -2 to -1 (moved up)

                    scene.add(gltf.scene);
                    isLoading = false; // Set loading to false when model is loaded
                    // Note: pulsingLight will be removed in the animate loop
                    gltf.scene; // THREE.Group
                    gltf.scenes; // Array<THREE.Group>
                    gltf.cameras; // Array<THREE.Camera>
                    gltf.asset; // Object

 },
                function (xhr) {
                    console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
                },
                // called when loading has errors
                function (error) {
                    console.log('An error happened');
                }
            );

            // Set camera position
            camera.position.z = 6;
            camera.rotation.set(-Math.PI / 28, 0, 0);

            const targetFrontLightIntensity = 2.5;
            const frontLight = new THREE.DirectionalLight(0xffffff, 0); // Start with intensity 0
            frontLight.position.set(0, 1, 4); // In front of the avatar, adjusted Y position
            scene.add(frontLight);

            // Flicker effect for frontLight on mount
            setTimeout(() => {
                let flickerCount = 0;
                const flickerInterval = setInterval(() => {
                    frontLight.intensity = frontLight.intensity === 0 ? targetFrontLightIntensity : Math.random() * targetFrontLightIntensity * 0.5;
                    flickerCount++;
                    if (flickerCount > 9) { // Flicker ~5 times
                        clearInterval(flickerInterval);
                        frontLight.intensity = targetFrontLightIntensity; // Ensure it's on
                    }
                }, 120); // Flicker every 120ms
            }, 500); // Start flicker after 500ms


            const targetBlueLightIntensity = 1.2;
            const blueLight = new THREE.DirectionalLight(0x0000ff, 0); // Start with intensity 0
            blueLight.position.set(1.5, 0.5, 1); // From the right, adjusted position and intensity
            scene.add(blueLight);

            // Flicker effect for blueLight on mount
            setTimeout(() => {
                let flickerCount = 0;
                const flickerInterval = setInterval(() => {
                    blueLight.intensity = blueLight.intensity === 0 ? targetBlueLightIntensity : Math.random() * targetBlueLightIntensity * 0.5;
                    flickerCount++;
                    if (flickerCount > 7) { // Flicker ~4 times
                        clearInterval(flickerInterval);
                        blueLight.intensity = targetBlueLightIntensity; // Ensure it's on
                    }
                }, 150); // Flicker every 150ms
            }, 600); // Start flicker after 600ms

            // Add red light from the left
            const targetRedLightIntensity = 1.2;
            const redLight = new THREE.DirectionalLight(0xff0000, 0); // Start with intensity 0
            redLight.position.set(-1.5, 0.5, 1); // From the left, adjusted position and intensity
            scene.add(redLight);

            // Flicker effect for redLight on mount
            setTimeout(() => {
                let flickerCount = 0;
                const flickerInterval = setInterval(() => {
                    redLight.intensity = redLight.intensity === 0 ? targetRedLightIntensity : Math.random() * targetRedLightIntensity * 0.5;
                    flickerCount++;
                    if (flickerCount > 11) { // Flicker ~6 times
                        clearInterval(flickerInterval);
                        redLight.intensity = targetRedLightIntensity; // Ensure it's on
                    }
                }, 200); // Flicker every 100ms
            }, 700); // Start flicker after 700ms

            // Add ambient light
            const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
            scene.add(ambientLight);

            // Start the animation loop
            animate();


        });

        // Function to render the scene
        const render = () => {
            renderer.clear();
            renderer.render(scene, camera);
        };

        // Animation loop
        const animate = () => { // Removed timestamp parameter
            requestAnimationFrame(animate);

            // if (isLoading && pulsingLight) { // REMOVED pulsing light logic
            //     const time = Date.now() * 0.001; // Time in seconds
            //     const pulseSpeed = 0.8; // Controls speed of the pulse (lower is slower)
            //     const maxIntensity = 1.5; // Maximum intensity of the pulse
            //     const exponent = 2; // Controls the shape (e.g., 2 for a sharper peak)
            //
            //     const pulseFactor = (Math.sin(time * pulseSpeed) + 1) / 2; // Oscillates 0-1
            //     pulsingLight.intensity = Math.pow(pulseFactor, exponent) * maxIntensity;
            // } else if (!isLoading && pulsingLight) {
            //     scene.remove(pulsingLight);
            //     pulsingLight.dispose(); // Clean up the light
            //     pulsingLight = null; // Set to null to stop further processing
            // }

            // Calculate delta based on the elapsed time since the last frame
            // const delta = (timestamp - lastTimestamp) / 1000; // Convert milliseconds to seconds // Removed delta calculation
            // lastTimestamp = timestamp; // Removed lastTimestamp update

            // Find the "greeting" animation
            // const greetingAnimation = THREE.AnimationClip.findByName(gltfAnimations, 'greeting'); // Removed animation finding
            // const dancingAnimation = THREE.AnimationClip.findByName(gltfAnimations, 'dance'); // Removed animation finding

            // if (greetingAnimation) { // Removed animation playback
            //     // Create an action and play the "greeting" animation
            //     const greetingAction = mixer.clipAction(greetingAnimation);
            //     greetingAction.play();
            // }



            // Check if mixer is available and update it
            // if (mixer) { // Removed mixer update
            //     mixer.update(delta);
            // }

            // Check if canvasContainer is available
            if (!canvasContainer) {
                return;
            }

            // Update the camera's aspect ratio and position
            camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
            camera.updateProjectionMatrix();

            // Render the scene
            render();
        };
    }


</script>

<svelte:window on:resize={() => {
    if (canvasContainer) {
        camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
        renderer.render(scene, camera);
    }
}} />

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
