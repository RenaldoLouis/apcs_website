import React, { useCallback, useEffect, useState } from "react";
import update from 'immutability-helper'
import { DndCard } from "./DndCard";

const style = {
    // width: 400,
}

const DragDrop = ({ eachEvent, session }) => {
    const [cards, setCards] = useState([
        {
            id: 1
        },
        {
            id: 2
        },
        {
            id: 3
        },
    ])

    useEffect(() => {
        if (eachEvent.data) {
            let tempObj = {}
            if (session === 1) {
                tempObj = eachEvent.data[0]
                setCards(tempObj)
            } else {
                tempObj = eachEvent.data[1]
                setCards(tempObj)
            }
        }
    }, [eachEvent, eachEvent.data])

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
                text={card.name}
                achievement={card.achievement}
                moveCard={moveCard}
                teacher={card.teacher}
            />
        )
    }, [])

    return (
        <div className="flex-column">
            <h3 className="align-self-center">
                stage {session}
            </h3>
            <div style={style}>{cards.map((card, i) => renderCard(card, i))}</div>
        </div>
    )
}

export default DragDrop;