import React, { useMemo } from 'react';
import './ChristmasSprinkles.css';

const ChristmasSprinkles = () => {
    // Increased count to 600 for extensive coverage
    const sprinkleCount = 600;
    const snowflakes = ['❄', '❅', '❆'];

    const sprinkles = useMemo(() => {
        return Array.from({ length: sprinkleCount }).map((_, index) => {
            // 20% Gifts, 80% Snow
            const isGift = Math.random() > 0.80;

            let content;
            let size;
            let opacity = 0.8;

            if (isGift) {
                content = '🎁';
                size = Math.random() * 20 + 20;
                opacity = 1;
            } else {
                content = snowflakes[Math.floor(Math.random() * snowflakes.length)];
                const sizeRandom = Math.random();
                if (sizeRandom < 0.3) {
                    size = Math.random() * 10 + 20;
                    opacity = 0.9;
                } else if (sizeRandom < 0.7) {
                    size = Math.random() * 8 + 12;
                    opacity = 0.8;
                } else {
                    size = Math.random() * 6 + 8;
                    opacity = 0.6;
                }
            }

            const duration = Math.random() * 10 + 10;
            const delay = Math.random() * 20;
            const startTop = Math.random() * 100;

            const style = {
                left: `${Math.random() * 100}%`,
                top: `${startTop}%`,
                animationDuration: `${duration}s`,
                animationDelay: `-${delay}s`,
                fontSize: `${size}px`,
                opacity: opacity,
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
