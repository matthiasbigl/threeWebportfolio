<script lang="ts">
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
            href: 'https://bigls-blog.vercel.app',
            icon: 'M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z'
        }
    ];

    const quickLinks = [
        { name: 'Home', href: '/' },
        { name: 'Contact', href: '/contact' },
        { name: 'Blog', href: 'https://bigls-blog.vercel.app' }
    ];
</script>

<footer class="relative z-10 border-t border-white/10 bg-gradient-to-b from-transparent to-black/30">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <!-- Brand Section -->
            <div class="space-y-4">
                <h3 class="text-2xl font-bold">
                    <span class="blue-gradient_text">Matthias Bigl</span>
                </h3>
                <p class="text-gray-400 text-sm leading-relaxed">
                    Full Stack Developer & Designer from Austria. 
                    Passionate about creating innovative web experiences with modern technologies.
                </p>
                <p class="text-gray-500 text-xs">
                    📍 Korneuburg, Austria
                </p>
            </div>

            <!-- Quick Links -->
            <div class="space-y-4">
                <h4 class="text-lg font-semibold text-white">Quick Links</h4>
                <nav class="flex flex-col space-y-2" aria-label="Footer navigation">
                    {#each quickLinks as link}
                        <a 
                            href={link.href}
                            class="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                            target={link.href.startsWith('http') ? '_blank' : undefined}
                            rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        >
                            {link.name}
                        </a>
                    {/each}
                </nav>
            </div>

            <!-- Social & Contact -->
            <div class="space-y-4">
                <h4 class="text-lg font-semibold text-white">Connect</h4>
                <div class="flex space-x-4">
                    {#each socialLinks as social}
                        <a 
                            href={social.href}
                            class="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all hover:scale-110"
                            target="_blank"
                            rel="noopener noreferrer me"
                            aria-label={social.name}
                            title={social.name}
                        >
                            <svg class="w-5 h-5 text-gray-400 hover:text-blue-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                <path d={social.icon} />
                            </svg>
                        </a>
                    {/each}
                </div>
                <p class="text-gray-500 text-sm">
                    <a href="mailto:biglmatthias@gmail.com" class="hover:text-blue-400 transition-colors">
                        biglmatthias@gmail.com
                    </a>
                </p>
            </div>
        </div>

        <!-- Bottom Bar -->
        <div class="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p class="text-gray-500 text-sm">
                © {currentYear} Matthias Bigl. All rights reserved.
            </p>
            <div class="flex space-x-6 text-xs text-gray-600">
                <a href="/humans.txt" class="hover:text-gray-400 transition-colors">humans.txt</a>
                <a href="/sitemap.xml" class="hover:text-gray-400 transition-colors">Sitemap</a>
            </div>
        </div>
    </div>
</footer>
