import type { Connector, Shape } from '../types';

interface ConnectorLineProps {
  connector: Connector;
  shapes: Shape[];
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export function ConnectorLine({
  connector,
  shapes,
  isSelected,
  onSelect,
  onDelete,
}: ConnectorLineProps) {
  const fromShape = shapes.find((s) => s.id === connector.fromShapeId);
  const toShape = shapes.find((s) => s.id === connector.toShapeId);

  if (!fromShape || !toShape) return null;

  const fromX = fromShape.x + fromShape.width / 2;
  const fromY = fromShape.y + fromShape.height / 2;
  const toX = toShape.x + toShape.width / 2;
  const toY = toShape.y + toShape.height / 2;

  const getStrokeDasharray = () => {
    switch (connector.type) {
      case 'dashed':
        return '10,5';
      case 'dotted':
        return '3,3';
      default:
        return 'none';
    }
  };

  const angle = Math.atan2(toY - fromY, toX - fromX);
  const arrowLength = 15;
  const arrowX = toX - arrowLength * Math.cos(angle);
  const arrowY = toY - arrowLength * Math.sin(angle);

  return (
    <g onClick={onSelect} style={{ cursor: 'pointer' }}>
      <line
        x1={fromX}
        y1={fromY}
        x2={connector.type === 'arrow' ? arrowX : toX}
        y2={connector.type === 'arrow' ? arrowY : toY}
        stroke={isSelected ? '#007bff' : connector.color}
        strokeWidth={isSelected ? 4 : 2}
        strokeDasharray={getStrokeDasharray()}
      />
      {connector.type === 'arrow' && (
        <polygon
          points={`
            ${toX},${toY}
            ${toX - arrowLength * Math.cos(angle - Math.PI / 6)},${toY - arrowLength * Math.sin(angle - Math.PI / 6)}
            ${toX - arrowLength * Math.cos(angle + Math.PI / 6)},${toY - arrowLength * Math.sin(angle + Math.PI / 6)}
          `}
          fill={isSelected ? '#007bff' : connector.color}
        />
      )}
      {isSelected && (
        <foreignObject x={(fromX + toX) / 2 - 12} y={(fromY + toY) / 2 - 12} width={24} height={24}>
          <button
            className="connector-delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            ×
          </button>
        </foreignObject>
      )}
    </g>
  );
}
