import { icsFileSignal } from './storage/icsfile';

import { Button, Stack } from '@mui/material';
import ScheduleMain from './pages/schedule/scheduleMain';
import LoginPage from './pages/login/loginPage';

export default function App() {
    return (
        <div>
            <h1>Egg</h1>
            <LoginPage />
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
                    <a href={'https://selfservice.digipen.edu'} target="_blank">
                        Self Service
                    </a>
                    <a href={'https://distance.digipen.edu/2023-fall/login/index.php'} target="_blank">
                        Moodle (Fall 2023)
                    </a>
                    <a target="_blank">Dragon Ride</a>
                    <a target="_blank">Housing Portal</a>
                    <a target="_blank">Webmail</a>
                    <a target="_blank">Handshake</a>
                    <a target="_blank">Am i missing anything?</a>
                </Stack>
            </div>
        </div>
    );
}
