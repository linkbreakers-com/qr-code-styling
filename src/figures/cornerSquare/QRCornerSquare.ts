import cornerSquareTypes from "../../constants/cornerSquareTypes";
import { CornerSquareType, DrawArgs, BasicFigureDrawArgs, RotateFigureArgs, Window } from "../../types";

export const availableCornerSquareTypes = Object.values(cornerSquareTypes);

export default class QRCornerSquare {
  _element?: SVGElement;
  _svg: SVGElement;
  _type: CornerSquareType;
  _window: Window;

  constructor({ svg, type, window }: { svg: SVGElement; type: CornerSquareType; window: Window }) {
    this._svg = svg;
    this._type = type;
    this._window = window;
  }

  draw(x: number, y: number, size: number, rotation: number): void {
    const type = this._type;
    let drawFunction;

    switch (type) {
      case cornerSquareTypes.square:
        drawFunction = this._drawSquare;
        break;
      case cornerSquareTypes.extraRounded:
        drawFunction = this._drawExtraRounded;
        break;
      case cornerSquareTypes.hexagon:
        drawFunction = this._drawHexagon;
        break;
      case cornerSquareTypes.octagon:
        drawFunction = this._drawOctagon;
        break;
      case cornerSquareTypes.leaf:
        drawFunction = this._drawLeaf;
        break;
      case cornerSquareTypes.dot:
      default:
        drawFunction = this._drawDot;
    }

    drawFunction.call(this, { x, y, size, rotation });
  }

  _rotateFigure({ x, y, size, rotation = 0, draw }: RotateFigureArgs): void {
    const cx = x + size / 2;
    const cy = y + size / 2;

    draw();
    if (!this._element) {
      return;
    }
    const existingTransform = this._element.getAttribute("transform");
    const rotationTransform = `rotate(${(180 * rotation) / Math.PI},${cx},${cy})`;
    this._element.setAttribute(
      "transform",
      existingTransform ? `${rotationTransform} ${existingTransform}` : rotationTransform
    );
  }

