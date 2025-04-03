import { useState, useEffect, useMemo, useRef } from 'react';
import { useTransition, a } from '@react-spring/web';

function Masonry({ data }) {
    const [columns, setColumns] = useState(2);

    useEffect(() => {
        const updateColumns = () => {
            // if (window.matchMedia('(min-width: 1500px)').matches) {
            //     setColumns(5);
            // } else if (window.matchMedia('(min-width: 1000px)').matches) {
            //     setColumns(4);
            // } else if (window.matchMedia('(min-width: 600px)').matches) {
            //     setColumns(3);
            // } else {
            //     setColumns(1); // Breakpoint for mobile devices
            // }
            if (window.matchMedia('(min-width: 600px)').matches) {
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
    const [heights, gridItems] = useMemo(() => {
        let heights = new Array(columns).fill(0);
        let gridItems = data.map((child) => {
            const column = heights.indexOf(Math.min(...heights));
            const columnSpacing = 15; // Adjust this value for more spacing between columns
            const spacing = 15; // Adjust this value for more spacing between rows
            const x = (width / columns) * column + columnSpacing * column; // Add spacing between columns
            const y = (heights[column] += child.height + spacing) - child.height;
            return { ...child, x, y, width: width / columns, height: child.height };
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

    // Render the grid
    return (
        <div ref={ref} className='masonry'
            style={{ height: Math.max(...heights) }}
        // style={{ height: "auto" }}
        >
            {transitions((style, item) => (
                <a.div key={item.id} style={{ ...style }}>
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
        </div>
    );
}

export default Masonry;
