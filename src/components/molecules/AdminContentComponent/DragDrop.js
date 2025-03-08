import { Collapse } from 'antd';
import update from 'immutability-helper';
import React, { useCallback, useEffect, useState } from "react";
import { DndCard } from "./DndCard";

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const DragDrop = ({ eachEvent, stage }) => {
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

    const [sessionItems, setSessionItems] = useState([
        {
            key: '1',
            label: 'This is session 1',
            children: <p>dummy</p>,
        },
        {
            key: '2',
            label: 'This is session 2',
            children: <p>dummy</p>,
        },
        {
            key: '3',
            label: 'This is session 3',
            children: <p>dummy</p>,
        },
        {
            key: '4',
            label: 'This is session 4',
            children: <p>dummy</p>,
        },
        {
            key: '5',
            label: 'This is session 5',
            children: <p>dummy</p>,
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
                {...card}
                index={index}
                moveCard={moveCard}
            />
        )
    }, [])


    const items = [
        {
            key: '1',
            label: 'This is session 1',
            children: <div>{cards.map((card, i) => renderCard(card, i))}</div>,
        },
        {
            key: '2',
            label: 'This is session 2',
            children: <p>{text}</p>,
        },
        {
            key: '3',
            label: 'This is session 3',
            children: <p>{text}</p>,
        },
        {
            key: '4',
            label: 'This is session 4',
            children: <p>{text}</p>,
        },
        {
            key: '5',
            label: 'This is session 5',
            children: <p>{text}</p>,
        },
    ];

    useEffect(() => {
        if (eachEvent.data) {
            let tempObj = {}
            tempObj = eachEvent.data[stage - 1]
            setCards(tempObj)
        }
    }, [eachEvent, eachEvent.data])

    useEffect(() => {
        if (cards?.sessionGroup) {
            let tempItems = []

            cards.sessionGroup.forEach((eachSession, index) => {
                let tempObj = {
                    key: index + 1,
                    label: `session ${index + 1} (${eachSession.totalDuration})`,
                    children: <div>{eachSession.records.map((card, i) => renderCard(card, i))}</div>,
                }
                tempItems.push(tempObj)
            })
            setSessionItems(tempItems)
        }
    }, [cards])

    return (
        <div className="flex-column">
            <h3 className="align-self-center">
                stage {stage}
            </h3>
            <Collapse style={{ minWidth: 350 }} items={sessionItems} />
        </div>
    )
}

export default DragDrop;