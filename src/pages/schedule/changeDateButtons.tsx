import { Button } from '@mui/material';

import { dateForDisplay } from '../../storage/dateForDisplay';

export default function ChangeDateButtons() {
    return (
        <div>
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
            <div>Display Date: {dateForDisplay.value.toString()}</div>
        </div>
    );
}
