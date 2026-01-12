export interface Project {
    title: string;
    description: string;
    image: string;
    link: string;
}

export const projects: Project[] = [{
    title: "Robotics Technology",
    description: "Currently working on: Robotics technology for the Austrian Armed Forces",
    image: "https://www.langenegg.at/wp-content/uploads/2020/08/Bundesheer-460x460-300x300.jpg",
    link: "#"
},
{
    title: "Grading Bot",
    description: "My diploma thesis: An automated system for grading students' coding assignments",
    image: "assets/gradingbot.png",
    link: "https://gradingbot.htl-hl.ac.at"
},
{
    title: "Unleashed (Closed)",
    description: "A Social Media App without any ads or tracking - Project closed due to high costs",
    image: "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJRWTdZNThNQ000RWl1WnRKTUZXYUM4QzhudS5wbmcifQ?width=400?type=png",
    link: "#"
},
{
    title: "Genesys Cloud Systems",
    description: "Worked on several big Genesys Cloud systems for enterprise communications",
    image: "https://www.genesys.com/favicon.ico",
    link: "https://www.genesys.com"
},
{
    title: "Bigls Portfolio",
    description: "This Portfolio Website, showcasing my projects and skills, built with SvelteKit,Typescript,Three.js, GSAP and many more",
    image: "/assets/svelte.png",
    link: "#"

},
{
    title: "Bigls Blog",
    description: "A Blog about my Projects and Experiences",
    image: "https://media.graphassets.com/f0f4hXrHQ2yNB85Dj2ou",
    link: "https://blog.bigls.net/"
},
{
    title: "More Projects",
    description: "Check out my Github for more Projects and Open Source contributions",
    image: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
    link: "https://github.com/matthiasbigl"
}
];
