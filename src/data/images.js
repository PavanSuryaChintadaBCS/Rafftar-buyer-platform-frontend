import cementImg from "@/assets/products/cement.jpg";
import steelImg from "@/assets/products/steel.jpg";
import bricksImg from "@/assets/products/bricks.jpg";
import tilesImg from "@/assets/products/tiles.jpg";
import sandImg from "@/assets/products/sand.jpg";
import electricalImg from "@/assets/products/electrical.jpg";
import plumbingImg from "@/assets/products/plumbing.jpg";
import paintImg from "@/assets/products/paint.jpg";
import woodImg from "@/assets/products/wood.jpg";
import hardwareImg from "@/assets/products/hardware.jpg";
import waterproofingImg from "@/assets/products/waterproofing.jpg";
const categoryImages = {
  cement: cementImg,
  steel: steelImg,
  bricks: bricksImg,
  tiles: tilesImg,
  sand: sandImg,
  electrical: electricalImg,
  plumbing: plumbingImg,
  paint: paintImg,
  wood: woodImg,
  hardware: hardwareImg,
  waterproofing: waterproofingImg
};
function getProductImage(category) {
  return categoryImages[category] || cementImg;
}
export {
  categoryImages,
  getProductImage
};
