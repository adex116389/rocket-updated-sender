import fs from "fs";
import { data } from "../../../data";
import { delay } from "../../../utility/delay";
import { numbersToArray } from "../../../utility/numbersToArray";
import * as api from "../../../utility/clicksendApi";
import router from "../../../router";

router.post(async (req, res) => {
  const file = req.files.file;
  const values = JSON.parse(req.body.data);
  let numbers = numbersToArray(
    file ? fs.readFileSync(file[0].path).toString() : values.numbers
  ).map((number) => `+${number}`);

  const message = values.message;
  const apiKey = values.apiKey;
  const username = values.username;
  const fromNumbers = values.fromNumbers.split(`,`);
  // const senderId = values.senderId;

  // const telnyx = tx(apiKey);

  res?.socket?.server?.io?.emit("loading", {
    status: true,
  });

  res?.socket?.server?.io?.emit("allSent", false);

  for (const number of numbers) {
    if (data.stopSending) break;

    var smsMessage = new api.SmsMessage();

    smsMessage.from =
      fromNumbers[Math.floor(Math.random() * fromNumbers.length)];
    smsMessage.to = number;
    smsMessage.body = message;

    var smsApi = new api.SMSApi(username, apiKey);

    var smsCollection = new api.SmsMessageCollection();

    smsCollection.messages = [smsMessage];

    smsApi
      .smsSendPost(smsCollection)
      .then(function (response: any) {
        console.log(response.body);
      })
      .catch(function (err: any) {
        console.error(err.body);
      });

    await delay(110);
  }

  res?.socket?.server?.io?.emit("loading", {
    status: false,
  });

  res?.socket?.server?.io?.emit("allSent", true);

  setTimeout(() => {
    res?.socket?.server?.io?.emit("loading", {
      status: null,
    });
  }, 5000);

  data.stopSending = false;
  res.send(`Okay`);
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
