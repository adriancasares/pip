import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // send text/vcard
  response
    .status(200)
    .setHeader("Content-Type", "text/vcard")
    .send(
      `BEGIN:VCARD
        VERSION:3.0
        PRODID:-//Apple Inc.//macOS 12.1//EN
        N:;;;;
        FN:Programming in Practice
        ORG:Programming in Practice;
        EMAIL;type=INTERNET;type=pref:help@lasapip.com
        TEL;type=pref:+15126402455
        item1.URL;type=pref:https://lasapip.com
        item1.X-ABLabel:_$!<HomePage>!$_
        X-ABShowAs:COMPANY
        END:VCARD
        `
    );
}
