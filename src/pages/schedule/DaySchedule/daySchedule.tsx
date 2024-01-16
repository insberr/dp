import { Box, Grid, Typography } from '@mui/material';
import EventBox from './eventBox';
import { ScheduleEvent, Schedule, ScheduleEventRepeat } from '../scheduleMain';
import {
    isSameDay,
    differenceInWeeks,
    addWeeks,
    subWeeks,
    startOfDay,
    isWithinInterval,
    setSeconds,
    setMinutes,
    setHours,
    differenceInMinutes,
} from 'date-fns';

import './daySchedule.scss';
import { schedulesSignal } from '../../../storage/scheduleSignal';
import { timeHeightSignal } from '../../../storage/signals';
import ScheduleClickAddEventArea from './ScheduleClickAddEventArea';

const hoursToDisplay = [...Array(24)]; // [1, 2, 3, 11, 12, 13, 14, 15, 16, 17];

export interface ScheduleEventExtraInfo extends ScheduleEvent {
    isParentScheduleRepeatedWeekly?: boolean;
    isContinuedFromPreviousDay?: boolean;
    display_startDate?: Date;
    display_endDate?: Date;
}

export default function DaySchedule(props: {
    displayDate: Date;
    timeBarTime: Date;
    onClickEvent: (clickedEvent: ScheduleEventExtraInfo) => void;
    onClickSchedule: (clickEvent: any, startDate: Date, endDate?: Date) => void;
    onDraggingSchedule: (startDate: Date, endDate: Date) => ScheduleEvent;
    showSideBoarders?: boolean;
    hideTimeBar?: boolean;
    hidetimes?: boolean;
}) {
    // TODO: Make this work frfr no cap
    // const eventsForDisplayDate =
    // console.log(eventsForDisplayDate);
    const eventsForDisplay = schedulesSignal.value.schedules
        .map((schedule: Schedule) => {
            if (schedule.repeatWeekly) {
                const events = schedule.scheduleEvents.filter((eventTemp) => {
                    const event = eventTemp as ScheduleEventExtraInfo;

                    let skipDates =
                        (event.repeat as ScheduleEventRepeat)?.skipDates.filter((date) => {
                            return isSameDay(date, props.displayDate);
                        }) || [];
                    if (skipDates.length > 0) return false;

                    if (isSameDay(event.startDate, props.displayDate)) {
                        event.isParentScheduleRepeatedWeekly = true;
                        return true;
                    }

                    const d = differenceInWeeks(startOfDay(props.displayDate), startOfDay(event.startDate));
                    // console.log(d);
                    const addedWeeksStart = d >= 0 ? addWeeks(event.startDate, d) : subWeeks(event.startDate, Math.abs(d));
                    const addedWeeksEnd = d >= 0 ? addWeeks(event.endDate, d) : subWeeks(event.endDate, Math.abs(d));

                    skipDates =
                        (event.repeat as ScheduleEventRepeat)?.skipDates.filter((date) => {
                            return isSameDay(date, addedWeeksStart);
                        }) || [];
                    if (skipDates.length > 0) {
                        return false;
                    }

                    if (isSameDay(addedWeeksStart, props.displayDate)) {
                        event.isParentScheduleRepeatedWeekly = true;
                        event.display_startDate = addedWeeksStart;
                        event.display_endDate = addedWeeksEnd;
                        return true;
                    }

                    return false;
                });

                return events;
            }

            return schedule.scheduleEvents.filter((event: ScheduleEventExtraInfo) => {
                const isStartSameDay = isWithinInterval(event.startDate, {
                    start: setSeconds(setMinutes(setHours(new Date(props.displayDate), 0), 0), 0),
                    end: setSeconds(setMinutes(setHours(new Date(props.displayDate), 23), 59), 59),
                });

                const isEndSameDay = isWithinInterval(event.endDate, {
                    start: setSeconds(setMinutes(setHours(new Date(props.displayDate), 0), 0), 0),
                    end: setSeconds(setMinutes(setHours(new Date(props.displayDate), 23), 59), 59),
                });

                const isDisplayDateBetweenStartAndEnd = isWithinInterval(props.displayDate, {
                    start: event.startDate,
                    end: event.endDate,
                });

                if (isStartSameDay && isEndSameDay) return true;

                if (isStartSameDay) {
                    event.isContinuedFromPreviousDay = false;
                    event.display_startDate = event.startDate;
                    event.display_endDate = setSeconds(setMinutes(setHours(new Date(props.displayDate), 23), 59), 59);
                    return true;
                }

                if (isEndSameDay) {
                    event.isContinuedFromPreviousDay = true;
                    event.display_startDate = setSeconds(setMinutes(setHours(new Date(props.displayDate), 0), 0), 0);
                    event.display_endDate = event.endDate;
                    return true;
                }

                if (isDisplayDateBetweenStartAndEnd) {
                    event.isContinuedFromPreviousDay = true;
                    event.display_startDate = setSeconds(setMinutes(setHours(new Date(props.displayDate), 0), 0), 0);
                    event.display_endDate = setSeconds(setMinutes(setHours(new Date(props.displayDate), 23), 59), 59);
                    return true;
                }

                return false;

                // return isSameDay(event.startDate, props.displayDate); // || isSameDay(event.endDate, props.displayDate);
            });
        })
        .flatMap((events: ScheduleEvent[]) => {
            return events;
        })
        .sort((a: ScheduleEvent, b: ScheduleEvent) => {
            // sort by duration
            const durationMinutesA = differenceInMinutes(a.endDate, a.startDate);
            const durationMinutesB = differenceInMinutes(b.endDate, b.startDate);
            if (durationMinutesA < durationMinutesB) return 1;
            if (durationMinutesA > durationMinutesB) return -1;
            return 0;
        });

    // const eventsForDisplay = schedulesSignal.value.schedules.flatMap((schedule: Schedule) => {
    //     return schedule.scheduleEvents.filter((event: ScheduleEvent) => {
    //         return isSameDay(event.startDate, props.displayDate);
    //     });
    // });

    return (
        <>
            <Box className={'dayScheduleRoot' + (props.showSideBoarders ? '' : ' noSideBorders')}>
                <Grid
                    container
                    spacing={0}
                    columns={10}
                    rowSpacing={2}
                    sx={{
                        marginTop: 0,
                        '& .MuiGrid-item': {
                            paddingTop: 0,
                        },
                    }}
                >
                    <Grid item xs={props.hidetimes ? 0 : 1}>
                        <Grid
                            container
                            direction="column"
                            spacing={0}
                            rowSpacing={2}
                            sx={{
                                marginTop: 0,
                                '& .MuiGrid-item': {
                                    paddingTop: 0,
                                },
                            }}
                        >
                            {hoursToDisplay.map((hour, index) => {
                                if (hour === undefined) hour = index;
                                return (
                                    <>
                                        <Grid item sx={{ height: timeHeightSignal.value, overflow: 'hidden', paddingTop: 0 }}>
                                            {props.hidetimes || hour === 0 || hour === 24 ? null : (
                                                <>
                                                    <Box
                                                        sx={{
                                                            height: 2,
                                                            backgroundColor: 'grey',
                                                            opacity: '40%',
                                                            position: 'relative',
                                                            top: 0,
                                                            left: 0,
                                                        }}
                                                    ></Box>
                                                    <Typography variant="subtitle1">
                                                        {hour > 12 ? hour - 12 : hour} {hour === 0 ? 'AM' : hour === 12 ? 'PM' : ''}
                                                    </Typography>
                                                </>
                                            )}
                                        </Grid>
                                    </>
                                );
                            })}
                        </Grid>
                    </Grid>
                    <Grid
                        item
                        xs={props.hidetimes ? 10 : 9}
                        sx={{
                            position: 'relative',
                        }}
                    >
                        <Grid
                            container
                            direction="column"
                            spacing={0}
                            rowSpacing={2}
                            sx={{
                                position: 'absolute',
                                marginTop: 0,
                                '& .MuiGrid-item': {
                                    paddingTop: 0,
                                },
                            }}
                        >
                            {hoursToDisplay.map((hour, index) => {
                                if (hour === undefined) hour = index;
                                return (
                                    <>
                                        <Grid item sx={{ height: timeHeightSignal.value, overflow: 'hidden', paddingTop: 0 }}>
                                            {hour === 0 || hour === 24 ? null : (
                                                <Box
                                                    sx={{ height: 2, backgroundColor: 'grey', opacity: '40%', position: 'relative', top: 0, left: 0 }}
                                                ></Box>
                                            )}
                                        </Grid>
                                    </>
                                );
                            })}
                        </Grid>
                        <ScheduleClickAddEventArea
                            displayDate={props.displayDate}
                            onClickSchedule={props.onClickSchedule}
                            onDraggingSchedule={props.onDraggingSchedule}
                        />
                        <Box
                            id="timeBar"
                            sx={{
                                top: () => {
                                    const time = props.timeBarTime;
                                    const value = timeHeightSignal.value * (time.getHours() + time.getMinutes() / 60);
                                    return value;
                                },
                                height: 0,
                                position: 'relative',
                                backgroundColor: 'red',
                                blockSize: 2,
                                opacity: '60%',
                            }}
                            hidden={props.hideTimeBar}
                        ></Box>
                        {eventsForDisplay.map((event: ScheduleEvent, index: number) => {
                            // does this event overlap any other events that are longer than it, and how much should it be indented?
                            const howManyLongerEventsOverlap = eventsForDisplay.filter((otherEvent: ScheduleEvent) => {
                                if (event.uid === otherEvent.uid) return false;
                                if (
                                    differenceInMinutes(event.endDate, event.startDate) >
                                    differenceInMinutes(otherEvent.endDate, otherEvent.startDate)
                                )
                                    return false;
                                if (event.startDate.getTime() === otherEvent.startDate.getTime()) return false;
                                if (event.endDate.getTime() === otherEvent.endDate.getTime()) return false;
                                if (event.startDate.getTime() > otherEvent.endDate.getTime()) return false;
                                if (event.endDate.getTime() < otherEvent.startDate.getTime()) return false;
                                return true;
                            }).length;

                            return <EventBox overlap={howManyLongerEventsOverlap} onClick={props.onClickEvent} event={event} key={index} />;
                        })}
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}
