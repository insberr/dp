import { currentDate, dateForDisplay } from '../../storage/dateForDisplay';
import InputFileUpload from '../../components/InputFileUpload';
import DaySchedule, { ScheduleEventExtraInfo } from './DaySchedule/daySchedule';
import { Button } from '@mui/material';
import CalendarMenuBar from './CalendarMenuBar';

import { blankSchedulesSignal, createEvent, createScheduleAdvanced, generateUID, schedulesSignal } from '../../storage/scheduleSignal';
import WeekSchedule from './WeekSchedule/WeekSchedule';
import { useState } from 'preact/hooks';
import { EditEventMenu } from './EditEventMenu';
import { EditScheduleMenu } from './EditScheduleMenu';

export enum ScheduleCreatedFrom {
    ICS_FILE,
    USER,
    DEFAULT,
}

export enum ScheduleEventRepeatType {
    DAILY,
    WEEKLY,
    MONTHLY,
    YEARLY,
    EDITED,
}

export type ScheduleEventRepeatBase = {
    type: ScheduleEventRepeatType;
};

export interface ScheduleEventRepeatEdited extends ScheduleEventRepeatBase {
    type: ScheduleEventRepeatType.EDITED;
    editedRepeatParentEventUid: string;
}

export interface ScheduleEventRepeat extends ScheduleEventRepeatBase {
    skipDates: Date[];
    endDate: Date | null;
}

export type ScheduleEvent = {
    parentScheduleUid: string;
    uid: string;

    startDate: Date;
    endDate: Date;

    fullDayEvent?: boolean; // TODO implement this

    title: string;
    description: string;
    location: string;

    /*
        NOTE: I decedide that if a repeated event is edited,
          it will be converted to its own event,
          it will have a value that says it is a repeated event with a link to the parent event,
          it will add the specific date to the skipDates array in the parent event,

        
    */
    repeat?: ScheduleEventRepeat | ScheduleEventRepeatEdited;

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

    repeatWeekly: boolean;

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
                            repeatWeekly: false,
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
    const [editEventMenu, editEventMenuSet] = useState<ScheduleEventExtraInfo | null>(null);
    const [editScheduleMenu, editScheduleMenuSet] = useState<string | null>(null);

    // schedule.value = schedule.value.push(fakeEvent);
    const onClickScheduleHandler = (clickEvent: any, startDate: Date, endDate?: Date) => {
        const newEvent = createEvent(schedulesSignal.value.schedules[0].uid, {
            parentScheduleUid: schedulesSignal.value.schedules[0].uid,
            uid: generateUID(),
            title: '',
            startDate: startDate,
            endDate: endDate || new Date(startDate.getTime() + 30 * 60000),
            description: '',
            location: 'Location: MAIN, Building:RB1, Room:NONE',
            opacity: 0.5,
        });

        if (newEvent === null) return;

        editEventMenuSet(newEvent);

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

    const onClickEventHandler = (event: ScheduleEventExtraInfo) => {
        editEventMenuSet(event);
    };

    const editScheduleHandler = (scheduleUID: string | null) => {
        editScheduleMenuSet(scheduleUID);
    };

    return (
        <>
            <CalendarMenuBar viewMode={viewMode} viewModeSet={viewModeSet} />
            {viewMode === SchedulesViewMode.DAY ? (
                <DaySchedule
                    displayDate={dateForDisplay.value}
                    timeBarTime={currentDate.value}
                    onClickEvent={onClickEventHandler}
                    onClickSchedule={onClickScheduleHandler}
                    onDraggingSchedule={onDraggingSchedule}
                    showSideBoarders={false}
                />
            ) : (
                <WeekSchedule
                    displayDate={dateForDisplay.value}
                    timeBarTime={currentDate.value}
                    onClickEvent={onClickEventHandler}
                    onClickSchedule={onClickScheduleHandler}
                    onDraggingSchedule={onDraggingSchedule}
                />
            )}
            <EditEventMenu editScheduleHandler={editScheduleHandler} event={editEventMenu} setEvent={editEventMenuSet} />
            <EditScheduleMenu schedule={editScheduleMenu} setSchedule={editScheduleMenuSet} />
        </>
    );
}
