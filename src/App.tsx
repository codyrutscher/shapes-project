import { useState, useRef, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import type { Shape, Connector, ShapeType, ConnectorType, HistoryState } from './types';
import { Toolbar } from './components/Toolbar';
import { Canvas } from './components/Canvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { HomePage } from './components/HomePage';
import './App.css';

const STORAGE_KEY = 'process-flow-diagram';
const MAX_HISTORY = 50;

function App() {
  const [showEditor, setShowEditor] = useState(false);
  const [diagramName, setDiagramName] = useState('Untitled Diagram');
  const [backgroundColor, setBackgroundColor] = useState('#f5f5f5');
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [selectedConnectorId, setSelectedConnectorId] = useState<string | null>(null);
  const [selectedConnectorType, setSelectedConnectorType] = useState<ConnectorType>('arrow');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingFromId, setConnectingFromId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoRedo = useRef(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Load diagram from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setDiagramName(data.name || 'Untitled Diagram');
        setBackgroundColor(data.backgroundColor || '#f5f5f5');
        setShapes(data.shapes || []);
        setConnectors(data.connectors || []);
      } catch (e) {
        console.error('Failed to load diagram:', e);
      }
    }
  }, []);

  // Save to history when shapes/connectors change
  useEffect(() => {
    if (isUndoRedo.current) {
      isUndoRedo.current = false;
      return;
    }
    const newState: HistoryState = { shapes, connectors };
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newState);
      if (newHistory.length > MAX_HISTORY) newHistory.shift();
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, MAX_HISTORY - 1));
  }, [shapes, connectors]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      isUndoRedo.current = true;
      const prevState = history[historyIndex - 1];
      setShapes(prevState.shapes);
      setConnectors(prevState.connectors);
      setHistoryIndex(historyIndex - 1);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isUndoRedo.current = true;
      const nextState = history[historyIndex + 1];
      setShapes(nextState.shapes);
      setConnectors(nextState.connectors);
      setHistoryIndex(historyIndex + 1);
    }
  }, [history, historyIndex]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'd' && selectedShapeId) {
        e.preventDefault();
        duplicateShape(selectedShapeId);
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedShapeId) deleteShape(selectedShapeId);
        if (selectedConnectorId) deleteConnector(selectedConnectorId);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, selectedShapeId, selectedConnectorId]);

  const saveDiagram = () => {
    const data = { name: diagramName, backgroundColor, shapes, connectors };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const clearDiagram = () => {
    if (confirm('Are you sure you want to clear the diagram?')) {
      setShapes([]);
      setConnectors([]);
      setSelectedShapeId(null);
      setSelectedConnectorId(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const snapPosition = (value: number) => {
    if (!snapToGrid) return value;
    const gridSize = 20;
    return Math.round(value / gridSize) * gridSize;
  };

  const addShape = (type: ShapeType) => {
    const newShape: Shape = {
      id: uuidv4(),
      type,
      x: snapPosition(100 + Math.random() * 200),
      y: snapPosition(100 + Math.random() * 200),
      width: 120,
      height: type === 'circle' || type === 'hexagon' ? 120 : 80,
      color: '#4a90d9',
      text: '',
      textStyle: {
        fontFamily: 'Arial',
        fontSize: 14,
        color: '#ffffff',
      },
    };
    setShapes([...shapes, newShape]);
    setSelectedShapeId(newShape.id);
  };

  const duplicateShape = (id: string) => {
    const shape = shapes.find(s => s.id === id);
    if (!shape) return;
    const newShape: Shape = {
      ...shape,
      id: uuidv4(),
      x: snapPosition(shape.x + 30),
      y: snapPosition(shape.y + 30),
    };
    setShapes([...shapes, newShape]);
    setSelectedShapeId(newShape.id);
  };

  const updateShape = (id: string, updates: Partial<Shape>) => {
    if (updates.x !== undefined) updates.x = snapPosition(updates.x);
    if (updates.y !== undefined) updates.y = snapPosition(updates.y);
    setShapes(shapes.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteShape = (id: string) => {
    setShapes(shapes.filter((s) => s.id !== id));
    setConnectors(connectors.filter((c) => c.fromShapeId !== id && c.toShapeId !== id));
    if (selectedShapeId === id) setSelectedShapeId(null);
  };

  const deleteConnector = (id: string) => {
    setConnectors(connectors.filter((c) => c.id !== id));
    if (selectedConnectorId === id) setSelectedConnectorId(null);
  };

  const handleShapeConnectClick = (shapeId: string) => {
    if (!isConnecting) return;

    if (!connectingFromId) {
      setConnectingFromId(shapeId);
    } else if (connectingFromId !== shapeId) {
      const newConnector: Connector = {
        id: uuidv4(),
        type: selectedConnectorType,
        fromShapeId: connectingFromId,
        toShapeId: shapeId,
        color: '#333333',
      };
      setConnectors([...connectors, newConnector]);
      setConnectingFromId(null);
      setIsConnecting(false);
    }
  };

  const toggleConnecting = () => {
    setIsConnecting(!isConnecting);
    setConnectingFromId(null);
  };

  const exportPDF = async () => {
    if (!canvasRef.current) return;

    const canvas = await html2canvas(canvasRef.current, {
      backgroundColor: backgroundColor,
      scale: 2,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`${diagramName || 'diagram'}.pdf`);
  };

  const selectedShape = shapes.find((s) => s.id === selectedShapeId) || null;

  if (!showEditor) {
    return <HomePage onStart={() => setShowEditor(true)} />;
  }

  return (
    <div className="app">
      <Toolbar
        diagramName={diagramName}
        onDiagramNameChange={setDiagramName}
        onAddShape={addShape}
        backgroundColor={backgroundColor}
        onBackgroundColorChange={setBackgroundColor}
        selectedConnectorType={selectedConnectorType}
        onConnectorTypeChange={setSelectedConnectorType}
        isConnecting={isConnecting}
        onToggleConnecting={toggleConnecting}
        onExportPDF={exportPDF}
        onSave={saveDiagram}
        onClear={clearDiagram}
        onUndo={undo}
        onRedo={redo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        zoom={zoom}
        onZoomChange={setZoom}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid(!showGrid)}
        snapToGrid={snapToGrid}
        onToggleSnap={() => setSnapToGrid(!snapToGrid)}
      />
      <div className="main-content">
        <Canvas
          ref={canvasRef}
          shapes={shapes}
          connectors={connectors}
          backgroundColor={backgroundColor}
          selectedShapeId={selectedShapeId}
          selectedConnectorId={selectedConnectorId}
          onSelectShape={setSelectedShapeId}
          onSelectConnector={setSelectedConnectorId}
          onUpdateShape={updateShape}
          onDeleteShape={deleteShape}
          onDeleteConnector={deleteConnector}
          isConnecting={isConnecting}
          onShapeConnectClick={handleShapeConnectClick}
          zoom={zoom}
          showGrid={showGrid}
        />
        <PropertiesPanel
          selectedShape={selectedShape}
          onUpdateShape={(updates) => {
            if (selectedShapeId) updateShape(selectedShapeId, updates);
          }}
          onDuplicate={() => selectedShapeId && duplicateShape(selectedShapeId)}
        />
      </div>
      {isConnecting && (
        <div className="connecting-hint">
          {connectingFromId
            ? 'Click on the destination shape'
            : 'Click on the source shape to start connecting'}
        </div>
      )}
    </div>
  );
}

export default App;
