import { Box, Grid } from '@mui/material';
import EventBox from './eventBox';
import { Schedules, ScheduleEvent, Schedule } from './scheduleMain';
import { isSameDay } from 'date-fns';

export const timeHeight = 50;

export default function DaySchedule(props: { schedules: Schedules; displayDate: Date; timeBarTime: Date }) {
    // TODO: Make this work frfr no cap
    const hoursToDisplay = [...Array(25)]; // [1, 2, 3, 11, 12, 13, 14, 15, 16, 17];

    const eventsForDisplayDate = props.schedules
        // Will this actually work??
        .flatMap((schedule: Schedule) => {
            return schedule.scheduleEvents;
        })
        .filter((event: ScheduleEvent) => {
            return isSameDay(event.startDate, props.displayDate);
        })
        .sort((a: ScheduleEvent, b: ScheduleEvent) => {
            return a.startDate.getTime() - b.startDate.getTime();
        });

    return (
        <>
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
                                    const time = props.timeBarTime;
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
                        {eventsForDisplayDate.map((event: any) => {
                            return <EventBox event={event} />;
                        })}
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}
