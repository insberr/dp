import {
  CalendarApp,
  CalendarConfig,
  createCalendar,
} from '@schedule-x/calendar'
import { useState, useEffect } from 'preact/hooks';

export function useCalendarApp(config: CalendarConfig) {
  const [calendarApp] = useState(createCalendar(config))
  return calendarApp
}

export function useNextCalendarApp(config: CalendarConfig) {
  const [calendarApp, setCalendarApp] = useState<CalendarApp>()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCalendarApp(createCalendar(config))
    }
  }, [])

  return calendarApp
}
