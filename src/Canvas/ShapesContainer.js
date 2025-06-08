import {
  Square,
  Circle,
  Pencil,
  Eraser,
  Layers,
  Triangle,
  Minus,
  Pentagon,
} from "lucide-react";

function ShapesContainer({ addShape }) {
  return (
    <div className="icons-container">
      <Square />
      <Circle />
      <Triangle />
      <Minus />
      <Pentagon />
    </div>
  );
}

export default ShapesContainer;
