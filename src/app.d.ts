/// <reference types="@sveltejs/enhanced-img" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			lang: 'de' | 'en' | 'cs';
		}
		interface PageData {
			lang?: 'de' | 'en' | 'cs';
		}
		// interface PageState {}
		// interface Platform {}
	}

	interface ImportMetaEnv {
		EMAILJS_SERVICE_ID?: string;
		EMAILJS_TEMPLATE_ID?: string;
		EMAILJS_PUBLIC_KEY?: string;
		EMAILJS_PRIVATE_KEY?: string;
	}
}

export {};
