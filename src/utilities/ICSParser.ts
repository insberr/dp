import icaljs from 'ical.js';
import * as ics2 from 'bundle-text:./schedule.R2023FA.ics';

export default function ICSParser(ics: string): any {
    const icalParsedData = icaljs.parse(ics2);
    const icalComponent = new icaljs.Component(icalParsedData);
    const icalVevents = icalComponent.getAllSubcomponents('vevent');
    const icalVeventsParsed = icalVevents.map((vevent) => {
        // make the event into a usable object
        return vevent
            .getAllProperties()
            .map((property) => {
                return {
                    [property.name]: property.getFirstValue(),
                };
            })
            .reduce((acc, curr) => {
                return {
                    ...acc,
                    ...curr,
                };
            }, {});
    });
    console.log(icalVeventsParsed);
    return icalVeventsParsed;
}
