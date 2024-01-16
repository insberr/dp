import { Box, Button, FormControl, FormControlLabel, Modal, Switch, TextField, Typography } from '@mui/material';
import { editSchedule, schedulesSignal } from '../../storage/scheduleSignal';
import { Schedule } from './scheduleMain';

export function EditScheduleMenu(props: { schedule: string | null; setSchedule: (schedule: string | null) => void }) {
    if (props.schedule === null) return <></>;

    const schedule = schedulesSignal.value.schedules.find((schedule) => {
        return schedule.uid === props.schedule;
    });
    if (schedule === undefined) {
        return <Box>No schedule for given schedule UID. HOW????</Box>;
    }

    const handleClose = () => {
        props.setSchedule(null);
    };

    const handleScheduleEdit = (newSchedule: Schedule) => {
        editSchedule(schedule, newSchedule);
        // props.setSchedule(newSchedule.uid);
    };

    const scheduleID = schedule.uid;

    return (
        <Modal
            open={props.schedule !== null}
            onClose={handleClose}
            aria-labelledby={'model' + scheduleID + schedule.name}
            aria-describedby={'model' + scheduleID}
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
                    id={'schedule-name-edit-' + scheduleID}
                    label="Schedule Name"
                    variant="standard"
                    value={schedule.name}
                    onChange={(e: any) => {
                        const value = e.target.value;
                        handleScheduleEdit({ ...schedule, name: value });
                    }}
                />
                <FormControl>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={schedule.repeatWeekly}
                                onChange={(e: any) => {
                                    const value = e.target.checked;
                                    handleScheduleEdit({ ...schedule, repeatWeekly: value });
                                }}
                                inputProps={{ 'aria-label': 'Repeat Weekly Switch' }}
                            />
                        }
                        label="Repeat Weekly"
                    />
                </FormControl>
                <Button
                    onClick={() => {
                        // deleteSchedule(schedule);
                        handleClose();
                    }}
                >
                    Delete Schedule
                </Button>
                <Button
                    onClick={() => {
                        editSchedule(schedule, schedule);
                        handleClose();
                    }}
                >
                    Done
                </Button>
            </Box>
        </Modal>
    );
}
