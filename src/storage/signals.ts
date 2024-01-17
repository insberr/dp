import { effect, signal } from '@preact/signals';
import { SchedulesViewMode } from '../pages/schedule/scheduleMain';
import { persist } from './persistSignal';
import { dateForDisplay } from './dateForDisplay';

export const defferedInstallPrompt = signal<Event | null>(null);
export const timeHeightSignal = signal<number>(45);
export const viewModeSignal = persist<SchedulesViewMode>('viewMode', 'v1-beta', 0);
