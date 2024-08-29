import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ICSParser from '../utilities/ICSParser';
import { createScheduleAdvanced, generateUID, schedulesSignal } from '../storage/scheduleSignal';
import { ScheduleCreatedFrom, ScheduleEvent, ScheduleEventRepeatType, ScheduleRepeatType } from '../pages/schedule/scheduleMain';
import { addDays, eachWeekendOfInterval, isAfter, isBefore, isSameDay, isSunday, setHours, setMinutes, setSeconds, subDays } from 'date-fns';

import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

function reduceEventsToRepeating(scheduleFromICS_FILE: ScheduleEvent[]) {
    // TODO: Reduce events to a single week so we can make the schedule repeat weekly
    // Get first event
    const firstEvent = scheduleFromICS_FILE[0];
    // Get last event
    const lastEvent = scheduleFromICS_FILE[scheduleFromICS_FILE.length - 1];
    // Find the first day of the week that the first event is on
    let startingWeekFirstDayOfWeek = firstEvent.startDate;
    if (!isSunday(startingWeekFirstDayOfWeek)) {
        startingWeekFirstDayOfWeek = eachWeekendOfInterval({
            start: subDays(startingWeekFirstDayOfWeek, 7),
            end: startingWeekFirstDayOfWeek
        })[1]; // Sunday
    }

    startingWeekFirstDayOfWeek = setHours(setMinutes(setSeconds(startingWeekFirstDayOfWeek, 0), 0), 0);

    // Get all events from then to 7 days later
    const eventsInFirstWeek = scheduleFromICS_FILE.filter((event: ScheduleEvent) => {
        return (
            isAfter(event.startDate, startingWeekFirstDayOfWeek) &&
            isBefore(event.startDate, setHours(setMinutes(setSeconds(addDays(startingWeekFirstDayOfWeek, 7), 59), 59), 23))
        );
    });
    // For each event in the 7 days, find all events that are exactly 7 days after it, repeating till the last week is reached
    // If there is not an event 7 days after it, add it to the skip list
    const eventsReduced = eventsInFirstWeek.map((event: ScheduleEvent) => {
        // Find all events that are exactly 7 day increments apart,
        // if there is not one for a givent week, add it to the skip list
        const skipWeeks: Date[] = [];
        let currentWeek = event.startDate;
        while (isBefore(currentWeek, lastEvent.startDate)) {
            const nextWeek = setHours(setMinutes(setSeconds(addDays(currentWeek, 7), 0), 0), 0);

            const nextWeekEvent = scheduleFromICS_FILE.find((event: ScheduleEvent) => {
                return isSameDay(event.startDate, nextWeek);
            });

            if (!nextWeekEvent) {
                skipWeeks.push(nextWeek);
            }

            currentWeek = nextWeek;
        }

        event.repeat = { type: ScheduleEventRepeatType.SCHEDULE_REPEAT, skipDates: skipWeeks, endDate: null };

        return event;
    });
    return { lastEvent, startingWeekFirstDayOfWeek, eventsReduced };
}

