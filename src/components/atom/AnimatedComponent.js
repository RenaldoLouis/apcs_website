import React from 'react';
import { useInView } from 'react-intersection-observer';
import 'animate.css';

const AnimatedComponent = ({ children, animationClass, triggerOnce = true }) => {
    const { ref, inView } = useInView({
        triggerOnce: triggerOnce,
        threshold: 0,
    });

    return (
        <div
            ref={ref} className={`animate__animated ${inView ? animationClass : ''}`}
            style={{ visibility: inView ? "" : "hidden" }}
        >
            {children}
        </div>
    );
};

export default AnimatedComponent;
