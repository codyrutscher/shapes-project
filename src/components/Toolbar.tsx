import type { ShapeType, ConnectorType } from '../types';

interface ToolbarProps {
  diagramName: string;
  onDiagramNameChange: (name: string) => void;
  onAddShape: (type: ShapeType) => void;
  backgroundColor: string;
  onBackgroundColorChange: (color: string) => void;
  selectedConnectorType: ConnectorType;
  onConnectorTypeChange: (type: ConnectorType) => void;
  isConnecting: boolean;
  onToggleConnecting: () => void;
  onExportPDF: () => void;
  onSave: () => void;
  onClear: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  snapToGrid: boolean;
  onToggleSnap: () => void;
}

export function Toolbar({
  diagramName,
  onDiagramNameChange,
  onAddShape,
  backgroundColor,
  onBackgroundColorChange,
  selectedConnectorType,
  onConnectorTypeChange,
  isConnecting,
  onToggleConnecting,
  onExportPDF,
  onSave,
  onClear,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  zoom,
  onZoomChange,
  showGrid,
  onToggleGrid,
  snapToGrid,
  onToggleSnap,
}: ToolbarProps) {
  return (
    <div className="toolbar">
      <div className="toolbar-row">
        <div className="toolbar-section">
          <label>Diagram:</label>
          <input
            type="text"
            value={diagramName}
            onChange={(e) => onDiagramNameChange(e.target.value)}
            placeholder="Untitled Diagram"
          />
        </div>

        <div className="toolbar-section">
          <button onClick={onSave} title="Save diagram">💾 Save</button>
          <button onClick={onClear} className="danger-btn" title="Clear diagram">🗑️ Clear</button>
        </div>

        <div className="toolbar-section">
          <button onClick={onUndo} disabled={!canUndo} title="Undo (Ctrl+Z)">↩️</button>
          <button onClick={onRedo} disabled={!canRedo} title="Redo (Ctrl+Shift+Z)">↪️</button>
        </div>

        <div className="toolbar-section">
          <label>Zoom:</label>
          <button onClick={() => onZoomChange(Math.max(0.25, zoom - 0.25))}>−</button>
          <span className="zoom-value">{Math.round(zoom * 100)}%</span>
          <button onClick={() => onZoomChange(Math.min(2, zoom + 0.25))}>+</button>
        </div>

        <div className="toolbar-section">
          <button className={showGrid ? 'active' : ''} onClick={onToggleGrid} title="Toggle grid">
            ⊞ Grid
          </button>
          <button className={snapToGrid ? 'active' : ''} onClick={onToggleSnap} title="Snap to grid">
            🧲 Snap
          </button>
        </div>

        <div className="toolbar-section">
          <button className="export-btn" onClick={onExportPDF}>
            📄 Export PDF
          </button>
        </div>
      </div>

      <div className="toolbar-row">
        <div className="toolbar-section">
          <label>Shapes:</label>
          <button onClick={() => onAddShape('rectangle')} title="Rectangle">▭</button>
          <button onClick={() => onAddShape('circle')} title="Circle">●</button>
          <button onClick={() => onAddShape('triangle')} title="Triangle">▲</button>
          <button onClick={() => onAddShape('diamond')} title="Diamond">◆</button>
          <button onClick={() => onAddShape('hexagon')} title="Hexagon">⬡</button>
        </div>

        <div className="toolbar-section">
          <label>Background:</label>
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => onBackgroundColorChange(e.target.value)}
          />
        </div>

        <div className="toolbar-section">
          <label>Connector:</label>
          <select
            value={selectedConnectorType}
            onChange={(e) => onConnectorTypeChange(e.target.value as ConnectorType)}
          >
            <option value="arrow">Arrow →</option>
            <option value="line">Line —</option>
            <option value="dashed">Dashed - -</option>
            <option value="dotted">Dotted ···</option>
          </select>
          <button
            className={isConnecting ? 'active' : ''}
            onClick={onToggleConnecting}
          >
            {isConnecting ? '✕ Cancel' : '🔗 Connect'}
          </button>
        </div>
      </div>
    </div>
  );
}
