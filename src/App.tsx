import { Box, Stack } from '@mui/material';
import ScheduleMain from './pages/schedule/scheduleMain';
import LoginPage from './pages/login/loginPage';
import { PageToRender } from './storage/pageToRender';
import Router from './components/Router';
import CreateAccountPage from './pages/login/createAccount';
import SettingsPage from './pages/settings/settingsPage';
import MenuBar from './components/MenuBar';
import RouterWrapper from './components/RouterWrapper';
import IntroPage from './pages/IntroPage';
import { defferedInstallPrompt } from './storage/signals';
import MoveableLibPlay from './pages/moveable/moveableLibPlay';

export default function App() {
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        defferedInstallPrompt.value = e;
        // Update UI notify the user they can install the PWA
        // showInstallPromotion();
        // Optionally, send analytics event that PWA install promo was shown.
        console.log(`'beforeinstallprompt' event was fired.`);
    });

    return (
        <div>
            <RouterWrapper pageIDs={[PageToRender.Login, PageToRender.CreateAccount, PageToRender.Intro]}>
                <Router pageID={PageToRender.Intro}>
                    <IntroPage />
                </Router>
                <Router pageID={PageToRender.Login}>
                    <LoginPage />
                </Router>
                <Router pageID={PageToRender.CreateAccount}>
                    <CreateAccountPage />
                </Router>
            </RouterWrapper>
            <RouterWrapper pageIDs={[PageToRender.MoveableTest, PageToRender.Schedule, PageToRender.Settings, PageToRender.Links]}>
                <Router pageID={PageToRender.MoveableTest}>
                    <MoveableLibPlay />
                </Router>
                <Router pageID={PageToRender.Schedule}>
                    <ScheduleMain />
                </Router>
                <Router pageID={PageToRender.Settings}>
                    <SettingsPage />
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
                            <a href="https://bytesredmond.square.site/" target="_blank">
                                Bytes Cafe Website
                            </a>
                            <a target="_blank">Dragon Ride</a>
                            <a target="_blank">Housing Portal</a>
                            <a target="_blank">Webmail</a>
                            <a target="_blank">Handshake</a>
                            <a target="_blank">Am i missing anything?</a>
                        </Stack>
                    </div>
                </Router>

                <Box
                    sx={{
                        marginBottom: '70px',
                    }}
                >
                    Created By Jonah Matteson (@insberr)
                </Box>
                <MenuBar />
            </RouterWrapper>
        </div>
    );
}
