import React, { useState, useRef, useEffect } from 'react';

const EllipsisText = ({ quote, link }) => {
    const [isTruncated, setIsTruncated] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const quoteRef = useRef(null);

    useEffect(() => {
        const checkTruncation = () => {
            if (quoteRef.current) {
                setIsTruncated(quoteRef.current.scrollHeight > quoteRef.current.clientHeight);
            }
        };

        checkTruncation();
        window.addEventListener('resize', checkTruncation);
        return () => window.removeEventListener('resize', checkTruncation);
    }, [quote]);

    const handleOpenInstagram = () => {
        window.open(link, '_blank');

    }

    return (
        <div className="quote-container">
            <p
                ref={quoteRef}
                className={`quote-text ${isExpanded ? 'expanded' : ''}`}
            >
                {quote}
            </p>
            {isTruncated && !isExpanded && (
                // <button className="see-more-btn" onClick={() => setIsExpanded(true)}>
                <button className="see-more-btn" onClick={handleOpenInstagram}>
                    ... See More
                </button>
            )}
            {isExpanded && (
                <button className="see-less-btn" onClick={() => setIsExpanded(false)}>
                    See Less
                </button>
            )}
        </div>
    );
}

export default EllipsisText;