  _basicDot(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const dotSize = size / 7;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        this._element.setAttribute("clip-rule", "evenodd");
        this._element.setAttribute(
          "d",
          `M ${x + size / 2} ${y}` + // M cx, y //  Move to top of ring
            `a ${size / 2} ${size / 2} 0 1 0 0.1 0` + // a outerRadius, outerRadius, 0, 1, 0, 1, 0 // Draw outer arc, but don't close it
            `z` + // Z // Close the outer shape
            `m 0 ${dotSize}` + // m -1 outerRadius-innerRadius // Move to top point of inner radius
            `a ${size / 2 - dotSize} ${size / 2 - dotSize} 0 1 1 -0.1 0` + // a innerRadius, innerRadius, 0, 1, 1, -1, 0 // Draw inner arc, but don't close it
            `Z` // Z // Close the inner ring. Actually will still work without, but inner ring will have one unit missing in stroke
        );
      }
    });
  }

  _basicSquare(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const dotSize = size / 7;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        this._element.setAttribute("clip-rule", "evenodd");
        this._element.setAttribute(
          "d",
          `M ${x} ${y}` +
            `v ${size}` +
            `h ${size}` +
            `v ${-size}` +
            `z` +
            `M ${x + dotSize} ${y + dotSize}` +
            `h ${size - 2 * dotSize}` +
            `v ${size - 2 * dotSize}` +
            `h ${-size + 2 * dotSize}` +
            `z`
        );
      }
    });
  }

  _basicExtraRounded(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const dotSize = size / 7;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        this._element.setAttribute("clip-rule", "evenodd");
        this._element.setAttribute(
          "d",
          `M ${x} ${y + 2.5 * dotSize}` +
            `v ${2 * dotSize}` +
            `a ${2.5 * dotSize} ${2.5 * dotSize}, 0, 0, 0, ${dotSize * 2.5} ${dotSize * 2.5}` +
            `h ${2 * dotSize}` +
            `a ${2.5 * dotSize} ${2.5 * dotSize}, 0, 0, 0, ${dotSize * 2.5} ${-dotSize * 2.5}` +
            `v ${-2 * dotSize}` +
            `a ${2.5 * dotSize} ${2.5 * dotSize}, 0, 0, 0, ${-dotSize * 2.5} ${-dotSize * 2.5}` +
            `h ${-2 * dotSize}` +
            `a ${2.5 * dotSize} ${2.5 * dotSize}, 0, 0, 0, ${-dotSize * 2.5} ${dotSize * 2.5}` +
            `M ${x + 2.5 * dotSize} ${y + dotSize}` +
            `h ${2 * dotSize}` +
            `a ${1.5 * dotSize} ${1.5 * dotSize}, 0, 0, 1, ${dotSize * 1.5} ${dotSize * 1.5}` +
            `v ${2 * dotSize}` +
            `a ${1.5 * dotSize} ${1.5 * dotSize}, 0, 0, 1, ${-dotSize * 1.5} ${dotSize * 1.5}` +
            `h ${-2 * dotSize}` +
            `a ${1.5 * dotSize} ${1.5 * dotSize}, 0, 0, 1, ${-dotSize * 1.5} ${-dotSize * 1.5}` +
            `v ${-2 * dotSize}` +
            `a ${1.5 * dotSize} ${1.5 * dotSize}, 0, 0, 1, ${dotSize * 1.5} ${-dotSize * 1.5}`
        );
      }
    });
  }

  _drawDot({ x, y, size, rotation }: DrawArgs): void {
    this._basicDot({ x, y, size, rotation });
  }

  _drawSquare({ x, y, size, rotation }: DrawArgs): void {
    this._basicSquare({ x, y, size, rotation });
  }

  _drawExtraRounded({ x, y, size, rotation }: DrawArgs): void {
    this._basicExtraRounded({ x, y, size, rotation });
  }


  _basicHexagon(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const dotSize = size / 7;
    const cx = x + size / 2;
    const cy = y + size / 2;
    const radius = size / 2;
    const innerRadius = radius - dotSize;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        this._element.setAttribute("clip-rule", "evenodd");
        this._element.setAttribute("fill-rule", "evenodd");
        
        // Outer hexagon (clockwise)
        let path = `M ${cx + radius} ${cy}`;
        for (let i = 1; i <= 6; i++) {
          const angle = (i * Math.PI) / 3;
          const outerX = cx + radius * Math.cos(angle);
          const outerY = cy + radius * Math.sin(angle);
          path += ` L ${outerX} ${outerY}`;
        }
        path += " Z";
        
        // Inner hexagon (counter-clockwise for hole)
        path += ` M ${cx + innerRadius} ${cy}`;
        for (let i = 6; i >= 1; i--) {
          const angle = (i * Math.PI) / 3;
          const innerX = cx + innerRadius * Math.cos(angle);
          const innerY = cy + innerRadius * Math.sin(angle);
          path += ` L ${innerX} ${innerY}`;
        }
        path += " Z";
        
        this._element.setAttribute("d", path);
      }
    });
  }

  _basicOctagon(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const dotSize = size / 7;
    const cx = x + size / 2;
    const cy = y + size / 2;
    const radius = size / 2;
    const innerRadius = radius - dotSize;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        this._element.setAttribute("clip-rule", "evenodd");
        this._element.setAttribute("fill-rule", "evenodd");
        
        // Outer octagon (clockwise)
        let path = `M ${cx + radius} ${cy}`;
        for (let i = 1; i <= 8; i++) {
          const angle = (i * Math.PI) / 4;
          const outerX = cx + radius * Math.cos(angle);
          const outerY = cy + radius * Math.sin(angle);
          path += ` L ${outerX} ${outerY}`;
        }
        path += " Z";
        
        // Inner octagon (counter-clockwise for hole)
        path += ` M ${cx + innerRadius} ${cy}`;
        for (let i = 8; i >= 1; i--) {
          const angle = (i * Math.PI) / 4;
          const innerX = cx + innerRadius * Math.cos(angle);
          const innerY = cy + innerRadius * Math.sin(angle);
          path += ` L ${innerX} ${innerY}`;
        }
        path += " Z";
        
        this._element.setAttribute("d", path);
      }
    });
  }

  _drawHexagon({ x, y, size, rotation }: DrawArgs): void {
    this._basicHexagon({ x, y, size, rotation });
  }

  _drawOctagon({ x, y, size, rotation }: DrawArgs): void {
    this._basicOctagon({ x, y, size, rotation });
  }

  _basicLeaf(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const viewBoxWidth = 244;
    const viewBoxHeight = 246;
    const scaleX = size / viewBoxWidth;
    const scaleY = size / viewBoxHeight;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        this._element.setAttribute("clip-rule", "evenodd");
        this._element.setAttribute("fill-rule", "evenodd");
        this._element.setAttribute(
          "d",
          "M174 0C212.66 0.00000206163 244 31.3401 244 70V246H70C31.3401 246 0 214.66 0 176V0H174ZM27 27V169C27 196.614 49.3858 219 77 219H217V77C217 49.3858 194.614 27 167 27H27Z"
        );
        this._element.setAttribute("transform", `translate(${x}, ${y}) scale(${scaleX}, ${scaleY})`);
      }
    });
  }

  _drawLeaf({ x, y, size, rotation }: DrawArgs): void {
    this._basicLeaf({ x, y, size, rotation });
  }

}
