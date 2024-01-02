import { Box } from '@mui/material';
import { convertLocationToObject } from '../../utilities/ICSParser';
import { utcToZonedTime, format } from 'date-fns-tz';
import { differenceInMinutes } from 'date-fns';

export default function EventBox(props: { event: any; timeHeight: number; color: string; opacity?: number }) {
    const event = props.event;
    const locationObject = convertLocationToObject(event.location);
    const startTime = utcToZonedTime(event.dtstart.toJSDate(), 'America/Los_Angeles');
    const endTime = utcToZonedTime(event.dtend.toJSDate(), 'America/Los_Angeles');
    const durationMinutes = differenceInMinutes(endTime, startTime);

    return (
        <Box
            sx={{
                borderStyle: 'solid',
                borderColor: props.color,
                borderWidth: '2px',
                borderRadius: '4px',
                position: 'absolute',
                top: () => {
                    const topValue = 28 + props.timeHeight * (startTime.getHours() + startTime.getMinutes() / 60);
                    return topValue;
                },
                height: () => {
                    const heightFor60Minutes = props.timeHeight;
                    const duration = durationMinutes;
                    const height = heightFor60Minutes * (duration / 60);
                    return height;
                },
                width: '100%',
                color: 'black',
                overflow: 'hidden',
            }}
        >
            <Box
                sx={{
                    opacity: props.opacity ?? 1,
                    backgroundColor: props.color,
                    height: '100%',
                    width: '100%',
                    position: 'absolute',
                }}
            ></Box>
            <Box sx={{ position: 'absolute' }}>
                <div>
                    {event.summary} {format(startTime, 'h:mma')} - {format(endTime, 'h:mma')} ({durationMinutes} minutes)
                </div>
                <div>
                    {locationObject.location} building {'('}
                    {locationObject.building}
                    {')'} in room {locationObject.room}
                </div>
            </Box>
        </Box>
    );
}
