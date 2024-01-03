import { Box, Grid } from '@mui/material';
import EventBox from './eventBox';
import { Schedules, ScheduleEvent } from './scheduleMain';
import { isSameDay } from 'date-fns';

import './daySchedule.scss';
export const timeHeight = 50;

let draggingStartPos = 0;
let draggingEndPos = 0;
let isMouseDown = false;

const hoursToDisplay = [...Array(25)]; // [1, 2, 3, 11, 12, 13, 14, 15, 16, 17];
const gridHoursToDisplay = hoursToDisplay.map((hour, index) => {
    if (hour === undefined) hour = index;
    return (
        <>
            <Grid item sx={{ height: timeHeight, overflow: 'hidden' }}>
                {hour > 12 ? hour - 12 : hour == 0 ? 12 : hour} {hour >= 12 ? 'P' : 'A'}M{' '}
                <Box sx={{ height: 2, backgroundColor: 'grey', position: 'relative', top: -12, left: 60 }}></Box>
            </Grid>
        </>
    );
});

export default function DaySchedule(props: {
    schedules: Schedules;
    displayDate: Date;
    timeBarTime: Date;
    onClickSchedule: (clickEvent: any, scheduleDate: Date, clickDate: Date) => void;
}) {
    // TODO: Make this work frfr no cap
    const eventsForDisplayDate = props.schedules[0].scheduleEvents
        // Will this actually work??
        // .flatMap((schedule: Schedule) => {
        //    return schedule.scheduleEvents;
        //})
        .filter((event: ScheduleEvent) => {
            return isSameDay(event.startDate, props.displayDate);
        });

    return (
        <>
            <Box className="dayScheduleRoot">
                <Grid container spacing={0} columns={4} rowSpacing={2}>
                    <Grid item xs={1}>
                        <Grid container direction="column" spacing={0} rowSpacing={2}>
                            {gridHoursToDisplay}
                        </Grid>
                    </Grid>
                    <Grid
                        id="scheduleClickAddEventArea"
                        item
                        xs={3}
                        sx={{ position: 'relative' }}
                        onClick={async (clickEvent: any) => {
                            if (clickEvent.target.id !== 'scheduleClickAddEventArea') return;
                            const clickPos = clickEvent.offsetY;
                            const time = (clickPos - 28) / timeHeight;
                            const hours = Math.floor(time);
                            const minutes = (time - hours) * 60;

                            const clickDate = new Date(
                                props.displayDate.getFullYear(),
                                props.displayDate.getMonth(),
                                props.displayDate.getDate(),
                                hours,
                                minutes
                            );

                            return props.onClickSchedule(clickEvent, props.displayDate, clickDate);
                        }}
                    >
                        <Box
                            sx={{
                                top: () => {
                                    const time = props.timeBarTime;
                                    const value = 12 + timeHeight * (time.getHours() + time.getMinutes() / 60);
                                    return value;
                                },
                                height: 0,
                                position: 'relative',
                                backgroundColor: 'red',
                                blockSize: 2,
                                zIndex: 2,
                            }}
                        ></Box>
                        {eventsForDisplayDate.map((event: ScheduleEvent, index: number) => {
                            return <EventBox event={event} key={index} />;
                        })}
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}
