import { Box, Button } from '@mui/material';
import { icsFileSignal } from '../../storage/icsfile';
import { PageToRender, pageToRender } from '../../storage/pageToRender';

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

            <Box sx={{ marginTop: 5 }}>
                <Button onClick={() => (pageToRender.value = PageToRender.Schedule)}>Go To Schedule</Button>
                <Button onClick={() => (pageToRender.value = PageToRender.Links)}>Go To Links And Info</Button>
                <Button onClick={() => (pageToRender.value = PageToRender.Settings)}>Go To Settings</Button>
                <Button onClick={() => (pageToRender.value = PageToRender.Login)}>Go To Login</Button>
            </Box>
        </div>
    );
}
