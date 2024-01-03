import { Schedules, EventCreatedFrom } from '../pages/schedule/scheduleMain';
import { persist } from './persistSignal';

export const schedulesSignal = persist<Schedules | null>('schedules', null);
