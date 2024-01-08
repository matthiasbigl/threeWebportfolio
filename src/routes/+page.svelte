<script lang="ts">
    import Avatar from "$lib/components/Avatar.svelte";
    import Cube from "$lib/components/Cube.svelte";
    import Mountains from "$lib/components/Mountains.svelte";


    const projects = [
        {
            title: "Unleashed",
            description: "A Social Media App without any ads or tracking",
            image: "https://unleashed-coral.vercel.app/_next/image?url=https%3A%2F%2Funleashed-images.s3.eu-central-1.amazonaws.com%2Fuser_2Oe6VaszvuPGmbbzyaBvQTbwiZu%2Fb4189c45-d379-4d17-80d5-76e38bc03c56%2Flogofinal.png&w=3840&q=30",
            link: "https://unleashed-coral.vercel.app/"
        },
        {
            title: "Grading Bot",
            description: "WORK IN PROGRESS: An automated System for grading Students coding Assignments",
            image: "assets/gradingbot.png",
            link: "https://gradingbot.htl-hl.ac.at"
        },
        {
            title: "Bigls Blog",
            description: "A Blog about my Projects and Experiences",
            image: "https://media.graphassets.com/f0f4hXrHQ2yNB85Dj2ou",
            link: "https://bigls-blog.vercel.app/"
        },
        {
            title: "... and many more",
            description: "Check out my Github for more Projects",
            image: "https://web.imt-atlantique.fr/x-info/atlanmod/images/d/d1/Github.jpg",
            link: "https://github.com/matthiasbigl"
        }
    ]


</script>


<svelte:head>
    <title>Matthias Bigl</title>
    <meta name="description" content="Matthias Bigl - Software Engineer from Austria"/>
    <meta name="keywords" content="Matthias Bigl, Software Engineer, Web Developer, Web, Developer, Matthias, Bigl, matthiasbigl, matthias, bigl, matthiasbigl.at, matthiasbigl.com, matthiasbigl.dev, matthiasbigl.me, matthiasbigl.xyz, matthiasbigl.tech, matthiasbigl.online, matthiasbigl.website, matthiasbigl.blog, matthiasbigl.work, matthiasbigl.fun, matthiasbigl.live, matthiasbigl.page, matthiasbigl.cloud, matthiasbigl.app, matthiasbigl.site, matthiasbigl.space, matthiasbigl.design, matthiasbigl.digital, matthiasbigl.news, matthiasbigl.store, matthiasbigl.online, matthiasbigl.shop, matthiasbigl.club, matthiasbigl.de, matthiasbigl.eu, matthiasbigl.at, matthiasbigl.ch, matthiasbigl.li, matthiasbigl.net, nextjs, svelte, htl hollabrunn, htl, hollabrunn, htl-hl, gradingbot, unleashed
"/>


</svelte:head>

<div
        class="
       flex flex-col
