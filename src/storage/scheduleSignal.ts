import { effect } from '@preact/signals';
import { Schedules, ScheduleCreatedFrom, ScheduleEvent, Schedule, ScheduleRepeatType } from '../pages/schedule/scheduleMain';
import { persist } from './persistSignal';

export type SchedulesSignal = {
    schedules: Schedules;
    updated: boolean;
};

export const schedulesSignal = persist<SchedulesSignal>('schedules', 'v1-beta0.2', blankSchedulesSignal(), (versionInStorage, data) => {
    if (versionInStorage === undefined) {
        // Before versioning
        // Also before schedules had a repeatWeekly property
        const schedulesUpdated = data.schedules.map((schedule) => {
            schedule.repeatWeekly = false;
            return schedule;
        });

        data.schedules = schedulesUpdated;

        return data;
    } else if (versionInStorage === 'v1-beta0.1') {
        // Update schedules to have new repeat property
        const schedulesUpdated = data.schedules.map((schedule) => {
            schedule.repeat = {
                type: 0,
            };

            if (schedule.repeatWeekly) {
                schedule.repeat.type = ScheduleRepeatType.WEEKLY;
                delete schedule.repeatWeekly;
            }

            return schedule;
        });
    }

    return data;
});

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

export function createEvent(scheduleUID: string, event: ScheduleEvent): ScheduleEvent | null {
    // TODO: How would this ever be null? We should probably return an error if it is.
    if (schedulesSignal.value === null) return null;

    const schedule = schedulesSignal.value?.schedules.find((scheduleFindValue) => scheduleFindValue.uid === scheduleUID);
    // TODO: Maybe we should return error and promt user to create a calendar?
    if (!schedule) return null;

    // Make sure we set the parentScheduleUid to the schedule we are adding it to LOL
    event.parentScheduleUid = scheduleUID;

    schedule.scheduleEvents.push(event);

    tellSchedulesSignalUpdated();

    return event;
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

export function editEvent(current: ScheduleEvent, newEvent: ScheduleEvent) {
    const scheduleIndex = schedulesSignal.value.schedules.findIndex((scheduleFindValue) => scheduleFindValue.uid === current.parentScheduleUid);
    if (scheduleIndex === -1) return;
    const eventIndex = schedulesSignal.value.schedules[scheduleIndex].scheduleEvents.findIndex((eventFilter) => eventFilter.uid === current.uid);
    if (eventIndex === -1) return;

    schedulesSignal.value.schedules[scheduleIndex].scheduleEvents[eventIndex] = newEvent;

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
        repeat: {
            type: ScheduleRepeatType.NONE,
        },

        defaultBackgroundColor: backgroundColor || '#000000',
        defaultBorderColor: borderColor || '#000000',
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

export function editSchedule(current: Schedule, newSchedule: Schedule) {
    const index = schedulesSignal.value.schedules.findIndex((scheduleFindValue) => scheduleFindValue.uid === current.uid);
    if (index === -1) return;

    schedulesSignal.value.schedules[index] = newSchedule;

    tellSchedulesSignalUpdated();
}

export function getEvent(eventUID: string, scheduleUID: string): ScheduleEvent | null {
    // if (scheduleUID) {
    const schedule = schedulesSignal.value.schedules.find((scheduleFindValue) => scheduleFindValue.uid === scheduleUID);
    if (!schedule) return null;
    const event = schedule.scheduleEvents.find((event) => event.uid === eventUID);
    if (!event) return null;
    return event;
    // }

    // const event = schedulesSignal.value.schedules.map(scheduleFindValue => {
    //     const event = scheduleFindValue.scheduleEvents.find((event) => event.uid === eventUID);
    //     if (event) return event;
    //     return null;
    // }).filter(event => event !== null)[0];

    // if (!event) return null;
    // return event;
}

// window.createSchedule = createSchedule;
