import icaljs from 'ical.js';
// import * as ics2 from 'bundle-text:./schedule.R2023FA.ics';

export default function ICSParser(ics: string | null): any {
    if (!ics) return null;
    const icalParsedData = icaljs.parse(ics);
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

export type ICSLocation = {
    location: string;
    building: string;
    room: string;
};

export function convertLocationToObject(locationString: string): ICSLocation {
    const locationSplit = locationString.split(',');
    const location = locationSplit[0].split(':')[1];
    const building = locationSplit[1].split(':')[1];
    const room = locationSplit[2].split(':')[1];
    return {
        location,
        building,
        room,
    };
}
