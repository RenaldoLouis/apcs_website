import React, { useCallback, useState } from "react";
import update from 'immutability-helper'
import { DndCard } from "./DndCard";

const style = {
    width: 400,
}

const DragDrop = () => {
    const [cards, setCards] = useState([
        {
            id: 1,
            text: 'Write a cool JS library',
        },
        {
            id: 2,
            text: 'Make it generic enough',
        },
        {
            id: 3,
            text: 'Write README',
        },
        {
            id: 4,
            text: 'Create some examples',
        },
        {
            id: 5,
            text: 'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
        },
        {
            id: 6,
            text: '???',
        },
        {
            id: 7,
            text: 'PROFIT',
        },
    ])
    const moveCard = useCallback((dragIndex, hoverIndex) => {
        setCards((prevCards) =>
            update(prevCards, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, prevCards[dragIndex]],
                ],
            }),
        )
    }, [])
    const renderCard = useCallback((card, index) => {
        return (
            <DndCard
                key={card.id}
                index={index}
                id={card.id}
                text={card.text}
                moveCard={moveCard}
            />
        )
    }, [])

    return (
        <>
            <div style={style}>{cards.map((card, i) => renderCard(card, i))}</div>
        </>
    )
}

export default DragDrop;