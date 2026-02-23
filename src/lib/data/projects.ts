import lovelineImg from '$lib/assets/loveline.png?enhanced';
import gradingbotImg from '$lib/assets/gradingbot.png?enhanced';
import svelteImg from '$lib/assets/svelte.png?enhanced';
import freejazztattooImg from '$lib/assets/freejazztattoo.svg?enhanced';
import type { Picture } from 'vite-imagetools';

export interface Project {
	slug: string;
	image: string | Picture;
	link: string;
	imageObjectFit?: 'contain' | 'cover';
	isExternal?: boolean;
	year: string;
	category: string;
	color: string;
	accentGradient: string;
}

export const projects: Project[] = [
	{
		slug: 'loveline',
		image: lovelineImg,
		link: 'https://loveline.bigls.net',
		year: 'Ongoing',
		category: 'IoT<br>Web',
		color: '#f43f5e',
		accentGradient: 'from-rose-500/20 via-pink-500/10 to-fuchsia-500/5'
	},
	{
		slug: 'robotics',
		image: 'https://www.langenegg.at/wp-content/uploads/2020/08/Bundesheer-460x460-300x300.jpg',
		link: '#',
		year: '2025',
		category: 'Defence<br>Embedded',
		color: '#22c55e',
		accentGradient: 'from-emerald-500/20 via-green-500/10 to-teal-500/5'
	},
	{
		slug: 'grading-bot',
		image: gradingbotImg,
		link: 'https://gradingbot.htl-hl.ac.at',
		year: '2024',
		category: 'EdTech<br>DevOps',
		color: '#a855f7',
		accentGradient: 'from-purple-500/20 via-violet-500/10 to-indigo-500/5'
	},
	{
		slug: 'unleashed',
		image:
			'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJRWTdZNThNQ000RWl1WnRKTUZXYUM4QzhudS5wbmcifQ?width=400?type=png',
		link: '#',
		year: '2022',
		category: 'Mobile<br>Privacy',
		color: '#06b6d4',
		accentGradient: 'from-cyan-500/20 via-sky-500/10 to-blue-500/5'
	},
	{
		slug: 'free-jazz-tattoo',
		image: freejazztattooImg,
		link: 'https://free-jazz-tattoo.vercel.app',
		year: '2024',
		category: 'Web<br>Design',
		color: '#f59e0b',
		accentGradient: 'from-amber-500/20 via-orange-500/10 to-yellow-500/5'
	},
	{
		slug: 'portfolio',
		image: svelteImg,
		link: '#',
		year: '2025',
		category: '3D<br>Creative',
		color: '#3b82f6',
		accentGradient: 'from-blue-500/20 via-indigo-500/10 to-violet-500/5'
	},
	{
		slug: 'blog',
		image: 'https://media.graphassets.com/f0f4hXrHQ2yNB85Dj2ou',
		link: 'https://blog.bigls.net/',
		isExternal: true,
		year: '2024',
		category: 'Content',
		color: '#64748b',
		accentGradient: 'from-slate-500/20 via-gray-500/10 to-zinc-500/5'
	},
	{
		slug: 'github-projects',
		image: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
		link: 'https://github.com/matthiasbigl',
		isExternal: true,
		year: 'Ongoing',
		category: 'Open<br>Source',
		color: '#64748b',
		accentGradient: 'from-slate-500/20 via-gray-500/10 to-zinc-500/5'
	}
];
