<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime.js';

	const currentYear = new Date().getFullYear();

	const socialLinks = [
		{
			name: 'GitHub',
			href: 'https://github.com/matthiasbigl',
			icon: 'M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z'
		},
		{
			name: 'Email',
			href: 'mailto:biglmatthias@gmail.com',
			icon: 'M0 4a2 2 0 012-2h20a2 2 0 012 2v16a2 2 0 01-2 2H2a2 2 0 01-2-2V4zm2 0l10 7 10-7H2zm0 2v12h20V6l-10 7L2 6z'
		},
		{
			name: 'Blog',
			href: 'https://blog.bigls.net',
			icon: 'M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z'
		}
	];

	// Reactive quick links based on translations
	const quickLinks = $derived([
		{ name: m["nav.home"](), href: '/' },
		{ name: m["nav.services"](), href: '/#services' },
		{
			name:
				m["pricing.navTitle"]() ||
				(m["language.de"]() === 'Deutsch' ? 'Preis-Leitfaden' : 'Pricing Guide'),
			href: '/pricing'
		},
		{ name: m["nav.contact"](), href: '/contact' },
		{ name: m["nav.faq"](), href: '/#faq' },
		{ name: 'Blog', href: 'https://blog.bigls.net' }
	]);

	const services = $derived([
		{ name: m["footer.services.websites"](), href: '/#services' },
		{ name: m["footer.services.webshops"](), href: '/#services' },
		{ name: m["footer.services.experiences"](), href: '/#services' },
		{ name: m["footer.services.hosting"](), href: '/#services' }
	]);
</script>

<footer
	class="relative z-10"
	style="border-top: 1px solid var(--footer-border); background: var(--footer-gradient);"
>
	<!-- Subtle top glow accent -->
	<div
		class="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"
	></div>

	<div class="container mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
			<!-- Brand Section -->
			<div class="space-y-5 md:col-span-2 lg:col-span-1">
				<h3 class="text-2xl font-bold tracking-tight">
					<span class="blue-gradient_text">Matthias Bigl</span>
				</h3>
				<p class="text-sm leading-relaxed" style="color: var(--text-secondary);">
					{m["footer.description"]()}
				</p>
				<address class="not-italic space-y-3 sm:space-y-4">
					<div class="flex items-start gap-3 group/item">
						<svg
							class="w-4 h-4 text-blue-400/60 mt-1 shrink-0 group-hover/item:text-blue-400 transition-colors"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
							></path>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
							></path>
						</svg>
						<span class="text-sm leading-relaxed" style="color: var(--text-tertiary);">
							Korneuburg bei Wien<br />Österreich
						</span>
					</div>
					<a
						href="tel:+436604596636"
						class="flex items-center gap-3 group/item hover:text-blue-400 transition-colors"
					>
						<svg
							class="w-4 h-4 text-blue-400/60 group-hover/item:text-blue-400 transition-colors"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
							></path>
						</svg>
						<span class="text-sm tracking-wide">+43 660 459 6636</span>
					</a>
				</address>
			</div>

			<!-- Quick Links -->
			<div class="space-y-5">
				<h4 class="text-base font-semibold tracking-tight" style="color: var(--text-heading);">
					{m["footer.navigation"]()}
				</h4>
				<nav class="flex flex-col space-y-3" aria-label="Footer navigation">
					{#each quickLinks as link}
						<a
							href={link.href.startsWith('http') ? link.href : localizeHref(link.href)}
							class="hover:text-blue-400 transition-colors duration-300 text-sm hover:translate-x-1 transform transition-transform"
							style="color: var(--text-secondary);"
							target={link.href.startsWith('http') ? '_blank' : undefined}
							rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
						>
							{link.name}
						</a>
					{/each}
				</nav>
			</div>

			<!-- Services -->
			<div class="space-y-5">
				<h4 class="text-base font-semibold tracking-tight" style="color: var(--text-heading);">
					{m["footer.servicesTitle"]()}
				</h4>
				<nav class="flex flex-col space-y-3" aria-label="Services navigation">
					{#each services as service}
						<a
							href={localizeHref(service.href)}
							class="hover:text-blue-400 transition-colors duration-300 text-sm hover:translate-x-1 transform transition-transform"
							style="color: var(--text-secondary);"
						>
							{service.name}
						</a>
					{/each}
				</nav>
			</div>

			<!-- Social & Contact -->
			<div class="space-y-5">
				<h4 class="text-base font-semibold tracking-tight" style="color: var(--text-heading);">
					{m["footer.contactTitle"]()}
				</h4>
				<div class="flex space-x-3">
					{#each socialLinks as social}
						<a
							href={social.href}
							class="w-10 h-10 rounded-xl hover:bg-blue-500/20 hover:border-blue-500/30 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
							style="background: var(--bg-surface); border: 1px solid var(--border-primary);"
							target="_blank"
							rel="noopener noreferrer me"
							aria-label={social.name}
							title={social.name}
						>
							<svg
								class="w-5 h-5 group-hover:text-blue-400 transition-colors duration-300"
								style="color: var(--text-secondary);"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path d={social.icon} />
							</svg>
						</a>
					{/each}
				</div>
				<p class="text-sm" style="color: var(--text-secondary);">
					<a
						href="mailto:biglmatthias@gmail.com"
						class="hover:text-blue-400 transition-colors duration-300"
					>
						biglmatthias@gmail.com
					</a>
				</p>
				<p class="text-xs leading-relaxed" style="color: var(--text-tertiary);">
					Webdesigner Wien • Webentwicklung Korneuburg • Website erstellen lassen Österreich • Full
					Stack Developer Niederösterreich
				</p>
			</div>
		</div>

		<!-- Bottom Bar -->
		<div
			class="mt-14 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
			style="border-top: 1px solid var(--border-secondary);"
		>
			<p class="text-sm" style="color: var(--text-tertiary);">
				© {currentYear} Matthias Bigl. {m["footer.copyright"]()}
			</p>
			<div class="flex space-x-6 text-xs" style="color: var(--text-tertiary);">
				<a href={localizeHref("/impressum")} class="hover:text-gray-300 transition-colors duration-300"
					>{m["footer.imprint"]()}</a
				>
				<a href={localizeHref("/datenschutz")} class="hover:text-gray-300 transition-colors duration-300"
					>{m["footer.privacy"]()}</a
				>
				<a href="/humans.txt" class="hover:text-gray-300 transition-colors duration-300"
					>humans.txt</a
				>
				<a href="/sitemap.xml" class="hover:text-gray-300 transition-colors duration-300">Sitemap</a
				>
			</div>
		</div>
	</div>
</footer>
