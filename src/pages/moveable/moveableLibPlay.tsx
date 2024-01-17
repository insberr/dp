import Moveable, { OnDrag, OnResize } from 'preact-moveable';
import Selecto from 'react-selecto';
import { useRef, useState } from 'preact/hooks';

import './moveableLibPlay.scss';
import { timeHeightSignal } from '../../storage/signals';
// import { Box } from '@mui/material';
// import { schedulesSignal } from '../../storage/scheduleSignal';
// import { differenceInMinutes, isSameDay } from 'date-fns';
// import EventBox from '../schedule/DaySchedule/eventBox';
// import { ScheduleEvent } from '../schedule/scheduleMain';

export default function MoveableLibPlay(props: { children: any }) {
    const divRef = useRef<HTMLDivElement>(null);

    const [targets, setTargets] = useState<Array<SVGElement | HTMLElement>>([]);
    // @ts-ignore idk
    const moveableRef = useRef<Moveable>(null);
    const selectoRef = useRef<Selecto>(null);
    // const cubes = [];

    // for (let i = 0; i < 30; ++i) {
    //     cubes.push(i);
    //     14;
    // }

    return (
        <>
            {/* <div className="container"> */}
            <Moveable
                ref={moveableRef}
                draggable={true}
                bounds={{ left: 0, top: 0, right: 0, bottom: 0, position: 'css' }}
                edge={[]}
                target={targets}
                onClickGroup={(e) => {
                    selectoRef.current!.clickTarget(e.inputEvent, e.inputTarget);
                }}
                onClick={(e) => {
                    console.log('Click: ', e);
                }}
                onDrag={(e) => {
                    e.target.style.top = e.top + 'px';
                    // e.target.style.transform = e.transform;
                }}
                onDragGroup={(e) => {
                    e.events.forEach((ev) => {
                        ev.target.style.transform = ev.transform;
                    });
                }}
                linePadding={10}
                throttleDrag={1}
                edgeDraggable={false}
                startDragRotate={0}
                throttleDragRotate={0}
                keepRatio={false}
                snappable={true}
                snapGridWidth={timeHeightSignal.value / 5}
                snapGridHeight={timeHeightSignal.value / 5}
                isDisplayGridGuidelines={false}
                elementSnapDirections={{ top: true, left: true, bottom: true, right: true, center: true, middle: true }}
                // snapThreshold={10}
                resizable={{
                    edge: ['n', 's'],
                    renderDirections: ['n', 's'],
                }}
                onResize={(e) => {
                    e.target.style.width = `${e.width}px`;
                    e.target.style.height = `${e.height}px`;
                    e.target.style.transform = e.drag.transform;
                }}
                onBound={(e) => {
                    console.log(e);
                }}
            ></Moveable>
            <Selecto
                ref={selectoRef}
                dragContainer={divRef.current}
                selectableTargets={['.selecto-area .eventBox']}
                hitRate={0}
                selectByClick={true}
                selectFromInside={false}
                toggleContinueSelect={['shift']}
                ratio={0}
                onDragStart={(e) => {
                    const moveable = moveableRef.current!;
                    const target = e.inputEvent.target;
                    if (moveable.isMoveableElement(target) || targets.some((t) => t === target || t.contains(target))) {
                        e.stop();
                    }
                }}
                onSelectEnd={(e) => {
                    const moveable = moveableRef.current!;
                    if (e.isDragStart) {
                        e.inputEvent.preventDefault();

                        moveable.waitToChangeTarget().then(() => {
                            moveable.dragStart(e.inputEvent);
                        });
                    }
                    setTargets(e.selected);
                }}
            ></Selecto>

            <div className="elements selecto-area" ref={divRef}>
                {/* {events.map((event: ScheduleEvent, i: number) => {
                        const durationMinutes = differenceInMinutes(event.endDate, event.startDate);

                        return (
                            <Box
                                className="cube"
                                key={i}
                                sx={{
                                    top: 50 * (event.startDate.getHours() + event.startDate.getMinutes() / 60),
                                    height: 50 * (durationMinutes / 60),
                                    backgroundColor: event.backgroundColor || 'salmon',
                                }}
                            >
                                {event.title}
                            </Box>
                        );
                    })} */}
                {props.children}
            </div>
            <div className="empty elements"></div>
            {/* </div> */}
        </>
    );
}
