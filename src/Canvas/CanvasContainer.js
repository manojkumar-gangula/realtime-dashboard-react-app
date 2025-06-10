import { useEffect, useRef, useState } from "react";
import "./CanvasContainer.css";
import ShapesContainer from "./ShapesContainer";
import { Stage, Layer, Rect, Circle } from "react-konva";
import { Line } from "react-konva";
import { socket } from "../socket";

function CanvasContainer() {
  const [shapes, setShapes] = useState([]);
  const iconMapping = {
    rectangle: Rect,
    circle: Circle,
    line: Line,
  };
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth * 0.7,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth * 0.7,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
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
      <div className="stage">
        <div className="shapes-float">
          <ShapesContainer addShape={addShape} />
        </div>
        <Stage width={dimensions.width} height={dimensions.height}>
          <Layer>
            {shapes.map((shape) => {
              const Component = iconMapping[shape.className];
              return (
                <Component
                  key={shape.id}
                  {...shape}
                  {...(shape.className === "line" && {
                    points: [20, 50, 200, 200],
                  })}
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
