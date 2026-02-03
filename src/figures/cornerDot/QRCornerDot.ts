import cornerDotTypes from "../../constants/cornerDotTypes";
import { CornerDotType, RotateFigureArgs, BasicFigureDrawArgs, DrawArgs, Window } from "../../types";

export const availableCornerDotTypes = Object.values(cornerDotTypes);

export default class QRCornerDot {
  _element?: SVGElement;
  _svg: SVGElement;
  _type: CornerDotType;
  _window: Window;

  constructor({ svg, type, window }: { svg: SVGElement; type: CornerDotType; window: Window }) {
    this._svg = svg;
    this._type = type;
    this._window = window;
  }

  draw(x: number, y: number, size: number, rotation: number): void {
    const type = this._type;
    let drawFunction;

    switch (type) {
      case cornerDotTypes.square:
        drawFunction = this._drawSquare;
        break;
      case cornerDotTypes.hexagon:
        drawFunction = this._drawHexagon;
        break;
      case cornerDotTypes.octagon:
        drawFunction = this._drawOctagon;
        break;
      case cornerDotTypes.teardrop:
        drawFunction = this._drawTeardrop;
        break;
      case cornerDotTypes.dot:
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

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "circle");
        this._element.setAttribute("cx", String(x + size / 2));
        this._element.setAttribute("cy", String(y + size / 2));
        this._element.setAttribute("r", String(size / 2));
      }
    });
  }

  _basicSquare(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "rect");
        this._element.setAttribute("x", String(x));
        this._element.setAttribute("y", String(y));
        this._element.setAttribute("width", String(size));
        this._element.setAttribute("height", String(size));
      }
    });
  }

  _drawDot({ x, y, size, rotation }: DrawArgs): void {
    this._basicDot({ x, y, size, rotation });
  }

  _drawSquare({ x, y, size, rotation }: DrawArgs): void {
    this._basicSquare({ x, y, size, rotation });
  }


  _basicHexagon(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const cx = x + size / 2;
    const cy = y + size / 2;
    const radius = size / 2;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        
        let path = `M ${cx + radius} ${cy}`;
        for (let i = 1; i <= 6; i++) {
          const angle = (i * Math.PI) / 3;
          const pointX = cx + radius * Math.cos(angle);
          const pointY = cy + radius * Math.sin(angle);
          path += ` L ${pointX} ${pointY}`;
        }
        path += " Z";
        
        this._element.setAttribute("d", path);
      }
    });
  }

  _basicOctagon(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const cx = x + size / 2;
    const cy = y + size / 2;
    const radius = size / 2;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        
        let path = `M ${cx + radius} ${cy}`;
        for (let i = 1; i <= 8; i++) {
          const angle = (i * Math.PI) / 4;
          const pointX = cx + radius * Math.cos(angle);
          const pointY = cy + radius * Math.sin(angle);
          path += ` L ${pointX} ${pointY}`;
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

  _basicTeardrop(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const viewBoxWidth = 244;
    const viewBoxHeight = 242;
    const scaleX = size / viewBoxWidth;
    const scaleY = size / viewBoxHeight;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");

        this._element.setAttribute(
          "d",
          "M116.58 0C135.251 0.0449071 150.432 3.11444 167.717 10.1191C169.72 10.9035 171.724 11.688 173.788 12.4961C185.604 17.3394 197.534 25.7488 207.046 35.8232C229.829 57.6004 244 88.1601 244 122C244 188.131 189.885 241.741 123.13 241.741C77.7812 241.741 38.2648 217.001 17.585 180.401C1.2389 158.462 -0.147139 130.593 0.010735 103.808C0.0117702 100.933 0.0125981 98.059 0.0136646 95.0977C0.0204599 89.0594 0.0358703 83.0216 0.066399 76.9834C0.105093 69.2317 0.113027 61.4803 0.111321 53.7285C0.11208 46.3229 0.131869 38.9173 0.15136 31.5117C0.153874 28.7209 0.156582 25.9291 0.159172 23.0537C0.173585 20.4962 0.188268 17.9387 0.203118 15.3037C0.21173 13.0422 0.220612 10.7802 0.229485 8.4502C0.814541 -1.44238 6.65612 0.762706 15.2676 0.681641C17.9391 0.652642 20.6108 0.623627 23.3633 0.59375C27.7399 0.568717 27.74 0.569484 32.2051 0.543945C34.4319 0.530134 34.4323 0.529716 36.7041 0.515625C44.5869 0.468396 52.4696 0.436178 60.3525 0.415039C68.4321 0.390248 76.5108 0.312847 84.5898 0.222656C90.8489 0.16302 97.1079 0.144781 103.367 0.136719C107.772 0.120584 112.176 0.0607503 116.58 0Z"
        );
        this._element.setAttribute("transform", `translate(${x}, ${y}) scale(${scaleX}, ${scaleY})`);
      }
    });
  }

  _drawTeardrop({ x, y, size, rotation }: DrawArgs): void {
    this._basicTeardrop({ x, y, size, rotation });
  }
}
