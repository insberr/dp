import { Box, Button, TextField } from '@mui/material';
import ChangeDateButtons, { collapseUnusedTime } from './changeDateButtons';
import { dateForDisplay } from '../../storage/dateForDisplay';
import { timeHeightSignal, viewModeSignal } from '../../storage/signals';
import { SchedulesViewMode } from './scheduleMain';
import { format } from 'date-fns';

export default function CalendarMenuBar() {
    return (
        <Box sx={{ top: 0, height: 150 }}>
            <ChangeDateButtons />
            {/*<div>Display Date: {format(dateForDisplay.value, 'MM/dd/yyyy')}</div>*/}
            <div>Display Date: {dateForDisplay.value.toString()}</div>
            <Button
                hidden
                variant="contained"
                onClick={() => {
                    collapseUnusedTime.value = !collapseUnusedTime.value;
                }}
            >
                Collapse Unused Time (todo)
            </Button>
            <TextField
                id="timeheight-textbox-changer"
                label="Time Height"
                variant="outlined"
                value={timeHeightSignal.value}
                onChange={(e: any) => {
                    let value = parseInt(e.target.value);
                    if (isNaN(value)) value = 0;
                    if (value < 0) value = 0;

                    timeHeightSignal.value = value;
                }}
            />
            <Button
                onClick={() => {
                    viewModeSignal.value = viewModeSignal.value === SchedulesViewMode.DAY ? SchedulesViewMode.WEEK : SchedulesViewMode.DAY;
                }}
            >
                Toggle Week View
            </Button>
        </Box>
    );
}
