require("dotenv").config();

let chalk;
const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");
const readline = require("readline");
const twilio = require("twilio");

const doImports = async () => {
  chalk = await import("chalk");
};

const getArgs = () => {
  const yargs = require("yargs");

  yargs.option("message", {
    alias: "m",
    description: "Message to send",
    type: "string",
  });

  yargs.option("tag", {
    alias: "t",
    description: "Tag to send",
    type: "string",
  });

  yargs.demandOption(["message"]);

  yargs.parse();

  const { message, tag } = yargs.argv;

  return { message, tag };
};

const getDatabase = () => {
  const firebaseConfig = {
    type: "service_account",
    project_id: "lasapip",
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  };

  const app = admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
  });

  const db = getFirestore(app);

  return db;
};

const getMembers = async (db, tag) => {
  const membersQuery = tag
    ? db.collection("members").where("tags", "array-contains", tag)
    : db.collection("members");

  const members = await membersQuery.get();
  return members.docs.map((doc) => doc.data());
};

const previewRecipients = (recipients) => {
  return new Promise((resolve) => {
    recipients.forEach((r) => {
      console.log(chalk.default.yellowBright(`- ${r.firstName} ${r.lastName}`));
    });

    const reader = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    reader.question(
      chalk.default.magenta.bold(
        `Will send to these ${recipients.length} ${
          recipients.length === 1 ? "person" : "people"
        }. Continue?`
      ),
      (answer) => {
        reader.close();
        if (answer === "y") {
          resolve(true);
        } else {
          console.log(chalk.default.bold.red("Aborting"));
          resolve(false);
        }
      }
    );
  });
};

const previewText = (text) => {
  return new Promise((resolve) => {
    console.log(" ");
    console.log(chalk.default.greenBright(`${text}`));
    console.log(" ");

    const reader = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    reader.question(
      chalk.default.magenta.bold(`Will send this message. Continue?`),
      (answer) => {
        reader.close();
        if (answer === "y") {
          resolve(true);
        } else {
          console.log(chalk.default.bold.red("Aborting"));
          resolve(false);
        }
      }
    );
  });
};

const continueAfterErrorPrompt = async (person) => {
  return new Promise((resolve) => {
    const reader = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    reader.question(
      chalk.default.red.bold(
        `Encountered the above error when messaging ${person.firstName} ${person.lastName} (${person.phoneNumber}). \nWould you like to continue with the next person?`
      ),
      (answer) => {
        reader.close();
        if (answer === "y") {
          resolve(true);
        } else {
          console.log(chalk.default.bold.red("Aborting"));
          resolve(false);
        }
      }
    );
  });
};

const sendMessages = async (recipients, text) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = twilio(accountSid, authToken);

  let r;

  for (r of recipients) {
    try {
      console.log(
        chalk.default.yellowBright(
          `Sending to ${r.firstName} ${r.lastName} (${r.phoneNumber})...`
        )
      );

      const message = await client.messages.create({
        body: text,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: r.phoneNumber,
      });
    } catch (e) {
      console.log(e);

      const continueWithNext = await continueAfterErrorPrompt(r);
      if (!continueWithNext) {
        break;
      }
    }
  }
};

const main = async () => {
  await doImports();

  let { message, tag } = getArgs();

  message = message.replace(/\\n/g, "\n");

  if (!tag) {
    console.log("No tag provided, sending message to everyone:");
  } else {
    console.log(`Sending message to people with tag ${tag}:`);
  }

  const db = getDatabase();
  const members = await getMembers(db, tag);

  if (!(await previewRecipients(members))) return;

  if (!(await previewText(message))) return;

  await sendMessages(members, message);
};

main();
