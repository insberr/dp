import { Box, Grid } from '@mui/material';
import EventBox from './eventBox';
import { ScheduleEvent, Schedule } from '../scheduleMain';
import { isBefore, isSameDay, set } from 'date-fns';

import './daySchedule.scss';
import { schedulesSignal } from '../../../storage/scheduleSignal';
import { timeHeightSignal } from '../../../storage/signals';
import { useState } from 'preact/hooks';
import ScheduleClickAddEventArea from './ScheduleClickAddEventArea';

const hoursToDisplay = [...Array(25)]; // [1, 2, 3, 11, 12, 13, 14, 15, 16, 17];

export default function DaySchedule(props: {
    displayDate: Date;
    timeBarTime: Date;
    onClickSchedule: (clickEvent: any, startDate: Date, endDate?: Date) => void;
    onDraggingSchedule: (startDate: Date, endDate: Date) => ScheduleEvent;
}) {
    if (schedulesSignal.value === null) return <>HOW</>;

    // TODO: Make this work frfr no cap
    const eventsForDisplayDate = schedulesSignal.value.schedules
        // Will this actually work??
        .flatMap((schedule: Schedule) => {
            return schedule.scheduleEvents;
        })
        .filter((event: ScheduleEvent) => {
            return isSameDay(event.startDate, props.displayDate);
        });

    return (
        <>
            <Box className="dayScheduleRoot">
                <Grid container spacing={0} columns={4} rowSpacing={2}>
                    <Grid item xs={1}>
                        <Grid container direction="column" spacing={0} rowSpacing={2}>
                            {hoursToDisplay.map((hour, index) => {
                                if (hour === undefined) hour = index;
                                return (
                                    <>
                                        <Grid item sx={{ height: timeHeightSignal.value, overflow: 'hidden' }}>
                                            {hour > 12 ? hour - 12 : hour == 0 ? 12 : hour} {hour >= 12 ? 'P' : 'A'}M{' '}
                                            <Box sx={{ height: 2, backgroundColor: 'grey', position: 'relative', top: -12, left: 60 }}></Box>
                                        </Grid>
                                    </>
                                );
                            })}
                        </Grid>
                    </Grid>
                    <Grid item xs={3} sx={{ position: 'relative' }}>
                        <ScheduleClickAddEventArea
                            displayDate={props.displayDate}
                            onClickSchedule={props.onClickSchedule}
                            onDraggingSchedule={props.onDraggingSchedule}
                        />
                        <Box
                            sx={{
                                top: () => {
                                    const time = props.timeBarTime;
                                    const value = 12 + timeHeightSignal.value * (time.getHours() + time.getMinutes() / 60);
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
