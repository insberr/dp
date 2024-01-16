import { Box } from '@mui/material';
import { convertLocationToObject } from '../../../utilities/ICSParser';
import { differenceInMinutes, format } from 'date-fns';
import { ScheduleEvent } from '../scheduleMain';

import './daySchedule.scss';
import { schedulesSignal } from '../../../storage/scheduleSignal';
import { timeHeightSignal } from '../../../storage/signals';
import { ScheduleEventExtraInfo } from './daySchedule';

export type EventBoxProps = {
    onClick: (event: ScheduleEventExtraInfo) => void;
    event: ScheduleEventExtraInfo;
    key: number | string;
    color?: string;
    opacity?: number;
    overlap?: number;
};
export default function EventBox(props: EventBoxProps) {
    const event = props.event;
    const startDate = event.display_startDate || event.startDate;
    const endDate = event.display_endDate || event.endDate;

    const locationObject = convertLocationToObject(event.location);
    const durationMinutes = differenceInMinutes(endDate, startDate);
    const eventID = `eventBox_${props.key}_${event.uid}_${startDate.getTime()}`;

    const topPosition = timeHeightSignal.value * (startDate.getHours() + startDate.getMinutes() / 60);
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
                    width: props.overlap ? 100 - props.overlap * 10 + '%' : '100%',
                }}
                onClick={() => {
                    props.onClick(event);
                }}
            >
                <div>
                    {event.title} {format(startDate, 'h:mma')} - {format(endDate, 'h:mma')} ({durationMinutes} minutes)
                </div>
                <div>
                    {locationObject.location} building {'('}
                    {locationObject.building}
                    {')'} in room {locationObject.room}
                </div>
            </Box>
        </>
    );
}
