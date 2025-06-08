import { useEffect, useRef, useState } from "react";
import "./CanvasContainer.css";
import ShapesContainer from "./ShapesContainer";
import { Stage, Layer, Rect, Circle } from "react-konva";
import { Line } from "react-konva";
import { socket } from "../socket";

function CanvasContainer() {
  const canvasRef = useRef(null);
  const [shapes, setShapes] = useState([]);
  const iconMapping = {
    rectangle: Rect,
    circle: Circle,
    line: Line,
  };
  useEffect(() => {
    const handleShapeUpdate = (shape) => {
      console.log("Received shape from server: " + shape);
      let newReceivedShape = shape;
      newReceivedShape.id = shape.id + " received";
      setShapes((prevShapes) => [...prevShapes, shape]);
    };
    socket.on("receive_shape", handleShapeUpdate);
    return () => {
      socket.off("receive_shape", handleShapeUpdate);
      socket.disconnect();
    };
  }, []);

  function addShape(e) {
    let iconName = e.currentTarget.id.slice(0, -5);
    let newShape = {
      id: `${iconName}-${shapes.length + 1}`,
      className: `${iconName}`,
      x: 20,
      y: 50,
      width: 100,
      height: 100,
      stroke: "black",
      strokeWidth: 2,
      shadowBlur: 1,
    };
    setShapes([...shapes, newShape]);
    socket.emit("send_shape", newShape);
  }
  return (
    <div className="canvasApp canvasContainer">
      <ShapesContainer addShape={addShape} />
      <div className="stage">
        <Stage width={1000} height={500}>
          <Layer>
            {shapes.length > 0 &&
              shapes.map((shape, i) => {
                let iconName = shape.className;
                console.log("Icon: " + iconName);
                const CompShapeName = iconMapping[iconName];
                console.log("CompShapeName : " + CompShapeName);
                return (
                  <CompShapeName
                    key={shape.id}
                    {...shape}
                    {...(iconName === "line" && { points: [20, 50, 200, 200] })}
                    onMouseEnter={(e) => e.target.fill("rgba(1, 1, 11, 0.2)")}
                    onMouseLeave={(e) => e.target.fill("transparent")}
                    draggable
                  />
                );
              })}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}

export default CanvasContainer;
