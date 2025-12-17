import React, { useMemo } from 'react';
import './ChristmasSprinkles.css';

const ChristmasSprinkles = () => {
    const sprinkleCount = 75;
    const snowflakes = ['❄', '❅', '❆'];

    const sprinkles = useMemo(() => {
        return Array.from({ length: sprinkleCount }).map((_, index) => {
            // 15% Gifts, 85% Snow
            const isGift = Math.random() > 0.85;

            let content;
            let size;
            let opacity = 0.8;

            if (isGift) {
                content = '🎁';
                size = Math.random() * 20 + 20; // 20-40px
                opacity = 1;
            } else {
                content = snowflakes[Math.floor(Math.random() * snowflakes.length)];

                // Size distribution logic
                const sizeRandom = Math.random();
                if (sizeRandom < 0.3) {
                    // Large (Foreground)
                    size = Math.random() * 10 + 20; // 20-30px font size
                    opacity = 0.9;
                } else if (sizeRandom < 0.7) {
                    // Medium
                    size = Math.random() * 8 + 12; // 12-20px
                    opacity = 0.8;
                } else {
                    // Small (Background)
                    size = Math.random() * 6 + 8; // 8-14px
                    opacity = 0.6;
                }
            }

            const duration = Math.random() * 5 + 5;
            const delay = Math.random() * 5;

            const style = {
                left: `${Math.random() * 100}vw`,
                animationDuration: `${duration}s`,
                animationDelay: `-${delay}s`,
                fontSize: `${size}px`,
                opacity: opacity,
                // Removed explicit width/height to let font-size control it
            };

            return (
                <div
                    key={index}
                    className={`sprinkle ${isGift ? 'type-gift' : 'type-snow'}`}
                    style={style}
                >
                    {content}
                </div>
            );
        });
    }, []);

    return (
        <div className="christmas-sprinkles-container">
            {sprinkles}
        </div>
    );
};

export default ChristmasSprinkles;
