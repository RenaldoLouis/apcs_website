import React, { useEffect, useRef, useState } from "react";
import { Preload, Scroll, ScrollControls } from "@react-three/drei"
import { Canvas, useThree } from "@react-three/fiber"
import { Suspense } from "react"
import Slides from "./Slides"
import TextSlides from "./TextSlides"
import ArrowUp from "../../../assets/icons/ArrowUp.png"

const AnimationWWScroll = (props) => {
    const { setIsScrollDownAvailable } = props

    useEffect(() => {
        setTimeout(() => {
            const animationScrollContainer = document.getElementById('animationScrollContainer');
            if (animationScrollContainer) {
                let child = animationScrollContainer.children
                let child2 = child[0]?.children[0]?.children
                let child3 = child2[1]
                if (child3) {
                    child3.style.overscrollBehavior = "contain"
                    child3.style.overflow = "hidden auto"
                }
            }
        }, 500);
    }, [])

    return (
        <div id="animationScrollContainer" style={{ height: "100vh", width: "100vw", position: "relative", overscrollBehaviorX: 'contain !important', overscrollBehaviorY: "contain !important" }}>
            <Canvas gl={{ antialias: false }} dpr={[1, 1.5]}>
                <Suspense fallback={null}>
                    <ScrollControls infinite horizontal pages={3} distance={1}>
                        <Scroll>
                            <Slides />
                        </Scroll>
                        <Scroll html>
                            <TextSlides />
                        </Scroll>
                    </ScrollControls>
                    <Preload />
                </Suspense>
            </Canvas>
            <div style={{ position: "absolute", left: "50%", top: "90%", color: 'black' }}>
                <img src={ArrowUp} style={{ width: 54, height: 54, rotate: "180deg" }} alt="ArrowUp" />
            </div>
        </div>
    )
}

export default AnimationWWScroll;