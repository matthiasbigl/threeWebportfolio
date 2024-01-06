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
    let mixer: THREE.AnimationMixer;

    // Check if the code is running in the browser environment
    if (browser) {
        // Declare variables for Three.js components

        let gltfAnimations = null;

        // Declare a variable to store the timestamp of the last frame
        let lastTimestamp = 0;

        // Run this code when the component is mounted
        onMount(() => {
            // Create a Three.js scene, camera, and renderer
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera();
            renderer = new THREE.WebGLRenderer({ alpha: true });
            renderer.setPixelRatio(window.devicePixelRatio); // Set pixel ratio for higher resolution

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
                '/assets/MatthiasBiglWaving.glb',
                function (gltf) {
                    // Scale the loaded model (8 times bigger)
                    gltf.scene.scale.set(7,7,7);

                    // Move the loaded model down (50% down)
                    gltf.scene.position.y = -13;

                    scene.add(gltf.scene);
                    gltfAnimations = gltf.animations;
                    gltf.scene; // THREE.Group
                    gltf.scenes; // Array<THREE.Group>
                    gltf.cameras; // Array<THREE.Camera>
                    gltf.asset; // Object

                    // Initialize the mixer
                    mixer = new THREE.AnimationMixer(gltf.scene);
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
            camera.rotation.set(-Math.PI / 14, 0, 0);



            const frontLight = new THREE.DirectionalLight(0xffffff, 2.5); // White light with intensity 1
            frontLight.position.set(0, 0, 4); // In front of the avatar
            scene.add(frontLight);

            const blueLight = new THREE.DirectionalLight(0x0000ff, 1); // Blue light with intensity 0.5
            blueLight.position.set(1, 0, 0); // From the right
            scene.add(blueLight);

            // Add red light from the left
            const redLight = new THREE.DirectionalLight(0xff0000, 1); // Red light with intensity 0.5
            redLight.position.set(-1, 0, 0); // From the left
            scene.add(redLight);

            // Add ambient light
            const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
            scene.add(ambientLight);

            // Start the animation loop
            animate(0);


        });

        // Function to render the scene
        const render = () => {
            renderer.clear();
            renderer.render(scene, camera);
        };

        // Animation loop
        const animate = (timestamp: number) => {
            requestAnimationFrame(animate);

            // Calculate delta based on the elapsed time since the last frame
            const delta = (timestamp - lastTimestamp) / 1000; // Convert milliseconds to seconds
            lastTimestamp = timestamp;

            // Find the "greeting" animation
            const greetingAnimation = THREE.AnimationClip.findByName(gltfAnimations, 'greeting');
            const dancingAnimation = THREE.AnimationClip.findByName(gltfAnimations, 'dance');

            if (greetingAnimation) {
                // Create an action and play the "greeting" animation
                const greetingAction = mixer.clipAction(greetingAnimation);
                greetingAction.play();
            }



            // Check if mixer is available and update it
            if (mixer) {
                mixer.update(delta);
            }

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
        class="w-full aspect-square bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg overflow-hidden">
    <!-- The canvas element will be appended here -->
</section>
