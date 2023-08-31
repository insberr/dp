import { icsFileSignal } from './storage/icsfile';

import { Button, Stack } from '@mui/material';
import ScheduleMain from './pages/schedule/scheduleMain';
import LoginPage from './pages/login/loginPage';
import { PageToRender, pageToRender } from './storage/pageToRender';
import Router from './components/Router';
import CreateAccountPage from './pages/login/createAccount';

export default function App() {
    return (
        <div>
            <h1>Egg</h1>
            <Button onClick={() => (pageToRender.value = PageToRender.Schedule)}>Go To Schedule</Button>
            <Button onClick={() => (pageToRender.value = PageToRender.Links)}>Go To Links And Info</Button>
            <Button onClick={() => (pageToRender.value = PageToRender.Settings)}>Go To Settings</Button>
            <Button onClick={() => (pageToRender.value = PageToRender.Login)}>Go To Login</Button>

            <Router pageID={PageToRender.Login}>
                <LoginPage />
            </Router>
            <Router pageID={PageToRender.CreateAccount}>
                <CreateAccountPage />
            </Router>
            <Router pageID={PageToRender.Schedule}>
                <ScheduleMain />
            </Router>
            <Router pageID={PageToRender.Settings}>
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
            </Router>
            <Router pageID={PageToRender.Links}>
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
            </Router>
        </div>
    );
}
