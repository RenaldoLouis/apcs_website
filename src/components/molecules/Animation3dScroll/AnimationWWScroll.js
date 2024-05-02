import React from "react";
import { Preload, Scroll, ScrollControls } from "@react-three/drei"
import { Canvas, useThree } from "@react-three/fiber"
import { Suspense } from "react"
import Slides from "./Slides"
import TextSlides from "./TextSlides"
const AnimationWWScroll = () => {

    return (
        <div style={{ height: "100vh" }}>
            <Canvas gl={{ antialias: false }} dpr={[1, 1.5]}>
                <Suspense fallback={null}>
                    <ScrollControls infinite horizontal pages={3} distance={1} style={{ overflow: "hidden !important" }}>
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
        </div>
    )
}

export default AnimationWWScroll;