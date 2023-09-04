import { Box, Button, Typography } from '@mui/material';
import { icsFileSignal } from '../../storage/icsfile';
import { PageToRender, pageToRender } from '../../storage/pageToRender';

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
                    icsFileSignal.value = { data: null };
                }}
            >
                Reset ics file
            </Button>

            <Box sx={{ marginTop: 5 }}>
                <Button onClick={() => (pageToRender.value = PageToRender.Schedule)}>Go To Schedule</Button>
                <Button onClick={() => (pageToRender.value = PageToRender.Links)}>Go To Links And Info</Button>
                <Button onClick={() => (pageToRender.value = PageToRender.Settings)}>Go To Settings</Button>
                <Button onClick={() => (pageToRender.value = PageToRender.Login)}>Go To Login</Button>
                <Button onClick={() => (pageToRender.value = PageToRender.Intro)}>Go To Intro</Button>
            </Box>
        </div>
    );
}
