import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import { convertLocationToObject } from '../../../utilities/ICSParser';
import { differenceInMinutes, format } from 'date-fns';
import { useRef, useState } from 'preact/hooks';
import { ScheduleEvent } from '../scheduleMain';

import './daySchedule.scss';
import { deleteEvent, editEvent, schedulesSignal } from '../../../storage/scheduleSignal';
import { timeHeightSignal } from '../../../storage/signals';
import Moveable, { OnDrag, OnResize } from 'preact-moveable';
import { EditEventMenu } from '../EditEventMenu';

export type EventBoxProps = { event: ScheduleEvent; key: number | string; color?: string; opacity?: number };
export default function EventBox(props: EventBoxProps) {
    const [event, eventSet] = useState<ScheduleEvent>(props.event);
    const locationObject = convertLocationToObject(event.location);
    const durationMinutes = differenceInMinutes(event.endDate, event.startDate);

    const boxRef = useRef<HTMLDivElement>(null);

    const eventID = `eventBox_${props.key}_${event.uid}_${event.startDate.getTime()}`;
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        boxRef.current?.classList.add('target');
        setOpen(true);
    };
    const handleClose = () => setOpen(false);

    const topPosition = 28 + timeHeightSignal.value * (event.startDate.getHours() + event.startDate.getMinutes() / 60);
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
                ref={boxRef}
                id={eventID}
                className={'eventBox'}
                sx={{
                    borderColor: borderColor,
                    backgroundColor: backgroundColor,
                    opacity: opacity,
                    top: topPosition + 'px',
                    height: height + 'px',
                }}
                onClick={handleOpen}
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
            <EditEventMenu
                event={open ? event : null}
                setEvent={(a: ScheduleEvent | null) => {
                    if (a === null) return handleClose();
                    eventSet(a);
                }}
            />
            {/* <Modal open={open} onClose={handleClose} aria-labelledby={'model' + eventID + event.title} aria-describedby={'model' + eventID}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <TextField
                        id={'event-title-edit-' + event.uid}
                        label="Event Title"
                        variant="standard"
                        value={event.title}
                        onChange={(e: any) => {
                            const value = e.target.value;
                            editEvent(event, { ...event, title: value });
                        }}
                    />
                    <Typography id={'modal-modal-description' + eventID} sx={{ mt: 2 }}>
                        {format(event.startDate, 'h:mma')} - {format(event.endDate, 'h:mma')} ({durationMinutes} minutes)
                    </Typography>
                    <Typography id={'modal-modal-description' + eventID} sx={{ mt: 2 }}>
                        {locationObject.location} building {'('}
                        {locationObject.building}
                        {')'} in room {locationObject.room}
                    </Typography>
                    <Button
                        onClick={() => {
                            deleteEvent(event);
                            handleClose();
                        }}
                    >
                        Delete Event
                    </Button>
                </Box>
            </Modal> */}
        </>
    );
}
