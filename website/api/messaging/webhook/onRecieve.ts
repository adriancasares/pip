import type { VercelRequest, VercelResponse } from "@vercel/node";
import twilio from "twilio";
import multiparty from "multiparty";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  //   const form = new multiparty.Form();

  //   let FormResp: any = await new Promise((resolve, reject) => {
  //     form.parse(request, (err, fields, files) => {
  //       if (err) reject(err);
  //       resolve({ fields, files });
  //     });
  //   });

  //   const CallSid = FormResp.fields.CallSid[0];
  //   const Caller = FormResp.fields.Caller[0];
  //   const Digits = FormResp.fields.Digits[0];
  //   const From = FormResp.fields.From[0];
  //   const To = FormResp.fields.To[0];

  //   const params = {
  //     To,
  //     From,
  //     Digits,
  //     CallSid,
  //     Caller,
  //   };

  //   console.log(params);

  //   //get twilio signature from header
  //   const signature = request.headers["X-Twilio-Signature"];

  //   console.log("signature: " + signature);

  //   console.log(params);

  console.log(request);

  response.status(200).send("OK");
}
