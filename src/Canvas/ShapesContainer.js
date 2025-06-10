import {
  Square,
  Circle,
  Triangle,
  Minus,
  Pentagon,
  Shapes,
  StickyNote,
  Brush,
  Type,
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
            className="my-hover-effect icon"
            onClick={() => addShape("square")}
          >
            <Square />
          </div>
          <div
            className="my-hover-effect icon"
            onClick={() => addShape("circle")}
          >
            <Circle />
          </div>
          <div
            className="my-hover-effect icon"
            onClick={() => addShape("triangle")}
          >
            <Triangle />
          </div>
          <div
            className="my-hover-effect icon"
            onClick={() => addShape("pentagon")}
          >
            <Pentagon />
          </div>
          <div
            className="my-hover-effect icon"
            onClick={() => addShape("line")}
          >
            <Minus />
          </div>
        </div>
      )}
      <div title="StickyNote" className="icon">
        <StickyNote />
      </div>
      <div title="Brush" className="icon">
        <Brush />
      </div>
      <div title="Text" className="icon">
        <Type />
      </div>
    </div>
  );
}

export default ShapesContainer;
