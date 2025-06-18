const fs = require("fs");

const originalPoints = require("./particle-points.json");

const outputSmallCanvasWidth = 680;
const outputSmallCanvasHeight = 470;

const originalCanvasWidth = 1200;
const originalCanvasHeight = 660;

const scale = Math.min(
  outputSmallCanvasWidth / originalCanvasWidth,
  outputSmallCanvasHeight / originalCanvasHeight
);


const offsetX = (outputSmallCanvasWidth - originalCanvasWidth * scale) / 2;
const offsetY = (outputSmallCanvasHeight - originalCanvasHeight * scale) / 2;

const scaledPoints = originalPoints.map(({ x, y }) => ({
  x: x * scale + offsetX,
  y: y * scale + offsetY,
}));

fs.writeFileSync(
  "./particle-points-mobile.json",
  JSON.stringify(scaledPoints, null, 2)
);

console.log("✅ Scaled points written to particle-points-mobile.json");
