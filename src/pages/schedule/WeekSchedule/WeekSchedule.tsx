import { Grid } from '@mui/material';
import DaySchedule from '../DaySchedule/daySchedule';
import { ScheduleEvent } from '../scheduleMain';
import { subDays, addDays, eachWeekendOfInterval, eachDayOfInterval, isSameDay, isSunday } from 'date-fns';

export default function WeekSchedule(props: {
    displayDate: Date;
    timeBarTime: Date;
    onClickSchedule: (clickEvent: any, startDate: Date, endDate?: Date) => void;
    onDraggingSchedule: (startDate: Date, endDate: Date) => ScheduleEvent;
}) {
    let daysToDisplay: Date[] = [];

    if (isSunday(props.displayDate)) {
        daysToDisplay = eachDayOfInterval({
            start: props.displayDate,
            end: addDays(props.displayDate, 6),
        });
    } else {
        const oneWeekAgo = subDays(props.displayDate, 7);
        const weekendDays = eachWeekendOfInterval({ start: oneWeekAgo, end: props.displayDate });
        daysToDisplay = eachDayOfInterval({ start: weekendDays[1], end: addDays(weekendDays[0], 7) });
    }

    return (
        <Grid container columns={7}>
            {daysToDisplay.map((day, index) => {
                const isDisplayDate = isSameDay(day, props.displayDate);
                return (
                    <Grid item xs={1}>
                        {isDisplayDate ? <div>Today</div> : <div>{day.toDateString()}</div>}
                        <DaySchedule
                            displayDate={day}
                            timeBarTime={props.timeBarTime}
                            onClickSchedule={props.onClickSchedule}
                            onDraggingSchedule={props.onDraggingSchedule}
                            hideTimeBar={isDisplayDate ? false : true}
                            hidetimes={index === 0 ? false : true}
                        />
                    </Grid>
                );
            })}
        </Grid>
    );
}
