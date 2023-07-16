import fs from "fs";
import { data } from "../../../data";
import { delay } from "../../../utility/delay";
import { numbersToArray } from "../../../utility/numbersToArray";
import TeleSignSDK from "telesignsdk";
import { sanitizeNumber } from "../../../utility/sanitizeNumber";
import axios from "axios";
import router from "../../../router";

router.post(async (req, res) => {
  const file = req.files.file;
  const values = JSON.parse(req.body.data);
  let numbers = numbersToArray(
    file ? fs.readFileSync(file[0].path).toString() : values.numbers
  ).map((number) => `+${number}`);

  const message = values.message;
  const apiKey = values.apiKey;
  const senderId = values.senderId;
  const fromNumbers = values.fromNumbers;
  const rest_endpoint = "https://rest-api.telesign.com";
  const customerId = values.customerId;
  const timeout = 10 * 1000; // 10 secs
  const messageType = "ARN";

  const client = new TeleSignSDK(
    customerId,
    apiKey,
    rest_endpoint,
    timeout // optional
    // userAgent
  );

  res?.socket?.server?.io?.emit("loading", {
    status: true,
  });

  res?.socket?.server?.io?.emit("allSent", false);

  for (const number of numbers) {
    if (data.stopSending) break;
    try {
      client.sms.message(
        async (error: any, responseBody: any) => {
          if (error === null) {
            await axios.post(`${process.env.ENDPOINT_URL}/api/hook/telesign`, {
              data: {
                number,
                status:
                  responseBody["status"]["code"] === 290
                    ? `sent`
                    : responseBody["status"]["code"] === 203
                    ? `delivered`
                    : `failed`,
              },
            });

            await client.sms.status((error: any, responseBody: any) => {
              console.log(`responseBody: `, responseBody);
            }, responseBody["reference_id"]);
          } else {
            console.log(`error: `, error);

            await axios.post(`${process.env.ENDPOINT_URL}/api/hook/telesign`, {
              data: {
                number,
                status: `failed`,
              },
            });
          }
        },
        sanitizeNumber(number),
        message,
        messageType
      );
    } catch (error) {
      console.error(`error:`, error);
    }

    await delay(1100);
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
