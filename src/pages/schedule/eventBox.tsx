import { Box, Modal, Typography } from '@mui/material';
import { convertLocationToObject } from '../../utilities/ICSParser';
import { utcToZonedTime, format } from 'date-fns-tz';
import { differenceInMinutes } from 'date-fns';
import { useState } from 'preact/hooks';

export default function EventBox(props: { event: any; timeHeight: number; color: string; opacity?: number }) {
    const event = props.event;
    const locationObject = convertLocationToObject(event.location);
    const startTime = utcToZonedTime(event.dtstart.toJSDate(), 'America/Los_Angeles');
    const endTime = utcToZonedTime(event.dtend.toJSDate(), 'America/Los_Angeles');
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
                    borderColor: props.color,
                    borderWidth: '2px',
                    borderRadius: '4px',
                    position: 'absolute',
                    top: () => {
                        const topValue = 28 + props.timeHeight * (startTime.getHours() + startTime.getMinutes() / 60);
                        return topValue;
                    },
                    height: () => {
                        const heightFor60Minutes = props.timeHeight;
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
                        opacity: props.opacity ?? 1,
                        backgroundColor: props.color,
                        height: '100%',
                        width: '100%',
                        position: 'absolute',
                    }}
                ></Box>
                <Box sx={{ position: 'absolute' }}>
                    <div>
                        {event.summary} {format(startTime, 'h:mma')} - {format(endTime, 'h:mma')} ({durationMinutes} minutes)
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
                        {event.summary}
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
