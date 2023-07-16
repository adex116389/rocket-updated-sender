import fs from "fs";
import { data } from "../../../data";
import { delay } from "../../../utility/delay";
import { numbersToArray } from "../../../utility/numbersToArray";
import { Vonage } from "@vonage/server-sdk";
import { rand } from "../../../utility/rand";
import router from "../../../router";

router.post(async (req, res) => {
  const file = req.files.file;
  const values = JSON.parse(req.body.data);
  let numbers = numbersToArray(
    file ? fs.readFileSync(file[0].path).toString() : values.numbers
  ).map((number) => `+${number}`);

  const message = values.message;
  const apiKey = values.apiKey;
  const apiSecret = values.apiSecret;
  const senderId = values.senderId;
  const fromNumbers = values.fromNumbers;

  const vonage = new Vonage(
    // @ts-ignore
    {
      apiKey,
      apiSecret,
    }
  );

  res?.socket?.server?.io?.emit("loading", {
    status: true,
  });

  res?.socket?.server?.io?.emit("allSent", false);

  for (const number of numbers) {
    if (data.stopSending) break;

    try {
      await vonage.sms.send({
        to: number,
        from: senderId || rand(fromNumbers as string[]),
        text: message,
      });
    } catch (error) {
      console.error(`error:`, error);
    }

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
