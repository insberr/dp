import { signal } from '@preact/signals';

export const defferedInstallPrompt = signal<Event | null>(null);
export const timeHeightSignal = signal<number>(50);
