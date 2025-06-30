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
import { Group, Transformer } from "react-konva";
import { socket } from "../socket";

const measureHeight = (text, width, fontSize = 24) => {
  const dummy = new window.Konva.Text({
    text,
    width,
    fontSize,
    wrap: "word",
  });
  return dummy.height();
};

function CanvasContainer() {
  const [shapes, setShapes] = useState([]);
  const [dragShape, setDragShape] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingText, setEditingText] = useState("");
  const [editingPos, setEditingPos] = useState({ x: 0, y: 0 });
  const [editingShapeId, setEditingShapeId] = useState(null);

  const shapeRef = useRef();
  const trRef = useRef();
  const stageRef = useRef();
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
    if (!trRef.current || !stageRef.current) return;

    const stage = stageRef.current;
    const selectedNode = stage.findOne(`#${selectedId}`);

    if (selectedNode) {
      trRef.current.nodes([selectedNode]);
      trRef.current.getLayer().batchDraw();
    } else {
      trRef.current.nodes([]);
    }
  }, [selectedId, shapes]);

  useEffect(() => {
    socket.emit("send_dragshape_data", dragShape);
  }, [dragShape]);

  useEffect(() => {
    const handleShapeUpdate = (shape) => {
      setShapes((prevShapes) => [...prevShapes, shape]);
    };

    const handleDragShape = (shape) => {
      setShapes((prevShapes) =>
        prevShapes.map((value) => {
          if (value.id === shape.id) {
            return {
              ...value,
              x: shape.data.x,
              y: shape.data.y,
            };
          }
          return value;
        })
      );
    };
    const handleResizeRotate = (updatedShape) => {
      setShapes((prevShapes) =>
        prevShapes.map((shape) =>
          shape.id === updatedShape.id ? { ...shape, ...updatedShape } : shape
        )
      );
    };
    socket.on("receive_text_update", ({ id, text }) => {
      setShapes((prev) => prev.map((s) => (s.id === id ? { ...s, text } : s)));
    });
    socket.on("shape_text_update", (updated) => {
      setShapes((prev) =>
        prev.map((s) =>
          s.id === updated.id ? { ...s, text: updated.text } : s
        )
      );
    });

    socket.on("receive_shape", handleShapeUpdate);
    socket.on("receive_dragshape_data", handleDragShape);
    socket.on("receive_shape_resize_rotate", handleResizeRotate);
    return () => {
      socket.off("receive_shape", handleShapeUpdate);
      socket.off("receive_dragshape_data", handleDragShape);
      socket.off("receive_shape_resize_rotate", handleResizeRotate);
      socket.off("receive_text_update");
      socket.off("shape_text_update");
      // socket.disconnect();
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
  const currentEditingShape = shapes.find((s) => s.id === editingShapeId);

  return (
    <div className="canvasApp canvasContainer">
      <div className="stage">
        <div className="shapes-float">
          <ShapesContainer addShape={addShape} />
        </div>
        <Stage
          ref={stageRef}
          width={dimensions.width}
          height={dimensions.height}
          onMouseDown={(e) => {
            if (e.target === e.target.getStage()) {
              setSelectedId(null); // deselect
            }
          }}
        >
          <Layer>
            {shapes.map((shape) => {
              if (shape.className === "text") {
                return (
                  <Text
                    key={shape.id}
                    id={shape.id}
                    text={shape.text || "Click to edit"}
                    x={shape.x}
                    y={shape.y}
                    width={shape.width || 300}
                    height={shape.height || 50}
                    wrap="word"
                    fontSize={24}
                    fill="black"
                    draggable
                    onClick={() => setSelectedId(shape.id)}
                    onDblClick={(e) => {
                      const absPos = e.target.getAbsolutePosition();
                      setEditingText(shape.text || "");
                      setEditingPos({ x: absPos.x, y: absPos.y });
                      setEditingShapeId(shape.id);
                      setIsEditing(true);
                    }}
                    onDragMove={(e) => {
                      const value = { x: e.target.x(), y: e.target.y() };
                      setDragShape({ id: shape.id, data: value });
                    }}
                    rotation={shape.rotation || 0}
                    onTransform={(e) => {
                      const node = e.target;
                      const newWidth = Math.max(
                        50,
                        node.width() * node.scaleX()
                      );
                      const currentShape = shapes.find(
                        (s) => s.id === node.id()
                      );
                      if (!currentShape) return;

                      const newHeight = measureHeight(
                        currentShape.text || "",
                        newWidth
                      );

                      node.scaleX(1);
                      node.scaleY(1);

                      const updatedShape = {
                        ...currentShape,
                        x: node.x(),
                        y: node.y(),
                        width: newWidth,
                        height: newHeight,
                      };

                      setShapes((prev) =>
                        prev.map((s) =>
                          s.id === updatedShape.id ? updatedShape : s
                        )
                      );

                      socket.emit("shape_resize_rotate", updatedShape);
                    }}
                  />
                );
              }
              if (shape.className === "sticky") {
                console.log("it's sticky...");
                return (
                  <Group key={shape.id} id={shape.id} draggable>
                    <Rect
                      width={150}
                      height={100}
                      fill="#ffff88"
                      stroke="black"
                      cornerRadius={8}
                    />
                    <Text
                      key={shape.id}
                      id={shape.id}
                      text={shape.text || "Click to edit"}
                      x={shape.x}
                      y={shape.y}
                      fontSize={24}
                      fill="black"
                      onDragMove={(e) => {
                        const value = { x: e.target.x(), y: e.target.y() };
                        setDragShape({ id: shape.id, data: value });
                      }}
                      onDblClick={(e) => {
                        const absPos = e.target.getAbsolutePosition();
                        setEditingText(shape.text || "");
                        setEditingPos({ x: absPos.x, y: absPos.y });
                        setEditingShapeId(shape.id);
                        setIsEditing(true);
                      }}
                    />
                  </Group>
                );
              }
              const Component = iconMapping[shape.className];
              return (
                <Component
                  key={shape.id}
                  id={shape.id} // REQUIRED for Transformer to work
                  {...shape}
                  {...(shape.className === "line" && { sides: 2 })}
                  {...(shape.className === "triangle" && { sides: 3 })}
                  draggable
                  onClick={() => setSelectedId(shape.id)}
                  onTap={() => setSelectedId(shape.id)} // mobile support
                  onTransformEnd={(e) => {
                    const node = e.target;
                    const updatedShape = {
                      ...shape,
                      x: node.x(),
                      y: node.y(),
                      width: node.width() * node.scaleX(),
                      height: node.height() * node.scaleY(),
                    };
                    node.scaleX(1);
                    node.scaleY(1);
                    setShapes((prev) =>
                      prev.map((s) => (s.id === shape.id ? updatedShape : s))
                    );
                  }}
                  onDragMove={(e) => {
                    const value = { x: e.target.x(), y: e.target.y() };
                    setDragShape({ id: shape.id, data: value });
                  }}
                  onMouseEnter={(e) => e.target.fill("rgba(1, 1, 11, 0.2)")}
                  onMouseLeave={(e) => e.target.fill("transparent")}
                  onTransform={(e) => {
                    const node = e.target;

                    const updatedShape = {
                      id: node.id(),
                      x: node.x(),
                      y: node.y(),
                      width: node.width() * node.scaleX(),
                      height: node.height() * node.scaleY(),
                      rotation: node.rotation(),
                      scaleX: 1,
                      scaleY: 1,
                    };

                    // Reset local scale to avoid compounding
                    node.scaleX(1);
                    node.scaleY(1);

                    // 🔁 Update local state
                    setShapes((prev) =>
                      prev.map((shape) =>
                        shape.id === updatedShape.id
                          ? { ...shape, ...updatedShape }
                          : shape
                      )
                    );

                    // 🔁 Share over socket
                    socket.emit("shape_resize_rotate", updatedShape);
                  }}
                />
              );
            })}
            <Transformer
              ref={trRef}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 30 || newBox.height < 30) {
                  return oldBox;
                }
                return newBox;
              }}
            />
          </Layer>
        </Stage>
        {isEditing && currentEditingShape && (
          <textarea
            value={editingText}
            onChange={(e) => {
              const newText = e.target.value;
              const newHeight = measureHeight(
                newText,
                currentEditingShape.width || 200
              );
              const updatedShape = {
                ...currentEditingShape,
                text: newText,
                height: newHeight,
              };

              setEditingText(newText);
              setShapes((prev) =>
                prev.map((s) => (s.id === updatedShape.id ? updatedShape : s))
              );

              socket.emit("shape_text_update", updatedShape);
            }}
            onBlur={() => {
              setIsEditing(false);
              setEditingShapeId(null);
            }}
            style={{
              position: "absolute",
              top: editingPos.y,
              left: editingPos.x,
              width: currentEditingShape?.width || "200px",
              fontSize: "24px",
              padding: "4px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              zIndex: 999,
              resize: "none",
            }}
            autoFocus
          />
        )}
      </div>
    </div>
  );
}

export default CanvasContainer;
