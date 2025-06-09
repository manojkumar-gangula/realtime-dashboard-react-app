import {
  Square,
  Circle,
  Pencil,
  Eraser,
  Layers,
  Triangle,
  Minus,
  Pentagon,
  Shapes,
} from "lucide-react";
import "./ShapesContainer.css";

function ShapesContainer({ addShape }) {
  return (
    <div className="icons-container">
      <Shapes className="icon" />
      <div className="icons">
        <div className="my-hover-effect icon">
          <Square />
        </div>
        <div className="my-hover-effect icon">
          <Circle />
        </div>
        <div className="my-hover-effect icon">
          <Triangle />
        </div>
        <div className="my-hover-effect icon">
          <Pentagon />
        </div>
        <div className="my-hover-effect icon">
          <Minus />
        </div>
      </div>
    </div>
  );
}

export default ShapesContainer;
