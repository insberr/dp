import {
    Box,
    Button,
    Divider,
    FormControl,
    IconButton,
    InputLabel,
    Menu,
    MenuItem,
    Modal,
    OutlinedInput,
    Select,
    SelectChangeEvent,
    TextField,
    Typography,
} from '@mui/material';
import { ScheduleCreatedFrom, ScheduleEvent } from './scheduleMain';
import { format } from 'date-fns';
import {
    createEvent,
    createSchedule,
    createScheduleAdvanced,
    deleteEvent,
    editEvent,
    generateUID,
    schedulesSignal,
} from '../../storage/scheduleSignal';
import { convertLocationToObject } from '../../utilities/ICSParser';
import { DateTimePicker } from '@mui/x-date-pickers';
import { ChromePicker } from 'react-color';
import hexRgb from 'hex-rgb';
import dayjs from 'dayjs';
import EditIcon from '@mui/icons-material/Edit';
import { ScheduleEventExtraInfo } from './DaySchedule/daySchedule';

export function EditEventMenu(props: {
    event: ScheduleEventExtraInfo | null;
    setEvent: (event: ScheduleEventExtraInfo | null) => void;
    editScheduleHandler: (schedule: string | null) => void;
}) {
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

    // Temporary till I find a better color library
    const eventBGColor = hexRgb(event.backgroundColor?.includes('#') ? event.backgroundColor : false || '#ffffff');

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
                <Typography
                    id={'edit-event-modal-event-parent-schedule-repeating' + eventID}
                    hidden={event.isParentScheduleRepeatedWeekly === undefined || event.isParentScheduleRepeatedWeekly === false}
                    sx={{ mt: 2 }}
                >
                    This event is part of a repeating schedule, editing it will edit ALL repeated instances (untill I become not lazy and make it so
                    it doesnt do that lol)
                </Typography>
                <Typography id={'edit-event-modal-description' + eventID} sx={{ mt: 2 }}>
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
                <FormControl sx={{ m: 1, width: 300 }}>
                    <InputLabel id="edit-event-schedule-select-label">Schedule</InputLabel>
                    <Select
                        labelId="edit-event-schedule-select-label"
                        id="edit-event-schedule-select"
                        value={event.parentScheduleUid}
                        onChange={(e: any) => {
                            const value = e.target?.value || null;
                            let newUID = value;

                            if (value === 'new-schedule') {
                                newUID = generateUID();

                                createScheduleAdvanced({
                                    createdFrom: ScheduleCreatedFrom.USER,
                                    uid: newUID,
                                    name: 'New Schedule',
                                    repeatWeekly: false,
                                    scheduleEvents: [],
                                });
                            }

                            deleteEvent(event);

                            const newEvent = createEvent(newUID, event);
                            if (newEvent === null) {
                                throw new Error('Failed to create new event');
                            }

                            handleEventEdit(newEvent);
                        }}
                        input={<OutlinedInput label="Schedule" />}
                        renderValue={(selected) => schedulesSignal.value.schedules.find((schedule) => schedule.uid === selected)?.name || selected}
                    >
                        <MenuItem divider key={'new-schedule'} value={'new-schedule'} style={undefined}>
                            Create New Schedule
                        </MenuItem>

                        {schedulesSignal.value.schedules.map((scheduleValue) => (
                            <MenuItem key={scheduleValue.uid} value={scheduleValue.uid} style={undefined}>
                                {scheduleValue.name}
                                <IconButton
                                    sx={{ position: 'absolute', right: 0 }}
                                    onClick={() => {
                                        props.editScheduleHandler(scheduleValue.uid);
                                    }}
                                    color="primary"
                                    aria-label="add to shopping cart"
                                >
                                    <EditIcon />
                                </IconButton>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
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
