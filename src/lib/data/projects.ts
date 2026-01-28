export interface Project {
    slug: string;
    image: string;
    link: string;
    imageObjectFit?: 'contain' | 'cover';
}

export const projects: Project[] = [
    {
        slug: "loveline",
        image: "assets/loveline.png",
        link: "https://loveline.bigls.net"
    },
    {
        slug: "robotics",
        image: "https://www.langenegg.at/wp-content/uploads/2020/08/Bundesheer-460x460-300x300.jpg",
        link: "#"
    },
    {
        slug: "grading-bot",
        image: "assets/gradingbot.png",
        link: "https://gradingbot.htl-hl.ac.at"
    },
    {
        slug: "unleashed",
        image: "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJRWTdZNThNQ000RWl1WnRKTUZXYUM4QzhudS5wbmcifQ?width=400?type=png",
        link: "#"
    },
    {
        slug: "genesys",
        image: "https://www.genesys.com/favicon.ico",
        link: "https://www.genesys.com"
    },
    {
        slug: "portfolio",
        image: "/assets/svelte.png",
        link: "#"
    },
    {
        slug: "blog",
        image: "https://media.graphassets.com/f0f4hXrHQ2yNB85Dj2ou",
        link: "https://blog.bigls.net/"
    },
    {
        slug: "github-projects",
        image: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
        link: "https://github.com/matthiasbigl"
    }
];
