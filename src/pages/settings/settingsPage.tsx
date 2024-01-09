import { Box, Button, Typography } from '@mui/material';
import { PageToRender, pageToRender } from '../../storage/pageToRender';
import { defferedInstallPrompt } from '../../storage/signals';
import { blankSchedulesSignal, schedulesSignal } from '../../storage/scheduleSignal';
import InputFileUpload from '../../components/InputFileUpload';

export default function SettingsPage() {
    return (
        <div>
            <Box>
                <Typography variant="h4">About</Typography>
                <Typography variant="body1">
                    This website is a tool to help students at DigiPen Institute of Technology keep track of their schedule and all of the other
                    information thats not all in one place. It is not affiliated with DigiPen Institute of Technology in any way. There are many
                    planned features so keep checking back for updates!
                </Typography>
            </Box>
            <Button
                variant="contained"
                onClick={() => {
                    schedulesSignal.value = blankSchedulesSignal();
                    pageToRender.value = PageToRender.Intro;
                }}
            >
                Reset Site
            </Button>
            <InputFileUpload />
            <Button
                hidden={defferedInstallPrompt.value === null}
                variant="contained"
                onClick={async () => {
                    // Hide the app provided install promotion
                    // hideInstallPromotion();
                    // Show the install prompt
                    if (defferedInstallPrompt.value === null) return console.log('deferredPrompt is null');
                    // @ts-ignore
                    defferedInstallPrompt.value.prompt();
                    // Wait for the user to respond to the prompt
                    // @ts-ignore
                    const { outcome } = await defferedInstallPrompt.value.userChoice;
                    // Optionally, send analytics event with outcome of user choice
                    console.log(`User response to the install prompt: ${outcome}`);
                    // We've used the prompt, and can't use it again, throw it away
                    defferedInstallPrompt.value = null;
                }}
            >
                Add to homescreen
            </Button>
            <Button
                onClick={() => {
                    pageToRender.value = PageToRender.MoveableTest;
                }}
            >
                Moveable Test
            </Button>
        </div>
    );
}
