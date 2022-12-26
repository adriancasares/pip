// @ts-ignore
import express from "express";

// @ts-ignore
import open from "open";

import bodyParser from "body-parser";
import addToStrapi from "./handler/strapi.js";

import * as dotenv from "dotenv";
import deployToVercel from "./handler/vercel.js";
import sendTestEmail from "./handler/testEmail.js";

dotenv.config();

// @ts-ignore
import("../dist/server/entry.mjs").then((module: any) => {
  const app = express();

  app.post(
    "/api/add-to-strapi",

    [bodyParser.json(), bodyParser.urlencoded({ extended: true })],

    (req: any, res: any, next: any) => {
      addToStrapi(req.body)
        .then(() => {
          res.send("OK");
        })
        .catch(next);
    }
  );

  app.post(
    "/api/deploy-to-vercel",

    [bodyParser.json(), bodyParser.urlencoded({ extended: true })],

    (req: any, res: any, next: any) => {
      deployToVercel(req.body)
        .then(() => {
          res.send("OK");
        })
        .catch(next);
    }
  );

  app.post(
    "/api/send-test-email",

    [bodyParser.json(), bodyParser.urlencoded({ extended: true })],

    (req: any, res: any, next: any) => {
      sendTestEmail(req.body)
        .then(() => {
          res.send("OK");
        })
        .catch(next);
    }
  );

  app.get("/", [module.handler]);

  app.use(express.static("dist/client/"));

  app.listen(8080);

  open("http://localhost:8080");
});
