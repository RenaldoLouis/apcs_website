import React from 'react';
import { useInView } from 'react-intersection-observer';
import 'animate.css';

const AnimatedComponent = ({ children, animationClass }) => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0,
    });

    return (
        <div ref={ref} className={`animate__animated ${inView ? animationClass : ''}`}>
            {children}
        </div>
    );
};

export default AnimatedComponent;
