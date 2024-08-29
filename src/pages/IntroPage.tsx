import { Box, Typography } from '@mui/material';
import LoadingSpinner from '../components/LoadingSpinner';
import { PageToRender, pageToRender } from '../storage/pageToRender';

export default function IntroPage() {
    setTimeout(() => {
        pageToRender.value = PageToRender.ScheduleX;
    }, 2000);

    // Todo Add fancy animation
    return (
        <Box>
            <Typography variant="h3">Welcome!</Typography>
            <LoadingSpinner />
        </Box>
    );
}
