<script lang="ts">
    import {onDestroy, onMount} from "svelte";
    import { goto } from '$app/navigation';

    let isHamOpen = false;


    //check if when the user clicks outside of the menu, it should close ok lets go


    function checkIfShouldClose(e: MouseEvent) {
        const target = e.target as HTMLElement;

        if (target.classList.contains("fixed")) {
            isHamOpen = false;
        }
    }



</script>

  <svelte:window on:click={checkIfShouldClose} />

    <header class="fixed top-0 left-0 z-50 w-full flex items-center justify-center px-6 py-4 font-bold text-zinc-600">
        <div class="w-full md:w-2/3 flex-row flex items-center justify-between">
            <div class="w-14 h-14 text-xl rounded-lg bg-white items-center justify-center flex font-bold  shadow-md divide-x divide-gray-200">
                <button class="blue-gradient_text" on:click={() => (isHamOpen = !isHamOpen)}>MB</button>
            </div>

            <div class="hidden md:flex items-center justify-center text-center rounded-lg bg-white shadow-md p-4 font-bold divide-zinc-600 divide-x">
                <a href="/" class="hover:blue-gradient_text transition-all duration-150 ease-in-out hover:scale-[1.1] px-4">
                    Home
                </a>
                <a href="/assets/resume.pdf" download="MatthiasBigl-Resume.pdf" class="hover:blue-gradient_text transition-all duration-150 ease-in-out hover:scale-[1.1] px-4">
                    Resume
                </a>
                <a href="/contact" class="hover:blue-gradient_text transition-all duration-150 ease-in-out hover:scale-[1.1] px-4">
                    Contact
                </a>
            </div>
        </div>
    </header>

    {#if isHamOpen}
        <div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50"
        on:click={() => (isHamOpen = false)}
        >
            <div class="bg-white flex-col flex p-8 rounded-md shadow-md divide-y divide-gray-200 font-bold text-xl">
                <button
                        on:click={() => {
                            goto("/");
                            isHamOpen = false;
                        }}
                        class="hover:blue-gradient_text transition-all duration-150 ease-in-out hover:scale-[1.1] mx-auto py-2">Home</button>
                <a href="/assets/resume.pdf" download="MatthiasBigl-Resume.pdf" class="mx-auto py-2 hover:blue-gradient_text transition-all duration-150 ease-in-out hover:scale-[1.1]">Resume</a>
                <button
                        on:click={() => {
                            goto("/contact");
                            isHamOpen = false;
                        }}
                        class=" mx-auto py-2 hover:blue-gradient_text transition-all duration-150 ease-in-out hover:scale-[1.1]">Contact</button>
            </div>
        </div>
    {/if}

