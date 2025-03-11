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
            label: 'Session 1',
            children: <p>dummy</p>,
        },
        {
            key: '2',
            label: 'Session 2',
            children: <p>dummy</p>,
        },
        {
            key: '3',
            label: 'Session 3',
            children: <p>dummy</p>,
        },
        {
            key: '4',
            label: 'Session 4',
            children: <p>dummy</p>,
        },
        {
            key: '5',
            label: 'Session 5',
            children: <p>dummy</p>,
        },
    ])

    const moveCard = useCallback((dragIndex, hoverIndex, sessionIndex) => {
        setCards((prevCards) => {
            const group = prevCards.sessionGroup[sessionIndex];
            const data = group.records;
            const updatedRecords = update(data, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, data[dragIndex]],
                ],
            });
            return {
                ...prevCards,
                sessionGroup: prevCards.sessionGroup.map((grp, idx) =>
                    idx === sessionIndex ? { ...grp, records: updatedRecords } : grp
                ),
            };
        });
    }, [])

    const renderCard = useCallback((card, index, sessionIndex) => {
        return (
            <DndCard
                {...card}
                index={index}
                sessionIndex={sessionIndex}
                moveCard={moveCard}
            />
        )
    }, [])

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

            cards.sessionGroup.forEach((eachSession, sessionIndex) => {
                let tempObj = {
                    key: sessionIndex + 1,
                    label: `Session ${sessionIndex + 1} (${eachSession.totalDuration})`,
                    children: <div>{eachSession.records.map((card, i) => renderCard(card, i, sessionIndex))}</div>,
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
            <Collapse style={{ minWidth: 350 }} accordion items={sessionItems} />
        </div>
    )
}

export default DragDrop;