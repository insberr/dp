import { currentDate, dateForDisplay } from '../../storage/dateForDisplay';
import InputFileUpload from '../../components/InputFileUpload';
import DaySchedule from './daySchedule';
import { Button } from '@mui/material';
import CalendarMenuBar from './CalendarMenuBar';

import { schedulesSignal } from '../../storage/scheduleSignal';

export enum EventCreatedFrom {
    ICS_FILE,
    USER,
    DEFAULT,
}

export type ScheduleEvent = {
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
    createdFrom: EventCreatedFrom;
    uid: string;
    name: string;
    scheduleEvents: ScheduleEvent[];

    // customizations for later?
    defaultBackgroundColor?: string;
    defaultBorderColor?: string;
    defaultOpacity?: number;
};

export type Schedules = Schedule[];

export default function ScheduleMain() {
    if (schedulesSignal.value === null) {
        return (
            <div>
                <div>Upload ICS file, which can be downloaded from Self Service in the schedule section.</div>
                <InputFileUpload />
                <Button
                    variant="contained"
                    onClick={() => {
                        schedulesSignal.value = [
                            {
                                createdFrom: EventCreatedFrom.DEFAULT,
                                uid: 'default_schedule',
                                name: 'Default Schedule',
                                scheduleEvents: [],
                            },
                        ];
                    }}
                >
                    Continue Without Upload
                </Button>
            </div>
        );
    }

    // schedule.value = schedule.value.push(fakeEvent);
    const onClickScheduleHandler = (clickEvent: any, scheduleDate: Date, clickDate: Date) => {
        const schedulesTemp = schedulesSignal.value || [];

        schedulesTemp[0].scheduleEvents.push({
            uid: 'newEvent',
            title: 'New Event',
            startDate: clickDate,
            endDate: new Date(clickDate.getTime() + 30 * 60000),
            description: 'Test Click Schedule To Create Event',
            location: 'Location: MAIN, Building:RB1, Room:MCHLNGLO',

            backgroundColor: 'salmon',
            borderColor: 'red',
            opacity: 1,
        });

        schedulesSignal.value = schedulesTemp;
        schedulesSignal.store();
    };

    return (
        <>
            <CalendarMenuBar />
            <DaySchedule
                schedules={schedulesSignal.value}
                displayDate={dateForDisplay.value}
                timeBarTime={currentDate.value}
                onClickSchedule={onClickScheduleHandler}
            />
        </>
    );
}
