export interface NodeCanvasImage {
  width: number;
  height: number;
}

export interface NodeCanvasRenderingContext2D {
  drawImage(image: NodeCanvasImage, dx: number, dy: number): void;
}

export interface NodeCanvasCanvas {
  width: number;
  height: number;
  getContext(type: "2d"): NodeCanvasRenderingContext2D | null;
  toBuffer: (mimeType: string) => Buffer;
  toDataURL?: (type?: string) => string;
}

export interface NodeCanvasModule {
  createCanvas(width: number, height: number): NodeCanvasCanvas;
  loadImage(src: string): Promise<NodeCanvasImage>;
}
