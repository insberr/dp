import { useState } from 'preact/hooks';

import ICSParser, { convertLocationToObject } from './utilities/ICSParser';
import { isSameDay } from 'date-fns';
import { format, utcToZonedTime } from 'date-fns-tz';

import { icsFileSignal } from './storage/icsfile';

import { Card, Box, Button, Input, CardContent, CardHeader, Stack } from '@mui/material';

export default function App() {
    const [dateToUseForDisplay, setDateToUseForDisplay] = useState(new Date());

    const _schedule = ICSParser(icsFileSignal.value);

    console.log('_schedule', _schedule);

    if (_schedule === null) {
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
                            icsFileSignal.value = file as string;
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
    const schedule = _schedule
        .filter((event: any) => {
            return isSameDay(event.dtstart.toJSDate(), dateToUseForDisplay);
        })
        .sort((a: any, b: any) => {
            return a.dtstart.toJSDate().getTime() - b.dtstart.toJSDate().getTime();
        });

    return (
        <div>
            <h1>App</h1>

            <Button
                variant="contained"
                onClick={() => {
                    setDateToUseForDisplay((currentDate) => {
                        const newDate = new Date(currentDate);
                        newDate.setDate(newDate.getDate() - 1);
                        return newDate;
                    });
                }}
            >
                Previous day
            </Button>
            <Button
                variant="contained"
                onClick={() => {
                    setDateToUseForDisplay((currentDate) => {
                        const newDate = new Date(currentDate);
                        newDate.setDate(newDate.getDate() + 1);
                        return newDate;
                    });
                }}
            >
                Next day
            </Button>
            <Button
                variant="contained"
                onClick={() => {
                    setDateToUseForDisplay(new Date());
                }}
            >
                Today
            </Button>
            <div>Display Date: {dateToUseForDisplay.toString()}</div>
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
            <div>
                <Button
                    variant="contained"
                    onClick={() => {
                        icsFileSignal.value = '';
                    }}
                >
                    Reset (clear ics file)
                </Button>
            </div>
            <div>
                <h2>Links (To Do)</h2>
                <Stack direction="column" spacing={2}>
                    <a>Self Service</a>
                    <a>Moodle</a>
                    <a>Dragon Ride</a>
                    <a>Housing Portal</a>
                    <a>Am i missing anything?</a>
                </Stack>
            </div>
        </div>
    );
}
