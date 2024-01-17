import { Box, Button } from '@mui/material';

import { dateForDisplay } from '../../storage/dateForDisplay';
import { signal } from '@preact/signals';
import { SchedulesViewMode } from './scheduleMain';
import { addDays, addWeeks, subDays, subWeeks } from 'date-fns';
import { viewModeSignal } from '../../storage/signals';

export const collapseUnusedTime = signal<boolean>(false);

export default function ChangeDateButtons() {
    if (viewModeSignal.value === SchedulesViewMode.WEEK)
        return (
            <Box>
                <Button
                    variant="contained"
                    onClick={() => {
                        dateForDisplay.value = subWeeks(dateForDisplay.value, 1);
                    }}
                >
                    Previous Week
                </Button>
                <Button
                    variant="contained"
                    onClick={() => {
                        dateForDisplay.value = addWeeks(dateForDisplay.value, 1);
                    }}
                >
                    Next Week
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

    return (
        <Box>
            <Button
                variant="contained"
                onClick={() => {
                    dateForDisplay.value = subDays(dateForDisplay.value, 1);
                }}
            >
                Previous day
            </Button>
            <Button
                variant="contained"
                onClick={() => {
                    dateForDisplay.value = addDays(dateForDisplay.value, 1);
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