"
>
    <div
            class="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-cyan-200 to-white py-12 px-4 drop-shadow-2xl sm:px-6 lg:px-8 "
    >
        <div
                class="flex-col md:flex-row flex justify-center items-center gap-x-8  md:divide-x divide-zinc-600  w-full"
        >
            <div
                    class="w-64"
            >
                <Avatar/>
            </div>
            <div>
                <h1
                        class="font-bold text-4xl text-center mt-4 drop-shadow-md"
                >
                    Hey I am <span class="blue-gradient_text">Matthias Bigl</span><br/>
                </h1>

                <p
                        class="text-center p-4 drop-shadow-lg"
                >
                    I am a <span class="blue-gradient_text">Software Engineer</span> from Austria 🇦🇹.<br/>
                    I love developing new and exciting <span
                        class="blue-gradient_text">
                    Web-Experiences
                </span>
                    <br/>
                    Lets get to know each other!
                </p>
            </div>
        </div>

    </div>

    <div class="flex flex-col gap-4 justify-center items-center text-white bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-200 via-violet-600 to-sky-900 py-8 drop-shadow-lg">
        <h1 class="font-bold text-4xl text-center mt-4 drop-shadow-md">My Skills</h1>
        <div
                class="flex md:flex-row flex-col justify-center items-center gap-y-4  w-full"
        >
            <div
                    class="flex-1
                    flex
                    flex-col
                    justify-center
                    items-center
                    "
            >
                <h2
                        class="font-semibold text-3xl text-center p-4 uppercase drop-shadow-sm   "
                >
                    Languages
                </h2>

                <div
                        class="w-full md:w-4/5 aspect-square"
                >
                    <Cube
                            images={[
        "assets/python.png",
        "assets/java.png",
        "assets/svelte.png",
        "assets/typescript.png",
        "assets/kotlin.png",
    ]}
                            normalMaps={[
        "assets/pythonNormal.png",
        "assets/javaNormal.png",
        "assets/svelteNormal.png",
        "assets/typescriptNormal.png",
        "assets/kotlinNormal.png",
                            ]}
                    />
                </div>


            </div>

            <div
                    class="flex-1
                    flex
                    flex-col
                    justify-center
                    items-center
                    "
            >
                <h2
                        class="font-semibold text-3xl text-center p-4 uppercase  "
                >
                    Strengths
                </h2>

                <div
                        class="w-full md:w-4/5 aspect-square"
                >
                    <Cube
                            images={[
        "assets/backend.png",
        "assets/UI.png",
        "assets/graphic.png",
        "assets/Teamwork.png",
        "assets/project.png",
    ]}
                            normalMaps={[
        "assets/backendNormal.png",
        "assets/UINormal.png",
        "assets/graphicNormal.png",
        "assets/TeamworkNormal.png",
        "assets/projectNormal.png",
                            ]}

                    />

                    <ul
                            class="hidden"
                    >
                        <li>Backend</li>
                        <li>UI</li>
                        <li>Graphic</li>
                        <li>Teamwork</li>
                        <li>Project Managment</li>
                    </ul>
                </div>


            </div>

        </div>

        <h1 class="font-bold text-white text-4xl text-center mt-4 drop-shadow-md">My Projects</h1>

        <div class="flex flex-col gap-4 w-full overflow-auto">

            <div class="flex justify-center items-center gap-4 p-8 mx-auto ">
                {#each projects as project}
                    <div class="w-60 flex flex-col justify-center items-center bg-gradient-to-b from-gray-100 to-gray-300 rounded-xl shadow-lg p-4 hover:scale-105 hover:shadow-2xl transition-all duration-200">
                        <h2 class="font-bold text-2xl text-center blue-gradient_text p-4">{project.title}</h2>

                        <div class="w-full aspect-square">
                            <a href={project.link} class="w-full h-full cursor-pointer">
                                <img src={project.image} alt={project.title}
                                     class="hover:scale-105 hover:shadow-2xl transition-all duration-200 object-contain w-full h-full rounded-lg bg-slate-100 p-2 shadow-md drop-shadow-lg"/>
                            </a>
                        </div>

                        <p class="text-center p-4 drop-shadow-md text-black">{project.description}</p>
                    </div>
                {/each}
            </div>
        </div>


    </div>

    <div class="w-full bg-gradient-to-t from-orange-400 to-sky-400 flex flex-col justify-center items-center py-8 drop-shadow-lg text-white overflow-hidden">
        <h1 class="font-bold text-4xl text-center mt-4 drop-shadow-md">My Hobbies</h1>
        <div class="flex flex-col gap-4 w-full overflow-auto">
            <div class="flex justify-center items-center gap-4 p-8 mx-auto ">
                <div class="w-60 flex flex-col justify-center items-center bg-gradient-to-b from-gray-100 to-gray-300 rounded-xl shadow-lg p-4 hover:scale-105 hover:shadow-2xl transition-all duration-200">
                    <h2 class="font-bold text-2xl text-center blue-gradient_text p-4">GYM</h2>

                    <div class="w-full aspect-square">

                        <img src="assets/dumbbell.png" alt="GYM"
                             class="hover:scale-105 hover:shadow-2xl transition-all duration-200 object-cover w-full h-full rounded-lg bg-slate-100 p-2 shadow-md drop-shadow-lg"/>
                    </div>

                    <p class="text-center p-4 drop-shadow-md text-black">I am always trying to push my limits in the gym
                        💪</p>
                </div>

                <div class="w-60 flex flex-col justify-center items-center bg-gradient-to-b from-gray-100 to-gray-300 rounded-xl shadow-lg p-4 hover:scale-105 hover:shadow-2xl transition-all duration-200">
                    <h2 class="font-bold text-2xl text-center blue-gradient_text p-4">Skiing</h2>

                    <div class="w-full aspect-square">
                        <Mountains/>
                    </div>

                    <p class="text-center p-4 drop-shadow-md text-black">
                        Carving down the slopes is one of my favorite things to do in winter 🎿
                    </p>
                </div>

                <div class="w-60 flex flex-col justify-center items-center bg-gradient-to-b from-gray-100 to-gray-300 rounded-xl shadow-lg p-4 hover:scale-105 hover:shadow-2xl transition-all duration-200">
                    <h2 class="font-bold text-2xl text-center blue-gradient_text p-4">Surfing</h2>

                    <div class="w-full aspect-square">

                        <img src="assets/surfing.JPG" alt="Surfing"
                             class="hover:scale-105 hover:shadow-2xl transition-all duration-200 object-cover w-full h-full rounded-lg bg-slate-100  shadow-md drop-shadow-lg"/>
                    </div>

                    <p class="text-center p-4 drop-shadow-md text-black">
                        Been Surfing since I was 6 years old 🤙
                    </p>
                </div>


            </div>
        </div>
    </div>


</div>



