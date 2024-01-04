import { Box, Button, TextField } from '@mui/material';
import ChangeDateButtons, { collapseUnusedTime } from './changeDateButtons';
import { dateForDisplay } from '../../storage/dateForDisplay';
import { timeHeightSignal } from '../../storage/signals';

export default function CalendarMenuBar() {
    return (
        <Box sx={{ top: 0, height: 150 }}>
            <ChangeDateButtons />
            <div>Display Date: {dateForDisplay.value.toString()}</div>
            <Button
                variant="contained"
                onClick={() => {
                    collapseUnusedTime.value = !collapseUnusedTime.value;
                }}
            >
                Collapse Unused Time (todo)
            </Button>
            <TextField
                id="outlined-basic"
                label="Outlined"
                variant="outlined"
                value={timeHeightSignal.value}
                onChange={(e: any) => {
                    let value = parseInt(e.target.value);
                    if (isNaN(value)) value = 0;
                    if (value < 0) value = 0;

                    timeHeightSignal.value = value;
                }}
            />
        </Box>
    );
}
