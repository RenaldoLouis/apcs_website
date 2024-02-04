/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";

const Galery = () => {
    const [track, setTrack] = useState()

    useEffect(() => {
        const tempTrack = document.getElementById("image-track");
        if (tempTrack) {
            setTrack(tempTrack)
        }
    }, [])

    const handleOnDown = e => track.dataset.mouseDownAt = e.clientX;

    const handleOnUp = () => {
        track.dataset.mouseDownAt = "0";
        track.dataset.prevPercentage = track.dataset.percentage;
    }

    const handleOnMove = e => {
        if (track.dataset.mouseDownAt === "0") return;

        const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX,
            maxDelta = window.innerWidth / 2;

        const percentage = (mouseDelta / maxDelta) * -100,
            nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + percentage,
            nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

        track.dataset.percentage = nextPercentage;

        track.animate({
            transform: `translate(${nextPercentage}%, 0%)`
        }, { duration: 1200, fill: "forwards" });

        for (const image of track.getElementsByClassName("image")) {
            image.animate({
                objectPosition: `${100 + nextPercentage}% center`
            }, { duration: 1200, fill: "forwards" });
        }
    }

    /* -- Had to add extra lines for touch events -- */

    window.onmousedown = e => handleOnDown(e);

    window.ontouchstart = e => handleOnDown(e.touches[0]);

    window.onmouseup = e => handleOnUp(e);

    window.ontouchend = e => handleOnUp(e.touches[0]);

    window.onmousemove = e => handleOnMove(e);

    window.ontouchmove = e => handleOnMove(e.touches[0]);
    return (
        <section className="image-gallery">
            <img src='https://images.unsplash.com/photo-1661335996027-0a65af891c27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjI5OTQwNDU&ixlib=rb-1.2.1&q=80&w=400' alt='' />
            <img src='https://images.unsplash.com/photo-1661189626525-3d7ec5d3087c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjI5OTQwNDU&ixlib=rb-1.2.1&q=80&w=400' alt='' />
            <img src='https://images.unsplash.com/photo-1660628504006-9416dd2a411f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjI5OTQwNDU&ixlib=rb-1.2.1&q=80&w=400' alt='' />
            <img src='https://images.unsplash.com/photo-1662441896128-691f7ac658ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjI5OTQwNDU&ixlib=rb-1.2.1&q=80&w=400' alt='' />
            <img src='https://images.unsplash.com/photo-1661880374687-4ce390284f86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjI5OTQwNDU&ixlib=rb-1.2.1&q=80&w=400' alt='' />
            <img src='https://images.unsplash.com/photo-1661691111071-42c262ca061e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjI5OTQwNDU&ixlib=rb-1.2.1&q=80&w=400' alt='' />
            <img src='https://images.unsplash.com/photo-1696644542260-c0960b3b7233?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2OTk0NTAwMTF8&ixlib=rb-4.0.3&q=80&w=400' alt='' />
            <img src='https://images.unsplash.com/photo-1661435805196-81136edfa297?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjI5OTQxMTQ&ixlib=rb-1.2.1&q=80&w=400' alt='' />
            <img src='https://images.unsplash.com/photo-1660584658489-a15f806f463c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjI5OTQxMTQ&ixlib=rb-1.2.1&q=80&w=400' alt='' />
        </section>
    )
}

export default Galery;