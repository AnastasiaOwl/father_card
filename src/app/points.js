const fs = require('fs');
const opentype = require('opentype.js');
const { svgPathProperties } = require('svg-path-properties');

const FONT_PATH = '../app/fonts/Adine_Kirnberg_Regular.ttf';
const TEXT = 'Найкращому батьку у світі!';
const FONT_SIZE = 140;
const WIDTH = 1200;
const HEIGHT = 660;
const DOT_COUNT = 1200;

opentype.load(FONT_PATH, (err, font) => {
  if (err) throw err;

  const textPath = font.getPath(TEXT, 0, FONT_SIZE, FONT_SIZE);
  const bounds = textPath.getBoundingBox();

  const offsetX = WIDTH / 2 - (bounds.x1 + bounds.x2) / 2;
  const offsetY = HEIGHT / 2 - (bounds.y1 + bounds.y2) / 2;

  const centeredPath = font.getPath(
    TEXT,
    offsetX - bounds.x1,
    offsetY - bounds.y1,
    FONT_SIZE
  );
  const svgPathData = centeredPath.toPathData(2);


  const properties = new svgPathProperties(svgPathData);
  const totalLength = properties.getTotalLength();

  const points = [];
  for (let i = 0; i < DOT_COUNT; i++) {
    const { x, y } = properties.getPointAtLength((totalLength * i) / DOT_COUNT);
    points.push({ x, y });
  }
  
  fs.writeFileSync('./particle-points.json', JSON.stringify(points, null, 2));
  console.log('✅ particle-points.json saved with', points.length, 'points!');
});
