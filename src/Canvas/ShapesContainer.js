import { IconButton } from "@mui/material";
import StopIcon from "@mui/icons-material/Stop";
import { Circle as CircleIcon } from "@mui/icons-material";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import TriangleIcon from "@mui/icons-material/ChangeHistory";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";

function ShapesContainer({ addShape }) {
  return (
    <div className="icons-container">
      <IconButton
        size="small"
        sx={{
          color: "transparent",
          stroke: "black",
          strokeWidth: 1.5,
        }}
        id="shapes-icon"
      >
        <CategoryRoundedIcon fontSize="medium" />
      </IconButton>
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
      <IconButton
        onClick={addShape}
        size="small"
        sx={{
          color: "transparent",
          stroke: "black",
          strokeWidth: 1.5,
        }}
        id="triangle-icon"
      >
        <TriangleIcon fontSize="small" />
      </IconButton>
    </div>
  );
}

export default ShapesContainer;
