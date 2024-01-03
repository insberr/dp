import ChangeDateButtons from './changeDateButtons';
import { currentDate, dateForDisplay } from '../../storage/dateForDisplay';
import InputFileUpload from '../../components/InputFileUpload';
import DaySchedule from './daySchedule';
import { schedulesSignal } from '../../storage/scheduleSignal';
import { Button } from '@mui/material';

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
                        schedulesSignal.value = [];
                    }}
                >
                    Continue Without Upload
                </Button>
            </div>
        );
    }

    const fakeEvent = {
        summary: 'Fake Event',
        location: 'Location: MAIN, Building:RB1, Room:MCHLNGLO',
        dtstart: {
            toJSDate: () => {
                return new Date('January 8, 2024 2:00:00');
            },
        },
        dtend: {
            toJSDate: () => {
                return new Date('January 8, 2024 2:30:00');
            },
        },
    };

    // schedule.value = schedule.value.push(fakeEvent);

    return (
        <>
            <ChangeDateButtons />
            <DaySchedule schedules={schedulesSignal.value} displayDate={dateForDisplay.value} timeBarTime={currentDate.value} />
        </>
    );
}
