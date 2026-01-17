import { forwardRef } from 'react';
import type { Shape, Connector } from '../types';
import { ShapeComponent } from './ShapeComponent';
import { ConnectorLine } from './ConnectorLine';

interface CanvasProps {
  shapes: Shape[];
  connectors: Connector[];
  backgroundColor: string;
  selectedShapeId: string | null;
  selectedConnectorId: string | null;
  onSelectShape: (id: string | null) => void;
  onSelectConnector: (id: string | null) => void;
  onUpdateShape: (id: string, updates: Partial<Shape>) => void;
  onDeleteShape: (id: string) => void;
  onDeleteConnector: (id: string) => void;
  isConnecting: boolean;
  onShapeConnectClick: (shapeId: string) => void;
  zoom: number;
  showGrid: boolean;
}

export const Canvas = forwardRef<HTMLDivElement, CanvasProps>(
  (
    {
      shapes,
      connectors,
      backgroundColor,
      selectedShapeId,
      selectedConnectorId,
      onSelectShape,
      onSelectConnector,
      onUpdateShape,
      onDeleteShape,
      onDeleteConnector,
      isConnecting,
      onShapeConnectClick,
      zoom,
      showGrid,
    },
    ref
  ) => {
    const gridStyle = showGrid
      ? {
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
          `,
          backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
        }
      : {};

    return (
      <div className="canvas-container">
        <div
          ref={ref}
          className="canvas"
          style={{
            backgroundColor,
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
            ...gridStyle,
          }}
          onClick={() => {
            onSelectShape(null);
            onSelectConnector(null);
          }}
        >
          <svg className="connectors-layer">
            {connectors.map((connector) => (
              <ConnectorLine
                key={connector.id}
                connector={connector}
                shapes={shapes}
                isSelected={selectedConnectorId === connector.id}
                onSelect={() => onSelectConnector(connector.id)}
                onDelete={() => onDeleteConnector(connector.id)}
              />
            ))}
          </svg>
          {shapes.map((shape) => (
            <ShapeComponent
              key={shape.id}
              shape={shape}
              isSelected={selectedShapeId === shape.id}
              onSelect={() => onSelectShape(shape.id)}
              onUpdate={(updates) => onUpdateShape(shape.id, updates)}
              onDelete={() => onDeleteShape(shape.id)}
              isConnecting={isConnecting}
              onConnectClick={() => onShapeConnectClick(shape.id)}
            />
          ))}
        </div>
      </div>
    );
  }
);

Canvas.displayName = 'Canvas';
