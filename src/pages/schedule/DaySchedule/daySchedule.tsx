import { Box, Grid, Typography } from '@mui/material';
import EventBox from './eventBox';
import { ScheduleEvent, Schedule } from '../scheduleMain';
import { isBefore, isSameDay, isWithinInterval, setHours, setMinutes, setSeconds, differenceInWeeks, addWeeks, subWeeks, startOfDay } from 'date-fns';

import './daySchedule.scss';
import { editEvent, schedulesSignal } from '../../../storage/scheduleSignal';
import { timeHeightSignal } from '../../../storage/signals';
import ScheduleClickAddEventArea from './ScheduleClickAddEventArea';
import Moveable, { OnDrag, OnResize } from 'preact-moveable';
import { options } from 'preact';

const hoursToDisplay = [...Array(25)]; // [1, 2, 3, 11, 12, 13, 14, 15, 16, 17];

export default function DaySchedule(props: {
    displayDate: Date;
    timeBarTime: Date;
    onClickSchedule: (clickEvent: any, startDate: Date, endDate?: Date) => void;
    onDraggingSchedule: (startDate: Date, endDate: Date) => ScheduleEvent;
    hideTimeBar?: boolean;
    hidetimes?: boolean;
}) {
    if (schedulesSignal.value === null) return <>HOW</>;

    // TODO: Make this work frfr no cap
    const eventsForDisplayDate = schedulesSignal.value.schedules
        .map((schedule: Schedule) => {
            if (schedule.repeatWeekly) {
                const events = schedule.scheduleEvents
                    .map((event) => {
                        if (isSameDay(event.startDate, props.displayDate)) return event;

                        const d = differenceInWeeks(startOfDay(props.displayDate), startOfDay(event.startDate));
                        console.log(d);
                        const addedWeeksStart = d >= 0 ? addWeeks(event.startDate, d) : subWeeks(event.startDate, Math.abs(d));
                        const addedWeeksEnd = d >= 0 ? addWeeks(event.endDate, d) : subWeeks(event.endDate, Math.abs(d));

                        if (isSameDay(addedWeeksStart, props.displayDate)) {
                            console.log('isSameDay ', addedWeeksStart.toDateString());
                            return { ...event, startDate: addedWeeksStart, endDate: addedWeeksEnd };
                        }
                        return null;
                    })
                    .filter((event) => event !== null) as ScheduleEvent[];

                return events;
            }
            return schedule.scheduleEvents;
        })
        // Will this actually work??
        // .flatMap((schedule: Schedule) => {
        //     return schedule.scheduleEvents;
        // })
        .flatMap((events: ScheduleEvent[]) => {
            return events;
        })
        .filter((event: ScheduleEvent) => {
            return (
                isWithinInterval(event.startDate, {
                    start: setSeconds(setMinutes(setHours(props.displayDate, 0), 0), 0),
                    end: setSeconds(setMinutes(setHours(props.displayDate, 23), 59), 59),
                }) ||
                isWithinInterval(event.endDate, {
                    start: setSeconds(setMinutes(setHours(props.displayDate, 0), 0), 0),
                    end: setSeconds(setMinutes(setHours(props.displayDate, 23), 59), 59),
                })
            );
            // return isSameDay(event.startDate, props.displayDate); // || isSameDay(event.endDate, props.displayDate);
        });

    return (
        <>
            <Box className="dayScheduleRoot">
                <Grid container spacing={0} columns={4} rowSpacing={2}>
                    <Grid item xs={props.hidetimes ? 0 : 1}>
                        <Grid container direction="column" spacing={0} rowSpacing={2}>
                            {hoursToDisplay.map((hour, index) => {
                                if (hour === undefined) hour = index;
                                return (
                                    <>
                                        <Grid item sx={{ height: timeHeightSignal.value, overflow: 'hidden' }}>
                                            {props.hidetimes ? null : (
                                                <>
                                                    <Typography variant="subtitle2">
                                                        {hour > 12 ? hour - 12 : hour == 0 ? 12 : hour} {hour === 0 ? 'AM' : hour === 12 ? 'PM' : ''}
                                                    </Typography>
                                                    <Box sx={{ height: 2, backgroundColor: 'grey', position: 'relative', top: -12, left: 60 }}></Box>
                                                </>
                                            )}
                                        </Grid>
                                    </>
                                );
                            })}
                        </Grid>
                    </Grid>
                    <Grid item xs={props.hidetimes ? 4 : 3} sx={{ position: 'relative' }}>
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
                            hidden={props.hideTimeBar}
                        ></Box>
                        {eventsForDisplayDate.map((event: ScheduleEvent, index: number) => {
                            return <EventBox event={event} key={index} />;
                        })}
                    </Grid>
                    <Moveable
                        target={'.target'}
                        origin={true}
                        /* Resize, Scale event edges */
                        edge={['n', 's']}
                        /* draggable */
                        draggable={true}
                        throttleDrag={0}
                        onDragStart={({ target, clientX, clientY }) => {
                            console.log('onDragStart', target);
                        }}
                        onDrag={({ target, beforeDelta, beforeDist, left, top, right, bottom, delta, dist, transform, clientX, clientY }: OnDrag) => {
                            console.log('onDrag left, top', left, top);
                            // target!.style.left = `${left}px`;
                            // target!.style.top = `${top}px`;
                            console.log('onDrag translate', dist);
                            target!.style.transform = transform;
                        }}
                        onDragEnd={({ target, isDrag, clientX, clientY }) => {
                            console.log('onDragEnd', target, isDrag);
                        }}
                        /* When resize or scale, keeps a ratio of the width, height. */
                        keepRatio={true}
                        resizable={true}
                        onResize={({ target, width, height, dist, delta, direction, clientX, clientY }: OnResize) => {
                            if (direction[0] === 2) return;
                            target.style.height = height + 'px';
                            // const newDateForHeight = new Date(event.startDate.getTime() + (height / timeHeightSignal.value) * 60 * 60 * 1000);
                        }}
                        onResizeEnd={() => {
                            // editEvent(event, { ...event, endDate: newDateForHeight });
                        }}
                    />
                </Grid>
            </Box>
        </>
    );
}
