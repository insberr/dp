import { Schedules, ScheduleCreatedFrom, ScheduleEvent, Schedule } from '../pages/schedule/scheduleMain';
import { persist } from './persistSignal';

export type SchedulesSignal = {
    schedules: Schedules;
    updated: boolean;
};

export const schedulesSignal = persist<SchedulesSignal>('schedules', blankSchedulesSignal());

export function blankSchedulesSignal(): SchedulesSignal {
    const value = {
        updated: true,
        schedules: [],
    };

    return value;
}

export function tellSchedulesSignalUpdated() {
    // TODO: Probably should error
    if (schedulesSignal.value === null) return;
    schedulesSignal.value = { ...schedulesSignal.value, updated: true };
}

export function generateUID() {
    return Math.random().toString(36);
}

export function createEvent(scheduleUID: string, event: ScheduleEvent) {
    // TODO: How would this ever be null? We should probably return an error if it is.
    if (schedulesSignal.value === null) return;

    const schedule = schedulesSignal.value?.schedules.find((scheduleFindValue) => scheduleFindValue.uid === scheduleUID);
    // TODO: Maybe we should return error and promt user to create a calendar?
    if (!schedule) return;

    schedule.scheduleEvents.push(event);

    tellSchedulesSignalUpdated();
}

export function deleteEvent(event: ScheduleEvent) {
    // TODO: How would this ever be null? We should probably return an error if it is.
    if (schedulesSignal.value === null) return;

    const schedule = schedulesSignal.value.schedules.find((scheduleFindValue) => scheduleFindValue.uid === event.parentScheduleUid);

    // What...
    if (!schedule) return;

    // Remove event
    schedule.scheduleEvents = schedule.scheduleEvents.filter((eventFilter) => eventFilter.uid !== event.uid);
    tellSchedulesSignalUpdated();
}

export function createSchedule(createdFrom: ScheduleCreatedFrom, name: string, borderColor?: string, backgroundColor?: string, opacity?: number) {
    // TODO: Error
    if (schedulesSignal.value === null) {
        schedulesSignal.value = { schedules: [], updated: true };
    }

    schedulesSignal.value.schedules.push({
        uid: generateUID(),
        createdFrom: createdFrom,
        name: name,
        scheduleEvents: [],

        defaultBackgroundColor: backgroundColor || 'color.primary',
        defaultBorderColor: borderColor || 'color.primary',
        defaultOpacity: opacity || 1,
    });

    tellSchedulesSignalUpdated();
}

export function createScheduleAdvanced(schedule: Schedule) {
    // TODO: Error
    if (schedulesSignal.value === null) {
        schedulesSignal.value = { schedules: [], updated: true };
    }

    schedulesSignal.value.schedules.push(schedule);

    tellSchedulesSignalUpdated();
}

window.createSchedule = createSchedule;
