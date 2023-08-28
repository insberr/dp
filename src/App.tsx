import ICSParser from './utilities/ICSParser';
import { isSameDay } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

export default function App() {
    const schedule = ICSParser('test').filter((event: any) => {
        return isSameDay(event.dtstart.toJSDate(), new Date('August 28, 2023'));
    });
    console.log(schedule);
    return (
        <div>
            <h1>App</h1>
            {schedule.map((event: any) => {
                console.log(event);
                return (
                    <div>
                        <h2>{event.summary}</h2>
                        <div>{utcToZonedTime(event.dtstart.toJSDate(), 'America/Los_Angeles').toString()}</div>
                        <div>{utcToZonedTime(event.dtend.toJSDate(), 'America/Los_Angeles').toString()}</div>
                        <div>{utcToZonedTime(event.dtstamp.toJSDate(), 'America/Los_Angeles').toString()}</div>
                        <div>{event.description}</div>
                        <div>{event.location}</div>
                    </div>
                );
            })}
        </div>
    );
}
