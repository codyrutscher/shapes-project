import { useState, useRef, useEffect } from 'react';
import type { Shape } from '../types';

interface ShapeComponentProps {
  shape: Shape;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Shape>) => void;
  onDelete: () => void;
  isConnecting: boolean;
  onConnectClick: () => void;
}

export function ShapeComponent({
  shape,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  isConnecting,
  onConnectClick,
}: ShapeComponentProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const shapeRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isConnecting) {
      onConnectClick();
      return;
    }
    onSelect();
    const rect = shapeRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setIsDragging(true);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && shapeRef.current) {
        const canvas = shapeRef.current.closest('.canvas');
        if (canvas) {
          const canvasRect = canvas.getBoundingClientRect();
          const scale = parseFloat(getComputedStyle(canvas).transform.split(',')[0].replace('matrix(', '')) || 1;
          const newX = (e.clientX - canvasRect.left) / scale - dragOffset.x;
          const newY = (e.clientY - canvasRect.top) / scale - dragOffset.y;
          onUpdate({ x: Math.max(0, newX), y: Math.max(0, newY) });
        }
      }
      if (isResizing && shapeRef.current) {
        const rect = shapeRef.current.getBoundingClientRect();
        const canvas = shapeRef.current.closest('.canvas');
        const scale = canvas ? parseFloat(getComputedStyle(canvas).transform.split(',')[0].replace('matrix(', '')) || 1 : 1;
        const newWidth = Math.max(50, (e.clientX - rect.left) / scale);
        const newHeight = Math.max(50, (e.clientY - rect.top) / scale);
        onUpdate({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, onUpdate]);

  const getShapeStyle = (): React.CSSProperties => ({
    position: 'absolute',
    left: shape.x,
    top: shape.y,
    width: shape.width,
    height: shape.height,
    cursor: isConnecting ? 'crosshair' : 'move',
  });

  // SVG-based shapes for triangle, diamond, hexagon
  if (shape.type === 'triangle' || shape.type === 'diamond' || shape.type === 'hexagon') {
    const getPoints = () => {
      const w = shape.width;
      const h = shape.height;
      switch (shape.type) {
        case 'triangle':
          return `${w / 2},0 ${w},${h} 0,${h}`;
        case 'diamond':
          return `${w / 2},0 ${w},${h / 2} ${w / 2},${h} 0,${h / 2}`;
        case 'hexagon':
          const hw = w / 4;
          return `${hw},0 ${w - hw},0 ${w},${h / 2} ${w - hw},${h} ${hw},${h} 0,${h / 2}`;
        default:
          return '';
      }
    };

    const getTextY = () => {
      switch (shape.type) {
        case 'triangle':
          return shape.height * 0.65;
        default:
          return shape.height / 2;
      }
    };

    return (
      <div ref={shapeRef} style={getShapeStyle()} onMouseDown={handleMouseDown} onClick={handleClick}>
        <svg width={shape.width} height={shape.height} style={{ overflow: 'visible' }}>
          <polygon
            points={getPoints()}
            fill={shape.color}
            stroke={isSelected ? '#007bff' : '#333'}
            strokeWidth={isSelected ? 3 : 2}
          />
          <text
            x={shape.width / 2}
            y={getTextY()}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={shape.textStyle.color}
            fontFamily={shape.textStyle.fontFamily}
            fontSize={shape.textStyle.fontSize}
          >
            {shape.text}
          </text>
        </svg>
        {isSelected && (
          <>
            <div className="resize-handle" onMouseDown={handleResizeMouseDown} />
            <button className="delete-btn" onClick={onDelete}>×</button>
          </>
        )}
      </div>
    );
  }

  // Rectangle and circle
  const rectStyle: React.CSSProperties = {
    ...getShapeStyle(),
    backgroundColor: shape.color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '8px',
    boxSizing: 'border-box',
    border: isSelected ? '3px solid #007bff' : '2px solid #333',
    overflow: 'hidden',
    borderRadius: shape.type === 'circle' ? '50%' : '4px',
  };

  return (
    <div ref={shapeRef} style={rectStyle} onMouseDown={handleMouseDown} onClick={handleClick}>
      <span
        style={{
          fontFamily: shape.textStyle.fontFamily,
          fontSize: shape.textStyle.fontSize,
          color: shape.textStyle.color,
          wordBreak: 'break-word',
        }}
      >
        {shape.text}
      </span>
      {isSelected && (
        <>
          <div className="resize-handle" onMouseDown={handleResizeMouseDown} />
          <button className="delete-btn" onClick={onDelete}>×</button>
        </>
      )}
    </div>
  );
}
