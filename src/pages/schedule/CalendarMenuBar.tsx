import { Box, Button } from '@mui/material';
import ChangeDateButtons, { collapseUnusedTime } from './changeDateButtons';
import { dateForDisplay } from '../../storage/dateForDisplay';

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
        </Box>
    );
}