export default function InputFileUpload() {
    const handleChange = (change: any) => {
        if (change === null) {
            // TODO: Show error to user
            console.log('Uploaded ICS file is null. How ???');
            return;
        }

        // Read the inputted file
        const reader = new FileReader();

        // Once the file loads, parse it and save it to localstorage using preact signals persist
        reader.onload = (event) => {
            const file = event.target?.result;

            /*
                TODO: Make this check to make sure the uploaded file is actually an ICS file
                Its possible to just add a catch to the ICSParser function using promises, joy
            */

            const schedulesSignalValue = schedulesSignal.value?.schedules || [];

            const existingICSFileCalendars = schedulesSignalValue.filter((schedule) => {
                return schedule.createdFrom === ScheduleCreatedFrom.ICS_FILE;
            });

            // Parse the ICS file into JSON format so we can work with it
            const icsFileSchedule = ICSParser(file as string);

            // Create events from the ICS file events
            // TODO: Make this detect duplicates, dont add them, and use the reoccurring event data to make the event reoccur
            const scheduleFromICS_FILE = icsFileSchedule.map((icsEvent: any) => {
                const event: ScheduleEvent = {
                    parentScheduleUid: 'TEMP_UID_icsFileCalendar',
                    uid: icsEvent.uid,
                    title: icsEvent.summary,
                    startDate: icsEvent.dtstart.toJSDate(),
                    endDate: icsEvent.dtend.toJSDate(),
                    description: icsEvent.description,
                    location: icsEvent.location,

                    opacity: 1,
                };

                return event;
            });

            // todo: reduce events. schedule-x has a way to do repeated events, but I am lazy for now ...
            // let { lastEvent, startingWeekFirstDayOfWeek, eventsReduced } = reduceEventsToRepeating(scheduleFromICS_FILE);
            // todo:     ... so for now we will just use the raw schedule
            let eventsReduced = scheduleFromICS_FILE.map((event: ScheduleEvent) => {
                return event;
            })

            // Remember, this does not modify the localstorage value, so when we are done we need to set it
            if (existingICSFileCalendars.length > 0) {
                // TODO: Add a popup to ask if they want to replace or create a new calendar
                // For now, just replace it
                console.log('Replacing existing ICS file calendar');

                const index = schedulesSignalValue.indexOf(existingICSFileCalendars[0]);

                schedulesSignalValue[index].scheduleEvents = eventsReduced.map((event: ScheduleEvent) => {
                    event.parentScheduleUid = existingICSFileCalendars[0].uid;
                    return event;
                });
            } else {
                console.log('Adding ICS file calendar');

                const scheduleUID = generateUID();

                createScheduleAdvanced({
                    createdFrom: ScheduleCreatedFrom.ICS_FILE,
                    uid: scheduleUID,
                    name: 'Calendar From ICS File',
                    scheduleEvents: eventsReduced.map((event: ScheduleEvent) => {
                        event.parentScheduleUid = scheduleUID;
                        return event;
                    }),

                    // todo: once I fix repeat to work with schedule-x?
                    // repeat: {
                    //     type: ScheduleRepeatType.WEEKLY,
                    //
                    //     // TODO: For now, just need to test, then ill make this proper days
                    //     startDate: startingWeekFirstDayOfWeek,
                    //     endDate: addDays(lastEvent.endDate, 1),
                    // },
                    repeat: {
                        type: ScheduleRepeatType.NONE,

                        // // TODO: For now, just need to test, then ill make this proper days
                        // startDate: startingWeekFirstDayOfWeek,
                        // endDate: addDays(lastEvent.endDate, 1),
                    },

                    // Salmon color in hex
                    defaultBackgroundColor: '#FA8072',
                    // Slightly darker salmon color in hex
                    defaultBorderColor: '#E9967A',
                    defaultOpacity: 1,
                });
            }
        };

        // If theres an error with the uploaded file, log to console and alert the user
        reader.onerror = (error) => {
            console.log(error);
            // TODO: actually show error to user
        };

        // TODO: Bad, fix later
        // @ts-ignore
        reader.readAsText(change.target?.files[0]); // you could also read images and other binaries
    }

    return (
        <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
        >
            Upload file
            <VisuallyHiddenInput
                type="file"
                onChange={handleChange}
                multiple
            />
        </Button>
        // <InputLabel variant="contained" startIcon={<CloudUploadIcon />}>
        //     Upload file
        //     <Input
        //         sx={{
        //             clip: 'rect(0 0 0 0)',
        //             clipPath: 'inset(50%)',
        //             height: 1,
        //             overflow: 'hidden',
        //             position: 'absolute',
        //             bottom: 0,
        //             left: 0,
        //             whiteSpace: 'nowrap',
        //             width: 1,
        //         }}
        //         type="file"
        //         onChange={handleChange}
        //     />
        // </InputLabel>
    );
}
