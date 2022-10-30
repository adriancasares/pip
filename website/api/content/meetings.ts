import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const data = await axios.get("https://lasapip.herokuapp.com/api/meetings");

  const content = data.data.data.map(
    (item: { attributes: any }) => item.attributes
  );

  response
    .status(200)
    .setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=604800")
    .json(content);
}
