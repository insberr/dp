import { useState } from 'preact/hooks';

import ICSParser, { convertLocationToObject } from './utilities/ICSParser';
import { isSameDay } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

import { Card, Box, Button } from '@mui/material';

export default function App() {
    const [dateToUseForDisplay, setDateToUseForDisplay] = useState(new Date());

    const schedule = ICSParser('test').filter((event: any) => {
        return isSameDay(event.dtstart.toJSDate(), dateToUseForDisplay);
    });
    console.log(schedule);
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
