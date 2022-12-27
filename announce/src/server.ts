// @ts-ignore
import express from "express";

// @ts-ignore
import open from "open";

import bodyParser from "body-parser";
import addToStrapi from "./handler/strapi.js";

import * as dotenv from "dotenv";
import deployToVercel from "./handler/vercel.js";
import fetchMembers from "./handler/fetchMembers.js";
import sendEmail from "./handler/sendEmail.js";
import sendMessage from "./handler/sendMessage.js";

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
    "/api/send-email",

    [bodyParser.json(), bodyParser.urlencoded({ extended: true })],

    (req: any, res: any, next: any) => {
      sendEmail(req.body.email, req.body.recipient)
        .then(() => {
          res.send("OK");
        })
        .catch(next);
    }
  );

  app.post(
    "/api/send-message",

    [bodyParser.json(), bodyParser.urlencoded({ extended: true })],

    (req: any, res: any, next: any) => {
      sendMessage(req.body.message, req.body.phoneNumber)
        .then(() => {
          res.send("OK");
        })
        .catch(next);
    }
  );

  app.get("/api/fetch-members", (req: any, res: any, next: any) => {
    fetchMembers()
      .then((members) => {
        res.send(members);
      })
      .catch(next);
  });

  app.post("/api/stop-server", (req: any, res: any, next: any) => {
    res.send("OK");
    process.exit(0);
  });

  app.get("/", [module.handler]);

  app.use(express.static("dist/client/"));

  app.listen(8080);

  open("http://localhost:8080");
});
