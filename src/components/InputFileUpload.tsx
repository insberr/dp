import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Input } from '@mui/material';
import ICSParser from '../utilities/ICSParser';
import { createScheduleAdvanced, generateUID, schedulesSignal } from '../storage/scheduleSignal';
import { ScheduleCreatedFrom, ScheduleEvent } from '../pages/schedule/scheduleMain';

export default function InputFileUpload() {
    return (
        <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
            Upload file
            <Input
                sx={{
                    clip: 'rect(0 0 0 0)',
                    clipPath: 'inset(50%)',
                    height: 1,
                    overflow: 'hidden',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    whiteSpace: 'nowrap',
                    width: 1,
                }}
                type="file"
                onChange={(change) => {
                    if (change === null) {
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

                                backgroundColor: 'salmon',
                                borderColor: 'red',
                                opacity: 1,
                            };

                            return event;
                        });

                        // Remember, this does not modify the localstorage value, so when we are done we need to set it
                        if (existingICSFileCalendars.length > 0) {
                            // TODO: Add a popup to ask if they want to replace or create a new calendar
                            // For now, just replace it
                            console.log('Replacing existing ICS file calendar');

                            const index = schedulesSignalValue.indexOf(existingICSFileCalendars[0]);

                            schedulesSignalValue[index].scheduleEvents = scheduleFromICS_FILE.map((event: ScheduleEvent) => {
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
                                scheduleEvents: scheduleFromICS_FILE.map((event: ScheduleEvent) => {
                                    event.parentScheduleUid = scheduleUID;
                                    return event;
                                }),

                                repeatWeekly: true,

                                defaultOpacity: 1,
                            });
                        }

                        // Save the schedules to localstorage now that we are done
                        // schedulesSignal.value = schedulesSignalValue;

                        // console.log('event:file: ', file);
                    };

                    // If theres an error with the uploaded file, log to console and alert the user
                    reader.onerror = (error) => {
                        console.log(error);
                        // TODO: actually show error to user
                    };

                    // TODO: Bad, fix later
                    // @ts-ignore
                    reader.readAsText(change.target?.files[0]); // you could also read images and other binaries
                }}
            />
        </Button>
    );
}
