import { Button } from '@mui/material';
import { icsFileSignal } from '../../storage/icsfile';

export default function SettingsPage() {
    return (
        <div>
            <Button
                variant="contained"
                onClick={() => {
                    icsFileSignal.value = { data: null };
                }}
            >
                Reset (clear ics file)
            </Button>
        </div>
    );
}
