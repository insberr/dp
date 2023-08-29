import { persistJSON } from './persistSignal';

export type IcsFileSignalType = {
    data: string | null;
};
export const icsFileSignal = persistJSON<IcsFileSignalType>('icsFile', { data: null });
