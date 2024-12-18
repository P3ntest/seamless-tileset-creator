//@ts-expect-error
import { parseFile } from "tmx-parser";

const file = await Bun.file("../tiled_maps/Test map.tmx").text();
console.log(file);
const map = parseFile("../tiled_maps/Test map.tmx", (err, map) => {
  console.log(map.tileSets[1].tiles[0].objectGroups);
});

console.log(map);
