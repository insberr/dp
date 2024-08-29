import { ScheduleXCalendar } from '@schedule-x/react';
import {
    createCalendar,
    viewDay,
    viewMonthAgenda,
    viewMonthGrid,
    viewWeek
} from '@schedule-x/calendar';

import '@schedule-x/theme-default/dist/index.css';
import '../../styles/schedule-x-overides.scss';
import { useEffect, useState } from 'preact/hooks';
import { Box, Button } from '@mui/material';
import {
    blankSchedulesSignal,
    createScheduleAdvanced,
    generateUID,
    schedulesSignal
} from '../../storage/scheduleSignal';
import { createCurrentTimePlugin } from '@schedule-x/current-time';
import { createEventRecurrencePlugin, createEventsServicePlugin } from "@schedule-x/event-recurrence";
import InputFileUpload from '../../components/InputFileUpload';
import { ScheduleCreatedFrom, ScheduleRepeatType } from '../schedule/scheduleMain';
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop';
import { createEventModalPlugin } from '@schedule-x/event-modal';

const recurrencePlugin = createEventRecurrencePlugin();
const eventsServicePlugin = createEventsServicePlugin();

// createCalendar cannot be inside the component function or else nothing loads?
const cal = createCalendar({
    views: [viewWeek, viewDay, viewMonthAgenda, viewMonthGrid],
    defaultView: viewDay.name,
    isDark: true,
    plugins: [
        recurrencePlugin,
        eventsServicePlugin,
        createCurrentTimePlugin(),
        createDragAndDropPlugin(),
        createEventModalPlugin()
    ],
    dayBoundaries: {
        start: '08:00',
        end: '23:00'
    },
    calendars: {
        all: {
            colorName: 'all_events',
            lightColors: {
                main: '#ff4a4a',
                container: '#ffaaaa',
                onContainer: '#590000',
            },
            darkColors: {
                main: '#ffc0c0',
                onContainer: '#ffdede',
                container: '#b53434',
            },
        }
    },
    events: []
});

export default function ScheduleXMain() {
    const [calendarApp, setCalendarApp] = useState(cal);

    if (schedulesSignal.value === null) schedulesSignal.value = blankSchedulesSignal();

    if (schedulesSignal.value.schedules.length === 0) {
        return (
            <div>
                <div>Upload ICS file, which can be downloaded from Self Service in the schedule section.</div>
                <InputFileUpload />
                <Button
                    variant="contained"
                    onClick={() => {
                        createScheduleAdvanced({
                            createdFrom: ScheduleCreatedFrom.DEFAULT,
                            uid: generateUID(),
                            name: 'Main Schedule',
                            scheduleEvents: [],
                            repeat: {
                                type: ScheduleRepeatType.NONE,
                            },
                            defaultOpacity: 1,
                        });
                    }}
                >
                    Continue Without Upload
                </Button>
            </div>
        );
    }

    useEffect(() => {
        if (schedulesSignal.value.schedules.length < 1) return;

        const events = schedulesSignal.value.schedules[0].scheduleEvents
            .map((e, idx) => {
                // fixme: for some reason date-fns format doesnt work
                const start = `${e.startDate.getFullYear()}-${(e.startDate.getMonth() + 1).toString().padStart(2, '0')}-${e.startDate.getDate().toString().padStart(2, '0')} ${e.startDate.getHours().toString().padStart(2, '0')}:${e.startDate.getMinutes().toString().padStart(2, '0')}`;
                const end = `${e.endDate.getFullYear()}-${(e.endDate.getMonth() + 1).toString().padStart(2, '0')}-${e.endDate.getDate().toString().padStart(2, '0')} ${e.endDate.getHours().toString().padStart(2, '0')}:${e.endDate.getMinutes().toString().padStart(2, '0')}`;

                console.log(start, end, e);

                return {
                    id: idx,
                    title: e.title,
                    start,
                    end,
                    location: e.location,
                    description: e.description,
                    calendarId: "all",
                    // rrule: 'FREQ=WEEKLY;UNTIL=20240729T235959'
                    // start: `2024-07-10 ${e.startDate.getHours().toString().padStart(2, '0')}:${e.startDate.getMinutes().toString().padStart(2, '0')}`,
                    // end: `2024-07-10 ${e.endDate.getHours().toString().padStart(2, '0')}:${e.endDate.getMinutes().toString().padStart(2, '0')}`,
                };
            });

        eventsServicePlugin.set(events);
    }, [schedulesSignal.value]);

    return <Box mb={10}>
        <ScheduleXCalendar calendarApp={cal} />
    </Box>;
}