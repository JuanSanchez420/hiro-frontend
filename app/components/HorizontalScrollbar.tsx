import React from 'react';

const HorizontalScrollBar = () => {
  // Sample content array - you can replace this with your own data
  const items = [
    { id: 1, text: 'Item 1' },
    { id: 2, text: 'Item 2' },
    { id: 3, text: 'Item 3' },
    { id: 4, text: 'Item 4' },
    { id: 5, text: 'Item 5' },
    { id: 6, text: 'Item 6' },
    { id: 7, text: 'Item 7' },
    { id: 8, text: 'Item 8' },
    { id: 9, text: 'Item 9' },
    { id: 10, text: 'Item 10' },
    { id: 11, text: 'Item 11' },
    { id: 12, text: 'Item 12' },
  ];

  return (
    <div className="w-full overflow-hidden">
      <div 
        className="
          flex
          overflow-x-auto
          space-x-4
          p-4
          whitespace-nowrap
        "
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="
              flex-shrink-0
              flex
              items-center
              justify-center
            "
          >
            <span className="text-gray-800 font-medium">
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalScrollBar;