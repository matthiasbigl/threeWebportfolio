<script lang="ts">
	import { onMount } from 'svelte';
	import { cookieConsent, getConsentStatus, type ConsentStatus } from '$lib/stores/cookieConsent';
	import * as m from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime.js';

	interface Props {
		className?: string;
	}

	let { className = '' }: Props = $props();

	let status = $state<ConsentStatus>('pending');
	let visible = $state(false);
	let dismissed = $state(false);

	onMount(() => {
		status = getConsentStatus();
		if (status === 'pending') {
			setTimeout(() => {
				visible = true;
			}, 1000);
		}
	});

	function handleAccept() {
		cookieConsent.accept();
		status = 'accepted';
		visible = false;
		dismissed = true;
	}

	function handleReject() {
		cookieConsent.reject();
		status = 'rejected';
		visible = false;
		dismissed = true;
	}
</script>

{#if visible && !dismissed}
	<div class="cookie-wrapper {className}">
		<div
			class="cookie-banner glass-card"
			role="dialog"
			aria-label={m["cookies.bannerAria"]() || 'Cookie consent'}
			aria-describedby="cookie-description"
		>
			<p id="cookie-description" class="cookie-text">
				{m["cookies.message"]()}
				<a href={localizeHref("/datenschutz")} class="cookie-link">{m["cookies.learnMore"]()}</a>
			</p>
			<div class="cookie-buttons">
				<button
					type="button"
					class="cookie-btn cookie-btn-secondary"
					onclick={handleReject}
					aria-label={m["cookies.reject"]()}
				>
					{m["cookies.reject"]()}
				</button>
				<button
					type="button"
					class="cookie-btn cookie-btn-primary"
					onclick={handleAccept}
					aria-label={m["cookies.accept"]()}
				>
					{m["cookies.accept"]()}
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.cookie-wrapper {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 9999;
		display: flex;
		justify-content: center;
		padding: 1rem 1rem 1.25rem;
		pointer-events: none;
		animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.cookie-banner {
		pointer-events: auto;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 0.75rem 1.25rem;
		max-width: 52rem;
		width: 100%;
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(100%);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.cookie-text {
		font-size: 0.875rem;
		color: var(--text-secondary);
		margin: 0;
		flex: 1;
		min-width: 200px;
	}

	.cookie-link {
		color: var(--text-primary);
		text-decoration: underline;
		text-underline-offset: 2px;
		transition: color 0.2s ease;
	}

	.cookie-link:hover {
		color: #0072ff;
	}

	.cookie-buttons {
		display: flex;
		gap: 0.5rem;
		flex-shrink: 0;
	}

	.cookie-btn {
		font-size: 0.875rem;
		font-weight: 500;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		border: 1px solid var(--glass-border);
		cursor: pointer;
		transition: all 0.2s ease;
		white-space: nowrap;
	}

	.cookie-btn-secondary {
		background: transparent;
		color: var(--text-secondary);
	}

	.cookie-btn-secondary:hover {
		background: var(--bg-surface-hover);
		color: var(--text-primary);
	}

	.cookie-btn-primary {
		background: linear-gradient(135deg, #0072ff 0%, #00c6ff 100%);
		color: white;
		border: none;
		box-shadow: 0 2px 8px rgba(0, 114, 255, 0.25);
	}

	.cookie-btn-primary:hover {
		box-shadow: 0 4px 12px rgba(0, 114, 255, 0.35);
		transform: translateY(-1px);
	}

	@media (max-width: 480px) {
		.cookie-wrapper {
			padding: 0.75rem;
		}

		.cookie-banner {
			flex-direction: column;
			text-align: center;
			padding: 0.75rem 1rem;
		}

		.cookie-text {
			text-align: center;
		}

		.cookie-buttons {
			width: 100%;
			justify-content: center;
		}

		.cookie-btn {
			flex: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.cookie-wrapper {
			animation: none;
		}

		.cookie-btn-primary:hover {
			transform: none;
		}
	}
</style>
