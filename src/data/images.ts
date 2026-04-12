import cementImg from "@/assets/products/cement.jpg";
import steelImg from "@/assets/products/steel.jpg";
import bricksImg from "@/assets/products/bricks.jpg";
import tilesImg from "@/assets/products/tiles.jpg";
import sandImg from "@/assets/products/sand.jpg";
import electricalImg from "@/assets/products/electrical.jpg";
import plumbingImg from "@/assets/products/plumbing.jpg";

export const categoryImages: Record<string, string> = {
  cement: cementImg,
  steel: steelImg,
  bricks: bricksImg,
  tiles: tilesImg,
  sand: sandImg,
  electrical: electricalImg,
  plumbing: plumbingImg,
};

export function getProductImage(category: string): string {
  return categoryImages[category] || cementImg;
}
