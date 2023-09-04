import { Box, Button, Card, CardContent, CardHeader, Input, Typography } from '@mui/material';
import { icsFileSignal } from '../../storage/icsfile';
import ChangeDateButtons from './changeDateButtons';
import { isSameDay } from 'date-fns';
import ICSParser, { convertLocationToObject } from '../../utilities/ICSParser';
import { format, utcToZonedTime } from 'date-fns-tz';
import { dateForDisplay } from '../../storage/dateForDisplay';
import { PageToRender, pageToRender } from '../../storage/pageToRender';

export default function ScheduleMain() {
    if (icsFileSignal.value.data === null) {
        return (
            <div>
                <Box>
                    <Typography variant="h4">Curious What This Website Is About?</Typography>
                    <Button
                        onCick={() => {
                            pageToRender.value = PageToRender.Settings;
                        }}
                    >
                        Click here
                    </Button>
                </Box>
                <div>Upload ICS file, which can be downloaded from Self Service in the schedule section.</div>
                <Input
                    type="file"
                    onChange={(change) => {
                        if (change === null) {
                            console.log('Uploaded ICS file is null. How ???');
                            return;
                        }

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

                        // Bad, fix later
                        // @ts-ignore
                        reader.readAsText(change.target?.files[0]); // you could also read images and other binaries
                    }}
                />
            </div>
        );
    }

    const _schedule = ICSParser(icsFileSignal.value.data);

    const schedule = _schedule
        .filter((event: any) => {
            return isSameDay(event.dtstart.toJSDate(), dateForDisplay.value);
        })
        .sort((a: any, b: any) => {
            return a.dtstart.toJSDate().getTime() - b.dtstart.toJSDate().getTime();
        });

    return (
        <>
            <Box>
                <Typography variant="h4">Curious What This Website Is About?</Typography>
                <Button
                    onCick={() => {
                        pageToRender.value = PageToRender.Settings;
                    }}
                >
                    Click here
                </Button>
            </Box>
            <ChangeDateButtons />
            <Box>
                {schedule.length === 0 && <div>No classes today / or something went wrong</div>}
                {schedule.map((event: any) => {
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
            </Box>
        </>
    );
}
