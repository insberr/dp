import { Box } from '@mui/material';
import { convertLocationToObject } from '../../../utilities/ICSParser';
import { differenceInMinutes, format } from 'date-fns';
import { useState } from 'preact/hooks';
import { ScheduleEvent } from '../scheduleMain';

import './daySchedule.scss';
import { schedulesSignal } from '../../../storage/scheduleSignal';
import { timeHeightSignal } from '../../../storage/signals';

export type EventBoxProps = {
    onClick: (event: ScheduleEvent) => void;
    event: ScheduleEvent;
    key: number | string;
    color?: string;
    opacity?: number;
    overlap?: number;
};
export default function EventBox(props: EventBoxProps) {
    const event = props.event;
    const locationObject = convertLocationToObject(event.location);
    const durationMinutes = differenceInMinutes(event.endDate, event.startDate);
    const eventID = `eventBox_${props.key}_${event.uid}_${event.startDate.getTime()}`;

    const topPosition = timeHeightSignal.value * (event.startDate.getHours() + event.startDate.getMinutes() / 60);
    const height = timeHeightSignal.value * (durationMinutes / 60);

    // Figure out colors
    const parentSchedule = schedulesSignal.value.schedules.find((schedule) => {
        return schedule.uid === event.parentScheduleUid;
    });

    const backgroundColor = props.color || event.backgroundColor || parentSchedule?.defaultBackgroundColor || 'paper.primary';
    const borderColor = props.color || event.borderColor || parentSchedule?.defaultBorderColor || 'primary.primary';
    const opacity = props.opacity || event.opacity || parentSchedule?.defaultOpacity || 1;

    return (
        <>
            <Box
                id={eventID}
                key={eventID}
                className={'eventBox'}
                sx={{
                    borderColor: borderColor,
                    backgroundColor: backgroundColor,
                    opacity: opacity,
                    top: topPosition + 'px',
                    height: height + 'px',
                    left: props.overlap ? props.overlap * 10 + '%' : '0px',
                }}
                onClick={() => {
                    props.onClick(event);
                }}
            >
                <div>
                    {event.title} {format(event.startDate, 'h:mma')} - {format(event.endDate, 'h:mma')} ({durationMinutes} minutes)
                </div>
                <div>
                    {locationObject.location} building {'('}
                    {locationObject.building}
                    {')'} in room {locationObject.room}
                </div>
            </Box>
            {/* <EditEventMenu
                event={open ? event : null}
                setEvent={(a: ScheduleEvent | null) => {
                    if (a === null) return handleClose();
                }}
            /> */}
        </>
    );
}
