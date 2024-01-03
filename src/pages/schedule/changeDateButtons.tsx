import { Box, Button } from '@mui/material';

import { dateForDisplay } from '../../storage/dateForDisplay';
import { signal } from '@preact/signals';

export const collapseUnusedTime = signal<boolean>(false);

export default function ChangeDateButtons() {
    return (
        <Box>
            <Button
                variant="contained"
                onClick={() => {
                    const newDate = new Date(dateForDisplay.value);
                    newDate.setDate(newDate.getDate() - 1);
                    dateForDisplay.value = newDate;
                }}
            >
                Previous day
            </Button>
            <Button
                variant="contained"
                onClick={() => {
                    const newDate = new Date(dateForDisplay.value);
                    newDate.setDate(newDate.getDate() + 1);
                    dateForDisplay.value = newDate;
                }}
            >
                Next day
            </Button>
            <Button
                variant="contained"
                onClick={() => {
                    dateForDisplay.value = new Date();
                }}
            >
                Today
            </Button>
        </Box>
    );
}
