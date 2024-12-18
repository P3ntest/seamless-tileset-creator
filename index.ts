import Jimp from "jimp";

const INPUT = "sand.jpg";

const baseTexture = await Jimp.read("./input/" + INPUT);

const TILE_SIZE = 128;

baseTexture.resize(TILE_SIZE, TILE_SIZE);

type Tile = [boolean, boolean, boolean, boolean];

const allCombinations = new Array(2 ** 4).fill({}).map((_, i) => {
  const binary = i.toString(2).padStart(4, "0");
  return binary.split("").map((char) => char === "1");
});

const columns = Math.ceil(Math.sqrt(allCombinations.length));
const rows = Math.ceil(allCombinations.length / columns);

const mask = new Jimp(columns * TILE_SIZE, rows * TILE_SIZE);

allCombinations.forEach((tile, i) => {
  const x = i % columns;
  const y = Math.floor(i / columns);
  drawTile(mask, x * TILE_SIZE, y * TILE_SIZE, tile as Tile);
});

// const linear = (x) => x; // linear gradient
// const smooth = (x) => x * x * (3 - 2 * x); // smooth gradient
// const smoother = (x) => x * x * x * (x * (x * 6 - 15) + 10); // smoother gradient
// const harder = (x) => x * x; // harder gradient
// const cut = (x) => (x < 0.5 ? 0 : 1); // cut gradient

function drawTile(img: Jimp, offsetX: number, offsetY: number, tile: Tile) {
  for (let x = 0; x < TILE_SIZE; x++) {
    for (let y = 0; y < TILE_SIZE; y++) {
      // we want to set the pixel to a white-black value, depending on the corners, creating a gradient
      const [topLeft, topRight, bottomRight, bottomLeft] = tile.map((corner) =>
        corner ? 255 : 0
      );

      const smooth = (x) => x * x * x * (x * (x * 6 - 15) + 10);

      const fn = (x) => 1 - Math.cos((x * Math.PI) / 2);

      // calculate the gradient
      const top = topLeft + (topRight - topLeft) * fn(x / TILE_SIZE);
      const bottom =
        bottomLeft + (bottomRight - bottomLeft) * fn(x / TILE_SIZE);
      const value = top + (bottom - top) * fn(y / TILE_SIZE);

      // set the pixel
      img.setPixelColor(
        Jimp.rgbaToInt(value, value, value, 255),
        x + offsetX,
        y + offsetY
      );
    }
  }
}

mask.write("gradient.png");

const baseRepeated = new Jimp(columns * TILE_SIZE, rows * TILE_SIZE);

for (let x = 0; x < columns; x++) {
  for (let y = 0; y < rows; y++) {
    baseRepeated.composite(baseTexture, x * TILE_SIZE, y * TILE_SIZE);
  }
}

baseRepeated.mask(mask, 0, 0);

baseRepeated.write(`./output/${INPUT}.png`);
