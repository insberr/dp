import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import { ScheduleEvent } from './scheduleMain';
import { format } from 'date-fns';
import { deleteEvent, editEvent } from '../../storage/scheduleSignal';
import { convertLocationToObject } from '../../utilities/ICSParser';
import { DateTimePicker } from '@mui/x-date-pickers';
import { ChromePicker, Color } from 'react-color';
import hexRgb from 'hex-rgb';
import dayjs from 'dayjs';

export function EditEventMenu(props: { event: ScheduleEvent | null; setEvent: (event: ScheduleEvent | null) => void }) {
    if (props.event === null) return <></>;

    const event = props.event;
    const eventID = event.uid;
    const locationObject = convertLocationToObject(event.location);
    const durationMinutes = Math.round((event.endDate.getTime() - event.startDate.getTime()) / 1000 / 60);

    const handleClose = () => {
        props.setEvent(null);
    };

    const handleEventEdit = (newEvent: ScheduleEvent) => {
        editEvent(event, newEvent);
        props.setEvent(newEvent);
    };

    const eventBGColor = hexRgb(event.backgroundColor || '000000');

    return (
        <Modal
            open={props.event !== null}
            onClose={handleClose}
            aria-labelledby={'model' + eventID + event.title}
            aria-describedby={'model' + eventID}
        >
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
                        handleEventEdit({ ...event, title: value });
                    }}
                />
                <Typography id={'modal-modal-description' + eventID} sx={{ mt: 2 }}>
                    {format(event.startDate, 'h:mma')} - {format(event.endDate, 'h:mma')} ({durationMinutes} minutes)
                </Typography>
                <DateTimePicker
                    label="Start Date And Time"
                    value={dayjs(event.startDate)}
                    onChange={(value: any) => {
                        handleEventEdit({ ...event, startDate: value.toDate() });
                    }}
                />
                <DateTimePicker
                    label="End Date And Time"
                    value={dayjs(event.endDate)}
                    onChange={(value: any) => {
                        handleEventEdit({ ...event, endDate: value.toDate() });
                    }}
                />
                <TextField
                    id={'event-description-edit-' + event.uid}
                    label="Description"
                    variant="filled"
                    multiline
                    value={event.description}
                    onChange={(e: any) => {
                        const value = e.target.value;
                        handleEventEdit({ ...event, description: value });
                    }}
                />
                <Typography id={'modal-modal-description' + eventID} sx={{ mt: 2 }}>
                    {locationObject.location} building {'('}
                    {locationObject.building}
                    {')'} in room {locationObject.room}
                </Typography>
                <ChromePicker
                    color={{
                        r: eventBGColor.red,
                        g: eventBGColor.green,
                        b: eventBGColor.blue,
                        a: event.opacity,
                    }}
                    onChange={(color) => {
                        handleEventEdit({ ...event, backgroundColor: color.hex, borderColor: color.hex, opacity: color.rgb.a });
                    }}
                />
                <Button
                    onClick={() => {
                        deleteEvent(event);
                        handleClose();
                    }}
                >
                    Delete Event
                </Button>
                <Button
                    onClick={() => {
                        editEvent(event, event);
                        handleClose();
                    }}
                >
                    Done
                </Button>
            </Box>
        </Modal>
    );
}
