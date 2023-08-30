import { Box, Button, Card, CardContent, CardHeader, Input } from '@mui/material';
import { icsFileSignal } from '../../storage/icsfile';
import ChangeDateButtons from './changeDateButtons';
import { isSameDay } from 'date-fns';
import ICSParser, { convertLocationToObject } from '../../utilities/ICSParser';
import { format, utcToZonedTime } from 'date-fns-tz';
import { dateForDisplay } from '../../storage/dateForDisplay';

export default function ScheduleMain() {
    console.log(null, icsFileSignal.value);
    if (icsFileSignal.value.data === null) {
        return (
            <div>
                <div>Upload ICS file, which can be downloaded from Self Service in the schedule section.</div>
                <Input
                    type="file"
                    onChange={(change) => {
                        console.log('change', change);
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            const file = event.target?.result;
                            icsFileSignal.value = { data: file as string };
                            console.log('event:file: ', file); // desired file content
                        };
                        reader.onerror = (error) => {
                            console.log(error);
                            // actually show error to user
                        };
                        reader.readAsText(change.target.files[0]); // you could also read images and other binaries
                    }}
                />
            </div>
        );
    }

    const _schedule = ICSParser(icsFileSignal.value.data);
    console.log('_schedule', _schedule);

    const schedule = _schedule
        .filter((event: any) => {
            return isSameDay(event.dtstart.toJSDate(), dateForDisplay.value);
        })
        .sort((a: any, b: any) => {
            return a.dtstart.toJSDate().getTime() - b.dtstart.toJSDate().getTime();
        });

    return (
        <>
            <ChangeDateButtons />
            {schedule.length === 0 && <div>No classes today / or something went wrong</div>}
            {schedule.map((event: any) => {
                console.log(event);
                const locationObject = convertLocationToObject(event.location);
                return (
                    <Card sx={{ margin: 4 }} elevation={4}>
                        <CardHeader title={event.summary} />
                        <CardContent>
                            <Box padding={2}>
                                <div>Class Starts At {format(utcToZonedTime(event.dtstart.toJSDate(), 'America/Los_Angeles'), 'h:mma')}</div>
                                <div>Class Ends At {format(utcToZonedTime(event.dtend.toJSDate(), 'America/Los_Angeles'), 'h:mma')}</div>
                                <div>
                                    {locationObject.location} building {'('}
                                    {locationObject.building}
                                    {')'} in room {locationObject.room}
                                </div>
                            </Box>
                        </CardContent>
                    </Card>
                );
            })}
        </>
    );
}
