import { Box, Modal, Typography } from '@mui/material';
import { convertLocationToObject } from '../../utilities/ICSParser';
import { utcToZonedTime, format } from 'date-fns-tz';
import { differenceInMinutes } from 'date-fns';
import { useState } from 'preact/hooks';
import { timeHeight } from './daySchedule';
import { ScheduleEvent } from './scheduleMain';

export default function EventBox(props: { event: ScheduleEvent; color?: string; opacity?: number }) {
    const event = props.event;
    const locationObject = convertLocationToObject(event.location);
    const startTime = utcToZonedTime(event.startDate, 'America/Los_Angeles');
    const endTime = utcToZonedTime(event.endDate, 'America/Los_Angeles');
    const durationMinutes = differenceInMinutes(endTime, startTime);

    const eventID = event.uid;
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Box
                sx={{
                    borderStyle: 'solid',
                    borderColor: props.color || event.borderColor,
                    borderWidth: '2px',
                    borderRadius: '4px',
                    position: 'absolute',
                    top: () => {
                        const topValue = 28 + timeHeight * (startTime.getHours() + startTime.getMinutes() / 60);
                        return topValue;
                    },
                    height: () => {
                        const heightFor60Minutes = timeHeight;
                        const duration = durationMinutes;
                        const height = heightFor60Minutes * (duration / 60);
                        return height;
                    },
                    width: '100%',
                    color: 'black',
                    overflow: 'hidden',
                }}
                onClick={() => {
                    console.log('clicked event with id: ' + eventID);
                    handleOpen();
                }}
            >
                <Box
                    sx={{
                        opacity: props.opacity || (event.opacity ?? 1),
                        backgroundColor: props.color || event.backgroundColor,
                        height: '100%',
                        width: '100%',
                        position: 'absolute',
                    }}
                ></Box>
                <Box sx={{ position: 'absolute' }}>
                    <div>
                        {event.title} {format(startTime, 'h:mma')} - {format(endTime, 'h:mma')} ({durationMinutes} minutes)
                    </div>
                    <div>
                        {locationObject.location} building {'('}
                        {locationObject.building}
                        {')'} in room {locationObject.room}
                    </div>
                </Box>
            </Box>
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box
                    sx={{
                        position: 'absolute' as 'absolute',
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
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {format(startTime, 'h:mma')} - {format(endTime, 'h:mma')} ({durationMinutes} minutes)
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {locationObject.location} building {'('}
                        {locationObject.building}
                        {')'} in room {locationObject.room}
                    </Typography>
                </Box>
            </Modal>
        </>
    );
}
