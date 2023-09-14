import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GearIcon from '@mui/icons-material/Settings';

import { PageToRender, pageToRender } from '../storage/pageToRender';

export default function MenuBar() {
    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
            <BottomNavigation
                showLabels
                sx={{ paddingBottom: 4, paddingTop: 4 }}
                value={pageToRender.value}
                onChange={(event, newValue) => {
                    pageToRender.value = newValue;
                }}
            >
                <BottomNavigationAction label="Schedule" icon={<RestoreIcon />} value={PageToRender.Schedule} />
                <BottomNavigationAction label="Links" icon={<FavoriteIcon />} value={PageToRender.Links} />
                <BottomNavigationAction label="Settings" icon={<GearIcon />} value={PageToRender.Settings} />
            </BottomNavigation>
        </Paper>
    );
}
