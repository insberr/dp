'use client'
// import { Calendar, useCalendarApp } from '../../../..'
import { ScheduleXCalendar } from './schedule-x-calendar';
import { useCalendarApp} from './use-calendar-app';
import {
    createCalendar,
    viewDay,
    viewMonthAgenda,
    viewMonthGrid,
    viewWeek
} from '@schedule-x/calendar';
import '@schedule-x/theme-default/dist/index.css'
import { useEffect, useRef, useState } from 'preact/hooks';
// import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'

// createCalendar cannot be inside the component function or else nothing loads?
const cal = createCalendar({
    views: [viewWeek, viewDay],
    defaultView: viewDay.name,
    events: [
        {
            id: '12',
            title: 'Event 1',
            start: '2023-12-15 06:00',
            end: '2023-12-15 08:00',
        },
    ],
})

export default function ScheduleXMain() {
    // const [calendarApp, setCalendarApp] = useState()

    console.log(cal);


    return <div>
        <ScheduleXCalendar calendarApp={cal} />
    </div>
}