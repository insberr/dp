import { signal } from '@preact/signals';

export const defferedInstallPrompt = signal<Event | null>(null);
