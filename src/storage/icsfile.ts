import { persist } from './persistSignal';

export const icsFileSignal = persist<string | null>('icsFile', null);
