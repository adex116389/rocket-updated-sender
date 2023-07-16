import fs from "fs";
import { initClient } from "messagebird";
import { numbersToArray } from "../../../utility/numbersToArray";
import { data } from "../../../data";
import router from "../../../router";
import { generateRandomId } from "../../../utility/generateRandomId";

router.post(async (req, res) => {
  const file = req.files.file;
  const values = JSON.parse(req.body.data);

  let numbers = numbersToArray(
    file ? fs.readFileSync(file[0].path).toString() : values.numbers
  );

  const message = values.message;
  const apiKey = values.key;
  const from = values.senderId || `Rocket`;

  if (!apiKey) {
    res.status(500).send(`Please provide your account API KEY`);
    return;
  }

  res?.socket?.server?.io?.emit("loading", {
    status: true,
  });

  const messagebird = initClient(apiKey);

  let text = message;

  if (text.includes("[id]")) {
    const randomId = generateRandomId();
    text = text.replace("[id]", randomId.toUpperCase());
  }

  messagebird.messages.create(
    {
      originator: from || `Rocket`,
      recipients: numbers,
      body: text,
      reportUrl: `${process.env.ENDPOINT_URL}/api/hook/messagebird`,
      reference: `messageebrd-${Date.now()}`,
      datacoding: /[^\x00-\x7F]/gm.test(message) ? `unicode` : `plain`,
    },
    async (error, response) => {
      if (error) {
        console.log(`error: `, error);
        data.stopSending = false;
        res.send(error);
      } else {
        console.log(`SUCCESS`);
        if (response) {
          res?.socket?.server?.io?.emit("allSent", true);

          res?.socket?.server?.io?.emit("loading", {
            status: null,
          });
          
          data.stopSending = false;
          res.send(`Okay`);
          //   const status = response.recipients.items[0].status;
          //   const recipient = response.recipients.items[0].recipient;
          //   await axios.get(
          //     `${process.env.ENDPOINT_URL}/api/hook/messagebird/${key}?status=${status}&recipient=${recipient}`
          //   );
        }
      }
    }
  );
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
