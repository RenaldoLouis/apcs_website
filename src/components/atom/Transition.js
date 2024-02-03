import { motion } from "framer-motion";

const Transition = (props) => {
    const { children } = props
    return (
        <>
            {children}
            <motion.div
                key="slideInMotion"
                className="slide-in"
                initial={{ scaleY: 1 }}  // Start with scaleY: 1 (fully visible)
                animate={{ scaleY: 0 }}  // Animate to scaleY: 0 (hidden)
                exit={{ scaleY: 1 }}     // Exit animation, if needed
                transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.div
                key="slideOutMotion"
                className="slide-out"
                initial={{ scaleY: 1 }}
                animate={{ scaleY: 0 }}
                exit={{ scaleY: 0 }}
                transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
            />

        </>
    )
}

export default Transition;
