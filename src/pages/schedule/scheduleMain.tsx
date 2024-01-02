import { Grid, Box, Button, Card, CardContent, CardHeader, Input, Typography, Modal } from '@mui/material';
import { icsFileSignal } from '../../storage/icsfile';
import ChangeDateButtons from './changeDateButtons';

import { isSameDay } from 'date-fns';
import ICSParser from '../../utilities/ICSParser';
import { currentDate, dateForDisplay } from '../../storage/dateForDisplay';
import EventBox from './eventBox';
import InputFileUpload from '../../components/InputFileUpload';
import { useEffect, useState } from 'preact/hooks';
import { signal } from '@preact/signals';

export default function ScheduleMain() {
    if (icsFileSignal.value.data === null) {
        return (
            <div>
                <div>Upload ICS file, which can be downloaded from Self Service in the schedule section.</div>
                <InputFileUpload />
            </div>
        );
    }

    const _schedule = ICSParser(icsFileSignal.value.data);

    const schedule = signal<Object[]>(
        _schedule
            .filter((event: any) => {
                return isSameDay(event.dtstart.toJSDate(), dateForDisplay.value);
            })
            .sort((a: any, b: any) => {
                return a.dtstart.toJSDate().getTime() - b.dtstart.toJSDate().getTime();
            })
    );

    const timeHeight = 50;

    const fakeEvent = {
        summary: 'Fake Event',
        location: 'Location: MAIN, Building:RB1, Room:MCHLNGLO',
        dtstart: {
            toJSDate: () => {
                return new Date('January 8, 2024 2:00:00');
            },
        },
        dtend: {
            toJSDate: () => {
                return new Date('January 8, 2024 2:30:00');
            },
        },
    };

    // schedule.value = schedule.value.push(fakeEvent);

    // TODO: Make this work frfr no cap
    const hoursToDisplay = [...Array(25)]; // [1, 2, 3, 11, 12, 13, 14, 15, 16, 17];
    return (
        <>
            <ChangeDateButtons />
            <Box
                sx={{
                    borderColor: 'gray',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    paddingTop: 1,
                    marginBottom: 10,
                }}
            >
                <Grid container spacing={0} columns={4} rowSpacing={2}>
                    <Grid item xs={1}>
                        <Grid container direction="column" spacing={0} rowSpacing={2}>
                            {hoursToDisplay.map((hour, index) => {
                                if (hour === undefined) hour = index;
                                return (
                                    <>
                                        <Grid item sx={{ height: timeHeight, overflow: 'hidden' }}>
                                            {hour > 12 ? hour - 12 : hour == 0 ? 12 : hour} {hour >= 12 ? 'P' : 'A'}M{' '}
                                            <Box sx={{ height: 2, backgroundColor: 'grey', position: 'relative', top: -12, left: 60 }}></Box>
                                        </Grid>
                                    </>
                                );
                            })}
                        </Grid>
                    </Grid>
                    <Grid
                        id="scheduleClickAddEventArea"
                        item
                        xs={3}
                        sx={{ position: 'relative' }}
                        onClick={(event: any) => {
                            if (event.target.id !== 'scheduleClickAddEventArea') return;
                            const clickedTime = (event.offsetY - 28) / timeHeight;
                            const hours = Math.floor(clickedTime);
                            const minutes = Math.floor((clickedTime - hours) * 60);
                            console.log(`ClickedTime = ${hours}:${minutes}`);
                        }}
                    >
                        <Box
                            sx={{
                                top: () => {
                                    const time = currentDate.value;
                                    const value = 12 + timeHeight * (time.getHours() + time.getMinutes() / 60);
                                    return value;
                                },
                                height: 0,
                                position: 'relative',
                                backgroundColor: 'red',
                                blockSize: 2,
                                zIndex: 2,
                            }}
                        ></Box>
                        {schedule.value.map((event: any) => {
                            return <EventBox timeHeight={timeHeight} event={event} color={'green'} opacity={0.5} />;
                        })}
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}
