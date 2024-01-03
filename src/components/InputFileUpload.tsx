import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Input } from '@mui/material';
import ICSParser from '../utilities/ICSParser';
import { schedulesSignal } from '../storage/scheduleSignal';
import { EventCreatedFrom, ScheduleEvent } from '../pages/schedule/scheduleMain';

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

                        // Parse the ICS file into JSON format so we can work with it
                        const icsFileSchedule = ICSParser(file as string);

                        // Create events from the ICS file events
                        // TODO: Make this detect duplicates, dont add them, and use the reoccurring event data to make the event reoccur
                        const scheduleFromICS_FILE = icsFileSchedule.map((icsEvent: any) => {
                            const event: ScheduleEvent = {
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

                        if (schedulesSignal.value === null) schedulesSignal.value = [];

                        const existingICSFileCalendars = schedulesSignal.value.filter((schedule) => {
                            return schedule.createdFrom === EventCreatedFrom.ICS_FILE;
                        });

                        if (existingICSFileCalendars.length > 0) {
                            // TODO: Add a popup to ask if they want to replace or create a new calendar
                            // For now, just replace it
                            const index = schedulesSignal.value.indexOf(existingICSFileCalendars[0]);
                            schedulesSignal.value[index].scheduleEvents = scheduleFromICS_FILE;
                        } else {
                            schedulesSignal.value.push({
                                createdFrom: EventCreatedFrom.ICS_FILE,
                                uid: 'icsFileCalendar',
                                name: 'Calendar From ICS File',
                                scheduleEvents: scheduleFromICS_FILE,

                                defaultBackgroundColor: 'salmon',
                                defaultBorderColor: 'red',
                                defaultOpacity: 1,
                            });
                        }

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
