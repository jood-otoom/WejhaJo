import { imageSize, socialImage } from "@/lib/social-image";
export const alt = "Wejha — Technology with Purpose";
export const size = imageSize;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return socialImage(
    "Technology with Purpose.",
    "Software engineering · AI · Digital transformation",
    "Built for businesses. Designed for people.",
  );
}
