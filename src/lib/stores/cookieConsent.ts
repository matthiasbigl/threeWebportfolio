import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export type ConsentStatus = 'pending' | 'accepted' | 'rejected';

interface CookieConsent {
	analytics: boolean;
	timestamp: number | null;
}

const STORAGE_KEY = 'cookie-consent';

function createConsentStore() {
	const getInitialValue = (): CookieConsent => {
		if (!browser) return { analytics: false, timestamp: null };
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			try {
				return JSON.parse(stored);
			} catch {
				return { analytics: false, timestamp: null };
			}
		}
		return { analytics: false, timestamp: null };
	};

	const { subscribe, set, update } = writable<CookieConsent>(getInitialValue());

	return {
		subscribe,
		accept: () => {
			const value: CookieConsent = { analytics: true, timestamp: Date.now() };
			if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
			set(value);
		},
		reject: () => {
			const value: CookieConsent = { analytics: false, timestamp: Date.now() };
			if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
			set(value);
		},
		reset: () => {
			if (browser) localStorage.removeItem(STORAGE_KEY);
			set({ analytics: false, timestamp: null });
		}
	};
}

export const cookieConsent = createConsentStore();

export function getConsentStatus(): ConsentStatus {
	let consent: CookieConsent = { analytics: false, timestamp: null };
	cookieConsent.subscribe((v) => (consent = v))();
	if (consent.timestamp === null) return 'pending';
	return consent.analytics ? 'accepted' : 'rejected';
}
