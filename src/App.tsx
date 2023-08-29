import { icsFileSignal } from './storage/icsfile';

import { Button, Stack } from '@mui/material';
import ScheduleMain from './pages/schedule/scheduleMain';

export default function App() {
    return (
        <div>
            <h1>App</h1>
            <ScheduleMain />
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
            <div>
                <h2>Links (Work In Progress)</h2>
                <Stack direction="column" spacing={2}>
                    <a href={'https://selfservice.digipen.edu'}>Self Service</a>
                    <a href={'https://distance.digipen.edu/2023-fall/login/index.php'}>Moodle (Fall 2023)</a>
                    <a>Dragon Ride</a>
                    <a>Housing Portal</a>
                    <a>Webmail</a>
                    <a>Handlebrake</a>
                    <a>Am i missing anything?</a>
                </Stack>
            </div>
        </div>
    );
}
