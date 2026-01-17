export type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'diamond' | 'hexagon';
export type ConnectorType = 'arrow' | 'line' | 'dashed' | 'dotted';

export interface HistoryState {
  shapes: Shape[];
  connectors: Connector[];
}

export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  color: string;
}

export interface Shape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  text: string;
  textStyle: TextStyle;
}

export interface Connector {
  id: string;
  type: ConnectorType;
  fromShapeId: string;
  toShapeId: string;
  color: string;
}

export interface Diagram {
  name: string;
  backgroundColor: string;
  shapes: Shape[];
  connectors: Connector[];
}
