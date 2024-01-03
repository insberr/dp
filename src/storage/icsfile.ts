import { persistJSON } from './persistSignal';
import { schedulesSignal } from './scheduleSignal';
import ICSParser from '../utilities/ICSParser';
import { effect } from '@preact/signals';
import { EventCreatedFrom, ScheduleEvent } from '../pages/schedule/scheduleMain';

export type IcsFileSignalType = {
    data: string | null;
};
export const icsFileSignal = persistJSON<IcsFileSignalType>('icsFile', { data: null });

effect(() => {
    if (icsFileSignal.value.data === null) {
        return;
    }

    const _schedule = ICSParser(icsFileSignal.value.data);

    schedulesSignal.value = _schedule.map((event: any): ScheduleEvent => {
        return {
            uid: event.uid,
            title: event.summary,
            startDate: event.dtstart.toJSDate(),
            endDate: event.dtend.toJSDate(),
            description: event.description,
            location: event.location,
        };
    });
});
