import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";
export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const cardFile = (await axios.get("https://lasapip.vercel.app/Contact.vcf"))
    .data;

  console.log(cardFile);

  // send text/vcard
  response.status(200).setHeader("Content-Type", "text/vcard").send(cardFile);
}
