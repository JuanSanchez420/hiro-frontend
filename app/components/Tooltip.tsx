import React, { useState, ReactNode } from 'react';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
    content: string;
    children: ReactNode;
    position?: TooltipPosition;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top' }) => {
    const [isVisible, setIsVisible] = useState(false);

    const positionStyles: Record<TooltipPosition, string> = {
        top: '-top-8 left-1/2 -translate-x-1/2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-1',
        left: 'right-full top-1/2 -translate-y-1/2 mr-1',
        right: 'left-full top-1/2 -translate-y-1/2 ml-1',
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div
                    className={`absolute z-10 px-2 py-1 text-sm text-white bg-gray-800 rounded-md whitespace-nowrap ${positionStyles[position]}`}
                >
                    {content}
                </div>
            )}
        </div>
    );
};

export default Tooltip;