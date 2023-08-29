import { useState } from 'preact/hooks';

import ICSParser, { convertLocationToObject } from './utilities/ICSParser';
import { isSameDay } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

import { icsFileSignal } from './storage/icsfile';

import { Card, Box, Button, Input } from '@mui/material';

export default function App() {
    const [dateToUseForDisplay, setDateToUseForDisplay] = useState(new Date());

    const _schedule = ICSParser(icsFileSignal.value);

    console.log('_schedule', _schedule);

    if (_schedule === null) {
        return (
            <div>
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
    const schedule = _schedule.filter((event: any) => {
        return isSameDay(event.dtstart.toJSDate(), dateToUseForDisplay);
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
                    <Box padding={2}>
                        <h2>{event.summary}</h2>
                        <div>Class Starts On {utcToZonedTime(event.dtstart.toJSDate(), 'America/Los_Angeles').toString()}</div>
                        <div>Class Ends On {utcToZonedTime(event.dtend.toJSDate(), 'America/Los_Angeles').toString()}</div>
                        <div>
                            {locationObject.location} building {'('}
                            {locationObject.building}
                            {')'} in room {locationObject.room}
                        </div>
                    </Box>
                );
            })}
        </div>
    );
}
