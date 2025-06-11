import { useEffect, useRef, useState } from "react";
import "./CanvasContainer.css";
import ShapesContainer from "./ShapesContainer";
import {
  Stage,
  Layer,
  Rect,
  Circle,
  Arrow,
  Star,
  RegularPolygon,
  Text,
} from "react-konva";
import { Group } from "react-konva";
import { Line } from "react-konva";
import { socket } from "../socket";

function CanvasContainer() {
  const [shapes, setShapes] = useState([]);
  const sidesMapping = {
    minus: 2,
    triangle: 3,
    pentagon: 5,
    hexagon: 6,
  };
  const iconMapping = {
    square: Rect,
    circle: Circle,
    star: Star,
    hexagon: RegularPolygon,
    minus: RegularPolygon,
    moveupright: Arrow,
    text: Text,
    triangle: RegularPolygon,
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
    console.log("Clicked: " + iconName);
    let newShape = {
      id: `${iconName}-${shapes.length + 1}`,
      className: `${iconName}`,
      x: 50,
      y: 60,
      width: 100,
      height: 100,
      stroke: "black",
      strokeWidth: 2,
      shadowBlur: 1,
    };
    if (
      iconName === "minus" ||
      iconName === "triangle" ||
      iconName === "hexagon"
    ) {
      newShape.sides = sidesMapping[iconName];
      newShape.radius = 70;
    } else if (iconName === "star") {
      newShape.numPoints = 5;
      newShape.innerRadius = 30;
      newShape.outerRadius = 70;
    }
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
              if (shape.className === "text") {
                return (
                  <Text
                    key={shape.id}
                    text="Type here.."
                    x={100}
                    y={100}
                    fontSize={24}
                    fill="black"
                    draggable
                  />
                );
              }
              if (shape.className === "sticky") {
                console.log("it's sticky...");

                return (
                  <Group key={shape.id} draggable>
                    <Rect
                      width={150}
                      height={100}
                      fill="#ffff88"
                      stroke="black"
                      cornerRadius={8}
                    />
                    <Text
                      text="Your note here"
                      fontSize={16}
                      padding={10}
                      width={150}
                      height={100}
                      fill="black"
                    />
                  </Group>
                );
              }
              const Component = iconMapping[shape.className];
              return (
                <Component
                  key={shape.id}
                  {...shape}
                  {...(shape.className === "line" && {
                    sides: 2,
                  })}
                  {...(shape.className === "triangle" && {
                    sides: 3,
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
