<script lang="ts">
    import {browser} from '$app/environment';
    import {onMount} from 'svelte';
    import * as THREE from 'three';

    let hover = false;
    let isDragging = false;
    let previousMouseX = 0;


    let canvasContainer: HTMLDivElement;
    let camera: THREE.PerspectiveCamera
    let scene: THREE.Scene;
    let renderer: THREE.WebGLRenderer;
    let mountainMesh: THREE.Mesh;
    let sunLight: THREE.DirectionalLight;

    function toRadians(number: number) {
        return number * Math.PI / 180;
    }

    if (browser) {
        let lastTimestamp = 0;

        onMount(() => {
            scene = new THREE.Scene();

            camera = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
            camera.position.set(5, 5, 5);
            camera.lookAt(scene.position);

            renderer = new THREE.WebGLRenderer({alpha: true});
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
            renderer.domElement.classList.add('w-full', 'h-full', 'drop-shadow-2xl', 'overflow-hidden',);


            canvasContainer.appendChild(renderer.domElement);

            //create a mountain using a MeshStandardMaterial
            const mountain = new THREE.MeshStandardMaterial({
                displacementMap: new THREE.TextureLoader().load('/assets/terainHeightMap.png'),
                displacementScale: 12,
                map: new THREE.TextureLoader().load('/assets/terain.png'),
            });

            //create a plane geometry to hold the mountain material
            const plane = new THREE.PlaneGeometry(15, 15, 100, 100);
            //create a mesh using the plane geometry and mountain material
            mountainMesh = new THREE.Mesh(plane, mountain);
            //rotate the mountain mesh so it is flat
            mountainMesh.rotation.x = -Math.PI / 2;
            mountainMesh.position.y = -1;
            mountainMesh.castShadow = true;
            mountainMesh.receiveShadow = true;


            //add the mountain mesh to the scene
            scene.add(mountainMesh);

            const ambientLight = new THREE.AmbientLight(0xffffff, 1);
            scene.add(ambientLight);




            sunLight = new THREE.DirectionalLight(0xaaddcc, 1);
            sunLight.position.set(10, 5, 5);
            scene.add(sunLight);

            sunLight.castShadow = true;
            sunLight.shadow.mapSize.width = 1024;
            sunLight.shadow.mapSize.height = 1024;
            sunLight.shadow.camera.near = 0.5;
            sunLight.shadow.camera.far = 500;


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

            //update the camera
            camera.lookAt(scene.position);

            //update the mountain mesh

            if (hover&&!isDragging) {
                mountainMesh.rotation.z += delta * 0.1
                sunLight.rotation.z += delta * 0.1
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
                const deltaMove = {
                    x: event.offsetX - previousMouseX,
                };

                if (hover) {
                    const deltaRotationQuaternion = new THREE.Quaternion()
                        .setFromEuler(new THREE.Euler(
                            0,
                            toRadians(deltaMove.x),
                            0,
                            'XYZ'
                        ));

                    mountainMesh.quaternion.multiplyQuaternions(deltaRotationQuaternion, mountainMesh.quaternion);
                }

                previousMouseX = event.offsetX;
            }
        }
    }
</script>

<svelte:window on:resize={() => {
    if (canvasContainer) {
          camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;

        camera.updateProjectionMatrix();
        renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
        renderer.render(scene, camera);
    }
}}/>

<section bind:this={canvasContainer} on:mouseenter={() => { hover = true }}
         on:mouseout={() => { hover = false; isDragging=false }} class="hover:scale-105
         hover:shadow-2xl
         transition-all
         duration-200
         overflow-hidden w-full h-full rounded-lg bg-slate-100 shadow-md drop-shadow-lg
        bg-gradient-to-b from-sky-100 to-sky-50
"
>
    <!-- The canvas element will be appended here -->
</section>

<style>
    canvas {
        filter: contrast(2) brightness(1.2);
    }

</style>
