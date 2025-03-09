import { Card } from 'antd';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

export const DndCard = ({ id, name, index, moveCard, achievement, teacher, duration, sessionIndex }) => {
    const ref = useRef(null)
    const [{ handlerId }, drop] = useDrop({
        accept: 'card',
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover(item, monitor) {
            if (!ref.current) {
                return
            }
            const dragIndex = item.index
            const hoverIndex = index
            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return
            }
            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect()
            // Get vertical middle
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
            // Determine mouse position
            const clientOffset = monitor.getClientOffset()
            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top
            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%
            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return
            }
            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return
            }
            // Time to actually perform the action
            moveCard(dragIndex, hoverIndex, sessionIndex)
            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex
            item.sessionIndex = sessionIndex
        },
    })
    const [{ isDragging }, drag] = useDrag({
        type: 'card',
        item: () => {
            return { id, index, sessionIndex }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    })
    const opacity = isDragging ? 0.5 : 1
    drag(drop(ref))
    return (
        <Card
            className='mb-8 cardContainer mr-8'
            ref={ref}
            data-handler-id={handlerId}
            title={
                <div>
                    {achievement}
                </div>
            }
            // extra={<a href="#">More</a>}
            style={{ width: 300, opacity, height: 250 }}>
            {name}
            <br />
            <b>{teacher}</b>
            <br />
            <b>{duration}</b>
        </Card >
    )
}
