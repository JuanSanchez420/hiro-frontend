import React from 'react';

interface PrettyPrintProps {
  data: unknown;
  indentLevel?: number;
  className?: string;
  style?: React.CSSProperties;
}

const PrettyPrint: React.FC<PrettyPrintProps> = ({
  data,
  indentLevel = 0,
  className = '',
  style = {},
}) => {
  // Default styles for each line
  const baseStyle: React.CSSProperties = {
    marginLeft: `${indentLevel * 20}px`,
    fontFamily: 'monospace',
  };

  // Base case: if not an object or array, just return the value
  if (typeof data !== 'object' || data === null) {
    return (
      <div className={className} style={{ ...baseStyle, ...style }}>
        {String(data)}
      </div>
    );
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return (
      <div className={className} style={style}>
        <div style={baseStyle}>[</div>
        {data.map((item, index) => (
          <PrettyPrint
            key={index}
            data={item}
            indentLevel={indentLevel + 1}
            className={className}
            style={style}
          />
        ))}
        <div style={baseStyle}>]</div>
      </div>
    );
  }

  // Handle objects
  return (
    <div className={className} style={style}>
      <div style={baseStyle}>{'{'}</div>
      {Object.entries(data).map(([key, value]) => (
        <div key={key}>
          {typeof value === 'object' && value !== null ? (
            <>
              <div style={{ marginLeft: `${(indentLevel + 1) * 20}px` }}>
                {`${key}:`}
              </div>
              <PrettyPrint
                data={value}
                indentLevel={indentLevel + 1}
                className={className}
                style={style}
              />
            </>
          ) : (
            <div style={{ marginLeft: `${(indentLevel + 1) * 20}px` }}>
              {`${key}: ${String(value)}`}
            </div>
          )}
        </div>
      ))}
      <div style={baseStyle}>{'}'}</div>
    </div>
  );
};

export default PrettyPrint;