import { useState, useEffect, useMemo, useRef } from 'react';
import { useTransition, a } from '@react-spring/web';

function Masonry({ data }) {
    const [columns, setColumns] = useState(2);
    const GAP = 20; // Adjust spacing between columns and rows
    const [selectedImage, setSelectedImage] = useState(null); // Track clicked image

    useEffect(() => {
        const updateColumns = () => {
            if (window.matchMedia('(min-width: 1200px)').matches) {
                setColumns(3);
            } else {
                setColumns(2); // Breakpoint for mobile devices
            }
        };

        updateColumns();
        window.addEventListener('resize', updateColumns);
        return () => window.removeEventListener('resize', updateColumns);
    }, []);

    const ref = useRef();
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            if (ref.current) {
                setWidth(ref.current.offsetWidth);
            }
        };

        handleResize(); // Set initial width
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [ref]);

    // for some reason old code /2 the height
    // Compute item positions based on aspect ratios
    const [heights, gridItems] = useMemo(() => {
        let heights = new Array(columns).fill(0);
        let columnWidth = (width - (columns - 1) * GAP) / columns; // Include gap in width calculation

        let gridItems = data.map((item) => {
            const column = heights.indexOf(Math.min(...heights));
            const itemWidth = columnWidth;
            const itemHeight = (item.aspectRatio * itemWidth) - 15;
            const x = column * (itemWidth + GAP);
            const y = heights[column];

            heights[column] += itemHeight + GAP; // Include row gap in height calculation

            return { ...item, x, y, width: itemWidth, height: itemHeight };
        });

        return [heights, gridItems];
    }, [columns, data, width]);


    const transitions = useTransition(gridItems, {
        keys: (item) => item.id, // Use a unique key based on the id
        from: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 0 }),
        enter: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 1 }),
        update: ({ x, y, width, height }) => ({ x, y, width, height }),
        leave: { height: 0, opacity: 0 },
        config: { mass: 5, tension: 500, friction: 100 },
        trail: 25,
    });

    //  Close modal when clicking outside or pressing ESC
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setSelectedImage(null);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div ref={ref} className='masonry'
            style={{ height: Math.max(...heights) }}
        >
            {transitions((style, item) => (
                <a.div
                    key={item.id}
                    style={{ ...style }}
                    onClick={() => setSelectedImage(item.image)} // Open modal on click
                >
                    <div
                        style={{
                            backgroundColor: '#ffffff', // Set background if needed
                            width: '100%',
                            height: '100%',
                            // backgroundImage: `url(${item.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <img style={{ width: "100%", height: "auto" }} src={item.image} alt="Background" />
                    </div>
                    {/* <div style={{ color: "white" }}>
                        asdas{item.id}
                    </div> */}
                </a.div>
            ))}
            {selectedImage && (
                <div
                    className="modal-overlay"
                    onClick={() => setSelectedImage(null)}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                        cursor: "pointer",
                    }}
                >
                    <img
                        src={selectedImage}
                        alt="Fullscreen"
                        style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            borderRadius: "10px",
                            boxShadow: "0 10px 30px rgba(255, 255, 255, 0.2)",
                        }}
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
                    />
                </div>
            )}
        </div>
    );
}

export default Masonry;
