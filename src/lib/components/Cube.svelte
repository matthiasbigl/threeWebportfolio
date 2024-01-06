<script lang="ts">
    import { browser } from '$app/environment';
    import { onMount } from 'svelte';
    import * as THREE from 'three';

    export let images: string[] = [];

    let hover = false;
    let isDragging = false;
    let previousMouseX = 0;

    // add an image at position 4 and shift the rest of the images down one position
    function addImage(image: string) {
        images = [...images.slice(0, 3), image, ...images.slice(3)];
    }

    addImage("https://placehold.co/400");
    console.log(images);

    let canvasContainer: HTMLDivElement;
    let camera: THREE.OrthographicCamera;
    let scene: THREE.Scene;
    let renderer: THREE.WebGLRenderer;
    let cube: THREE.Mesh;
    let mouse: THREE.Vector2;

    if (browser) {
        let lastTimestamp = 0;

        onMount(() => {
            scene = new THREE.Scene();

            const near = 1;
            const far = 100;
            camera = new THREE.OrthographicCamera(-5, 5, 5, -5, near, far);
            camera.position.set(5, 5, 5);
            camera.lookAt(scene.position);

            renderer = new THREE.WebGLRenderer({ alpha: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
            renderer.domElement.classList.add('w-full', 'h-full', 'drop-shadow-md');

            // Enable shadows
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;

            canvasContainer.appendChild(renderer.domElement);

            const textureLoader = new THREE.TextureLoader();

            const materials = images.map((image) => {
                const texture = textureLoader.load(image);
                return new THREE.MeshPhongMaterial({
                    map: texture,
                    shininess: 50,
                    side: THREE.DoubleSide,
                });
            });

            const geometry = new THREE.BoxGeometry(4, 4, 4);
            cube = new THREE.Mesh(geometry, materials);
            // cube.castShadow = true; // Enable shadow casting
            cube.receiveShadow = true; // Enable shadow receiving
            cube.position.y = 2;
            scene.add(cube);

            const planeGeometry = new THREE.PlaneGeometry(10, 10);
            const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
            const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
            planeMesh.rotateX(-Math.PI / 2); // Rotate the plane to be horizontal
            planeMesh.position.y = -2; // Adjust the position based on your scene
            planeMesh.receiveShadow = true; // Enable shadow receiving for the plane
            scene.add(planeMesh);

            const directionalLeftLight = new THREE.DirectionalLight(0xffffff, 2);
            directionalLeftLight.position.set(5, 5, 2);
            directionalLeftLight.castShadow = true; // Enable shadow casting
            directionalLeftLight.shadow.mapSize.width = 1024; // Shadow map width
            directionalLeftLight.shadow.mapSize.height = 1024; // Shadow map height
            scene.add(directionalLeftLight);

            const directionalRightLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalRightLight.position.set(-5, 5, 2);
            directionalRightLight.castShadow = true; // Enable shadow casting
            directionalRightLight.shadow.mapSize.width = 1024; // Shadow map width
            directionalRightLight.shadow.mapSize.height = 1024; // Shadow map height
            scene.add(directionalRightLight);

            const ambientLight = new THREE.AmbientLight(0xffffff);
            scene.add(ambientLight);

            mouse = new THREE.Vector2();

            // Mouse event listeners for dragging
            canvasContainer.addEventListener('mousedown', onMouseDown);
            canvasContainer.addEventListener('mouseup', onMouseUp);
            canvasContainer.addEventListener('mousemove', onMouseMove);

            animate(0);
        });

        const render = () => {
            renderer.clear();
            renderer.render(scene, camera);
        };

        const animate = (timestamp: number) => {
            requestAnimationFrame(animate);

            const delta = (timestamp - lastTimestamp) / 1000;
            lastTimestamp = timestamp;

            // Rotate the cube
            if (!isDragging) {
                cube.rotation.y += 0.2 * delta; // Rotate around the y-axis
            }

            // animate the cube to move up and down if the hover variable is true
            if (hover && cube.position.y < 1) {
                cube.position.y += delta*1.5;
            } else if (!hover && cube.position.y > 0) {
                cube.position.y -= delta*1.5;
            }

            camera.updateProjectionMatrix();
            render();
        };

        // Function to handle mouse down event
        function onMouseDown(event: MouseEvent) {
            isDragging = true;
            previousMouseX = event.clientX;
        }

        // Function to handle mouse up event
        function onMouseUp() {
            isDragging = false;
        }

        // Function to handle mouse move event
        function onMouseMove(event: MouseEvent) {
            if (isDragging) {
                const deltaX = event.clientX - previousMouseX;
                cube.rotation.y += (deltaX / canvasContainer.clientWidth) * Math.PI * 2;
                previousMouseX = event.clientX;
            }
        }
    }
</script>

<svelte:window on:resize={() => {
    if (canvasContainer) {
        camera.left = -5;
        camera.right = 5;
        camera.top = 5;
        camera.bottom = -5;
        camera.updateProjectionMatrix();
        renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
        renderer.render(scene, camera);
    }
}}/>

<section bind:this={canvasContainer} on:mouseenter={() => { hover = true }} on:mouseout={() => { hover = false, isDragging=false }} class="w-full h-full overflow-hidden hover:scale-1.1">
    <!-- The canvas element will be appended here -->
</section>

<style>

</style>
