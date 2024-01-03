import { Box, Modal, Typography } from '@mui/material';
import { convertLocationToObject } from '../../utilities/ICSParser';
import { differenceInMinutes, format } from 'date-fns';
import { useState } from 'preact/hooks';
import { timeHeight } from './daySchedule';
import { ScheduleEvent } from './scheduleMain';

import './daySchedule.scss';

export default function EventBox(props: { event: ScheduleEvent; key: number | string; color?: string; opacity?: number }) {
    const event = props.event;
    const locationObject = convertLocationToObject(event.location);
    const durationMinutes = differenceInMinutes(event.endDate, event.startDate);

    const eventID = `eventBox_${props.key}_${event.uid}_${event.startDate.getTime()}`;
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const topPosition = 28 + timeHeight * (event.startDate.getHours() + event.startDate.getMinutes() / 60);
    const height = timeHeight * (durationMinutes / 60);

    return (
        <>
            <Box
                id={eventID}
                className={'eventBox'}
                sx={{
                    borderColor: props.color || event.borderColor,
                    backgroundColor: props.color || event.backgroundColor,
                    opacity: props.opacity || event.opacity,
                    top: topPosition,
                    height: height,
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
            <Modal open={open} onClose={handleClose} aria-labelledby={'model' + eventID + event.title} aria-describedby={'model' + eventID}>
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
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {event.title}
                    </Typography>
                    <Typography id={'modal-modal-description' + eventID} sx={{ mt: 2 }}>
                        {format(event.startDate, 'h:mma')} - {format(event.endDate, 'h:mma')} ({durationMinutes} minutes)
                    </Typography>
                    <Typography id={'modal-modal-description' + eventID} sx={{ mt: 2 }}>
                        {locationObject.location} building {'('}
                        {locationObject.building}
                        {')'} in room {locationObject.room}
                    </Typography>
                </Box>
            </Modal>
        </>
    );
}
