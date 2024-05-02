import React, { useState } from "react";
import { Preload, Scroll, ScrollControls } from "@react-three/drei"
import { Canvas, useThree } from "@react-three/fiber"
import { Suspense } from "react"
import Slides from "./Slides"
import TextSlides from "./TextSlides"
import ArrowUp from "../../../assets/icons/ArrowUp.png"

const AnimationWWScroll = (props) => {
    const { setIsScrollDownAvailable } = props
    return (
        <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
            <Canvas gl={{ antialias: false }} dpr={[1, 1.5]}>
                <Suspense fallback={null}>
                    <ScrollControls horizontal pages={3} distance={1} style={{ overflow: "hidden !important" }}>
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