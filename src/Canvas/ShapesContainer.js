import {
  Square,
  Circle,
  Star,
  Minus,
  Hexagon,
  Shapes,
  StickyNote,
  Brush,
  Type,
  MoveUpRight,
  Triangle,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import "./ShapesContainer.css";

function ShapesContainer({ addShape }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Optional: Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const iconClickHandler = (e) => {
    console.log("Calling addShape()");
    addShape(e);
  };

  return (
    <div className="icons-container" ref={containerRef}>
      <div
        className="icon"
        title="Shapes"
        onClick={() => setOpen((prev) => !prev)}
      >
        <Shapes />
      </div>

      {open && (
        <div className="icons">
          <div
            id="square-icon"
            className="my-hover-effect icon"
            onClick={iconClickHandler}
          >
            <Square />
          </div>
          <div
            id="triangle-icon"
            className="my-hover-effect icon"
            onClick={iconClickHandler}
          >
            <Triangle />
          </div>
          <div
            id="circle-icon"
            className="my-hover-effect icon"
            onClick={iconClickHandler}
          >
            <Circle />
          </div>
          <div
            id="star-icon"
            className="my-hover-effect icon"
            onClick={iconClickHandler}
          >
            <Star />
          </div>
          <div
            id="hexagon-icon"
            className="my-hover-effect icon"
            onClick={iconClickHandler}
          >
            <Hexagon />
          </div>
          <div
            id="minus-icon"
            className="my-hover-effect icon"
            onClick={iconClickHandler}
          >
            <Minus />
          </div>
          <div
            id="moveupright-icon"
            className="my-hover-effect icon"
            onClick={iconClickHandler}
          >
            <MoveUpRight />
          </div>
        </div>
      )}
      <div
        id="sticky-icon"
        title="StickyNote"
        className="icon"
        onClick={iconClickHandler}
      >
        <StickyNote />
      </div>
      <div title="Brush" className="icon">
        <Brush />
      </div>
      <div
        title="Text"
        id="text-icon"
        className="icon"
        onClick={iconClickHandler}
      >
        <Type />
      </div>
    </div>
  );
}

export default ShapesContainer;
