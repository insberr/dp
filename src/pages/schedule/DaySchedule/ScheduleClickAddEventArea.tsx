import { Box } from '@mui/material';
import { timeHeightSignal } from '../../../storage/signals';
import { ScheduleEvent } from '../scheduleMain';
import { isAfter, isBefore } from 'date-fns';
import EventBox from './eventBox';
import { useState } from 'preact/hooks';

let draggingStartPos = 0;
let draggingEndPos = 0;

export default function ScheduleClickAddEventArea(props: {
    displayDate: Date;
    onClickSchedule: (clickEvent: any, startDate: Date, endDate?: Date) => void;
    onDraggingSchedule: (startDate: Date, endDate: Date) => ScheduleEvent;
}) {
    const [draggingEventBox, setDraggingEventBox] = useState<ScheduleEvent | null>(null);
    const [isMouseDown, setIsMouseDown] = useState(false);
    return (
        <>
            {isMouseDown && draggingEventBox && <EventBox event={draggingEventBox} color={'green'} opacity={0.5} key={-1} />}

            <Box
                sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: isMouseDown ? 3 : 0 }}
                id="scheduleClickAddEventArea"
                // onClick={(clickEvent: any) => {
                //     if (clickEvent.target.id !== 'scheduleClickAddEventArea') return;
                //     const clickPos = clickEvent.offsetY;
                //     const time = (clickPos - 28) / timeHeightSignal.value;
                //     const hours = Math.floor(time);
                //     const minutes = (time - hours) * 60;

                //     const clickDate = new Date(
                //         props.displayDate.getFullYear(),
                //         props.displayDate.getMonth(),
                //         props.displayDate.getDate(),
                //         hours,
                //         minutes
                //     );

                //     return props.onClickSchedule(clickEvent, props.displayDate, clickDate);
                // }}
                onMouseDown={(clickEvent: any) => {
                    if (clickEvent.target.id !== 'scheduleClickAddEventArea') return;
                    draggingStartPos = clickEvent.offsetY;
                    setIsMouseDown(true);
                }}
                onMouseMove={(clickEvent: any) => {
                    if (isMouseDown === false) return;
                    draggingEndPos = clickEvent.offsetY;
                    console.log(draggingStartPos, draggingEndPos);

                    const startDraggingTime = (draggingStartPos - 28) / timeHeightSignal.value;
                    const startDragginghours = Math.floor(startDraggingTime);
                    const startDraggingminutes = (startDraggingTime - startDragginghours) * 60;
                    let startDate = new Date(
                        props.displayDate.getFullYear(),
                        props.displayDate.getMonth(),
                        props.displayDate.getDate(),
                        startDragginghours,
                        startDraggingminutes
                    );

                    const endDraggingTime = (draggingEndPos - 28) / timeHeightSignal.value;
                    const endDragginghours = Math.floor(endDraggingTime);
                    const endDraggingminutes = (endDraggingTime - endDragginghours) * 60;
                    let endDate = new Date(
                        props.displayDate.getFullYear(),
                        props.displayDate.getMonth(),
                        props.displayDate.getDate(),
                        endDragginghours,
                        endDraggingminutes
                    );

                    if (isAfter(startDate, endDate)) {
                        console.log('Start Date is after End Date');
                        // swap start and end dates
                        const temp = startDate;
                        startDate = endDate;
                        endDate = temp;
                    }

                    const draggingEventDisplay = props.onDraggingSchedule(startDate, endDate);
                    setTimeout(() => {
                        setDraggingEventBox(draggingEventDisplay);
                    }, 50);
                }}
                onMouseUp={(clickEvent: any) => {
                    if (isMouseDown === false) return;
                    setIsMouseDown(false);

                    const startDraggingTime = (draggingStartPos - 28) / timeHeightSignal.value;
                    const startDragginghours = Math.floor(startDraggingTime);
                    const startDraggingminutes = (startDraggingTime - startDragginghours) * 60;
                    let startDate = new Date(
                        props.displayDate.getFullYear(),
                        props.displayDate.getMonth(),
                        props.displayDate.getDate(),
                        startDragginghours,
                        startDraggingminutes
                    );

                    const endDraggingTime = (draggingEndPos - 28) / timeHeightSignal.value;
                    const endDragginghours = Math.floor(endDraggingTime);
                    const endDraggingminutes = (endDraggingTime - endDragginghours) * 60;
                    let endDate = new Date(
                        props.displayDate.getFullYear(),
                        props.displayDate.getMonth(),
                        props.displayDate.getDate(),
                        endDragginghours,
                        endDraggingminutes
                    );

                    // if the start and end times are less than 30 minutes apart, don't create an event
                    console.log(draggingEndPos - draggingStartPos);
                    if (Math.abs(draggingEndPos - draggingStartPos) < 25) {
                        draggingStartPos = 0;
                        draggingEndPos = 0;
                        return props.onClickSchedule(clickEvent, startDate);
                    }

                    if (isAfter(startDate, endDate)) {
                        console.log('Start Date is after End Date');
                        // swap start and end dates
                        const temp = startDate;
                        startDate = endDate;
                        endDate = temp;
                    }
                    draggingStartPos = 0;
                    draggingEndPos = 0;
                    return props.onClickSchedule(clickEvent, startDate, endDate);
                }}
            ></Box>
        </>
    );
}
