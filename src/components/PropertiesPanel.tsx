import type { Shape } from '../types';

interface PropertiesPanelProps {
  selectedShape: Shape | null;
  onUpdateShape: (updates: Partial<Shape>) => void;
  onDuplicate: () => void;
}

const fontFamilies = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Verdana',
  'Courier New',
  'Comic Sans MS',
];

export function PropertiesPanel({ selectedShape, onUpdateShape, onDuplicate }: PropertiesPanelProps) {
  if (!selectedShape) {
    return (
      <div className="properties-panel">
        <h3>Properties</h3>
        <p className="no-selection">Select a shape to edit its properties</p>
        <div className="shortcuts-help">
          <h4>Keyboard Shortcuts</h4>
          <ul>
            <li><kbd>Ctrl</kbd>+<kbd>Z</kbd> Undo</li>
            <li><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd> Redo</li>
            <li><kbd>Ctrl</kbd>+<kbd>D</kbd> Duplicate</li>
            <li><kbd>Delete</kbd> Remove selected</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="properties-panel">
      <h3>Shape Properties</h3>
      
      <div className="property-group">
        <button className="duplicate-btn" onClick={onDuplicate}>
          📋 Duplicate Shape
        </button>
      </div>

      <div className="property-group">
        <label>Shape Color:</label>
        <input
          type="color"
          value={selectedShape.color}
          onChange={(e) => onUpdateShape({ color: e.target.value })}
        />
      </div>

      <div className="property-row">
        <div className="property-group half">
          <label>Width:</label>
          <input
            type="number"
            value={Math.round(selectedShape.width)}
            min={50}
            onChange={(e) => onUpdateShape({ width: Number(e.target.value) })}
          />
        </div>
        <div className="property-group half">
          <label>Height:</label>
          <input
            type="number"
            value={Math.round(selectedShape.height)}
            min={50}
            onChange={(e) => onUpdateShape({ height: Number(e.target.value) })}
          />
        </div>
      </div>

      <div className="property-row">
        <div className="property-group half">
          <label>X:</label>
          <input
            type="number"
            value={Math.round(selectedShape.x)}
            min={0}
            onChange={(e) => onUpdateShape({ x: Number(e.target.value) })}
          />
        </div>
        <div className="property-group half">
          <label>Y:</label>
          <input
            type="number"
            value={Math.round(selectedShape.y)}
            min={0}
            onChange={(e) => onUpdateShape({ y: Number(e.target.value) })}
          />
        </div>
      </div>

      <h3>Text Properties</h3>

      <div className="property-group">
        <label>Text:</label>
        <textarea
          value={selectedShape.text}
          onChange={(e) => onUpdateShape({ text: e.target.value })}
          placeholder="Enter text..."
          rows={3}
        />
      </div>

      <div className="property-group">
        <label>Font Family:</label>
        <select
          value={selectedShape.textStyle.fontFamily}
          onChange={(e) =>
            onUpdateShape({
              textStyle: { ...selectedShape.textStyle, fontFamily: e.target.value },
            })
          }
        >
          {fontFamilies.map((font) => (
            <option key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </option>
          ))}
        </select>
      </div>

      <div className="property-group">
        <label>Font Size:</label>
        <input
          type="number"
          value={selectedShape.textStyle.fontSize}
          min={8}
          max={72}
          onChange={(e) =>
            onUpdateShape({
              textStyle: { ...selectedShape.textStyle, fontSize: Number(e.target.value) },
            })
          }
        />
      </div>

      <div className="property-group">
        <label>Text Color:</label>
        <input
          type="color"
          value={selectedShape.textStyle.color}
          onChange={(e) =>
            onUpdateShape({
              textStyle: { ...selectedShape.textStyle, color: e.target.value },
            })
          }
        />
      </div>
    </div>
  );
}
