import Moveable, { OnDrag, OnResize, OnRotate, OnScale } from 'preact-moveable';
import { useRef } from 'preact/hooks';

export default function MoveableLibPlay() {
    const divRef = useRef<HTMLDivElement>(null);
    return (
        <>
            <div ref={divRef} className="target">
                Target
            </div>
            <Moveable
                target={divRef}
                origin={true}
                /* Resize, Scale event edges */
                edge={true}
                /* draggable */
                draggable={false}
                throttleDrag={0}
                onDragStart={({ target, clientX, clientY }) => {
                    console.log('onDragStart', target);
                }}
                onDrag={({ target, beforeDelta, beforeDist, left, top, right, bottom, delta, dist, transform, clientX, clientY }: OnDrag) => {
                    console.log('onDrag left, top', left, top);
                    // target!.style.left = `${left}px`;
                    // target!.style.top = `${top}px`;
                    console.log('onDrag translate', dist);
                    target!.style.transform = transform;
                }}
                onDragEnd={({ target, isDrag, clientX, clientY }) => {
                    console.log('onDragEnd', target, isDrag);
                }}
                /* When resize or scale, keeps a ratio of the width, height. */
                keepRatio={true}
                resizable={true}
                onResize={({ target, width, height, dist, delta, direction, clientX, clientY }: OnResize) => {}}
            />
        </>
    );
}
