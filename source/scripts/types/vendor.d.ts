declare module NodeJS  {
	interface Global {
		tinymce: any
	}
}

// Add IE-specific interfaces to Window
interface Window {
	attachEvent(event: string, listener: EventListener): boolean;
	detachEvent(event: string, listener: EventListener): void;
}
