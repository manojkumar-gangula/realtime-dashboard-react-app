import { useEffect, useRef, useState } from "react";
import "./CanvasContainer.css";
import { IconButton } from "@mui/material";
import StopIcon from "@mui/icons-material/Stop";
import { Circle as CircleIcon } from "@mui/icons-material";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import { Stage, Layer, Rect, Circle, Text } from "react-konva";

function CanvasContainer({ canvasContainer }) {
  const canvasRef = useRef(null);
  const [shapes, setShapes] = useState([{}]);
  const iconMapping = {
    rect: Rect,
    circle: Circle,
    line: Line,
  };
  let compShapeName = null;

  function addShape(e) {
    let iconName = e.currentTarget.id.slice(0, -5);
    compShapeName = iconMapping.iconName;
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
  }
  return (
    <div className={`app ${canvasContainer}`}>
      <div className="icons-container">
        <IconButton
          onClick={addShape}
          size="small"
          sx={{
            color: "transparent",
            stroke: "black",
            strokeWidth: 1.5,
          }}
          id="rectangle-icon"
        >
          <StopIcon fontSize="small" />
        </IconButton>
        <IconButton
          onClick={addShape}
          size="small"
          sx={{
            color: "transparent",
            stroke: "black",
            strokeWidth: 1.5,
          }}
          id="line-icon"
        >
          <HorizontalRuleIcon fontSize="small" />
        </IconButton>
        <IconButton
          onClick={addShape}
          size="small"
          sx={{
            color: "transparent",
            stroke: "black",
            strokeWidth: 1.5,
          }}
          id="circle-icon"
        >
          <CircleIcon fontSize="small" />
        </IconButton>
      </div>
      <div className="stage">
        <Stage width={500} height={400}>
          <Layer>
            {shapes.map((shape, i) => (
              <Rect
                key={shape.id}
                {...shape}
                onMouseEnter={(e) => e.target.fill("rgba(1, 1, 11, 0.2)")}
                onMouseLeave={(e) => e.target.fill("transparent")}
                draggable
              />
            ))}
            {/* <Rect
              x={20}
              y={50}
              width={100}
              height={100}
              stroke="black"
              strokeWidth="2"
              shadowBlur={1}
              fill={isHovered ? "rgba(1, 1, 11, 0.2)" : "transparent"}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              draggable
            /> */}
            <Circle x={200} y={100} radius={50} fill="green" draggable />
          </Layer>
        </Stage>
      </div>
    </div>
  );
}

export default CanvasContainer;
