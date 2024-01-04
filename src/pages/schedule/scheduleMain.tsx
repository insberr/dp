import { currentDate, dateForDisplay } from '../../storage/dateForDisplay';
import InputFileUpload from '../../components/InputFileUpload';
import DaySchedule from './DaySchedule/daySchedule';
import { Button } from '@mui/material';
import CalendarMenuBar from './CalendarMenuBar';

import { blankSchedulesSignal, createEvent, createScheduleAdvanced, generateUID, schedulesSignal } from '../../storage/scheduleSignal';
import WeekSchedule from './WeekSchedule/WeekSchedule';
import { useState } from 'preact/hooks';

export enum ScheduleCreatedFrom {
    ICS_FILE,
    USER,
    DEFAULT,
}

export type ScheduleEvent = {
    parentScheduleUid: string;
    uid: string;
    title: string;
    startDate: Date;
    endDate: Date;
    description: string;
    location: string;

    borderColor?: string;
    backgroundColor?: string;
    opacity?: number;

    allowOverlap?: boolean;
};

export type Schedule = {
    createdFrom: ScheduleCreatedFrom;
    uid: string;
    name: string;
    scheduleEvents: ScheduleEvent[];

    // customizations for later?
    defaultBackgroundColor?: string;
    defaultBorderColor?: string;
    defaultOpacity?: number;
};

export type Schedules = Schedule[];

export enum SchedulesViewMode {
    DAY,
    WEEK,
    MONTH,
}

export default function ScheduleMain() {
    if (schedulesSignal.value === null) schedulesSignal.value = blankSchedulesSignal();

    if (schedulesSignal.value.schedules.length === 0) {
        return (
            <div>
                <div>Upload ICS file, which can be downloaded from Self Service in the schedule section.</div>
                <InputFileUpload />
                <Button
                    variant="contained"
                    onClick={() => {
                        createScheduleAdvanced({
                            createdFrom: ScheduleCreatedFrom.DEFAULT,
                            uid: generateUID(),
                            name: 'Main Schedule',
                            scheduleEvents: [],

                            defaultBackgroundColor: 'salmon',
                            defaultBorderColor: 'salmon',
                            defaultOpacity: 1,
                        });
                    }}
                >
                    Continue Without Upload
                </Button>
            </div>
        );
    }

    const [viewMode, viewModeSet] = useState(SchedulesViewMode.DAY);

    // schedule.value = schedule.value.push(fakeEvent);
    const onClickScheduleHandler = (clickEvent: any, startDate: Date, endDate?: Date) => {
        createEvent(schedulesSignal.value.schedules[0].uid, {
            parentScheduleUid: schedulesSignal.value.schedules[0].uid,
            uid: generateUID(),
            title: 'New Event',
            startDate: startDate,
            endDate: endDate || new Date(startDate.getTime() + 30 * 60000),
            description: 'Test Click Schedule To Create Event',
            location: 'Location: MAIN, Building:RB1, Room:MCHLNGLO',

            opacity: 0.5,
        });
        // schedulesTemp[0].scheduleEvents.push();
        // schedulesSignal.value = { updated: true, schedules: schedulesTemp };
        // schedulesSignal.store();
    };

    const onDraggingSchedule = (startDate: Date, endDate: Date): ScheduleEvent => {
        const newEvent: ScheduleEvent = {
            parentScheduleUid: 'temporary_event_dragging',
            uid: generateUID(),
            title: 'New Event',
            startDate: startDate,
            endDate: endDate,
            description: '',
            location: '',
        };

        return newEvent;
    };

    return (
        <>
            <CalendarMenuBar viewMode={viewMode} viewModeSet={viewModeSet} />
            {viewMode === SchedulesViewMode.DAY ? (
                <DaySchedule
                    displayDate={dateForDisplay.value}
                    timeBarTime={currentDate.value}
                    onClickSchedule={onClickScheduleHandler}
                    onDraggingSchedule={onDraggingSchedule}
                />
            ) : (
                <WeekSchedule
                    displayDate={dateForDisplay.value}
                    timeBarTime={currentDate.value}
                    onClickSchedule={onClickScheduleHandler}
                    onDraggingSchedule={onDraggingSchedule}
                />
            )}
        </>
    );
}
