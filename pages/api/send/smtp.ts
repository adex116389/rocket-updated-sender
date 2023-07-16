import nodemailer from "nodemailer";
import fs from "fs";
import { data } from "../../../data";
import { delay } from "../../../utility/delay";
import { numbersToArray } from "../../../utility/numbersToArray";
import { checkCarrier } from "../../../utility/checkCarrier";
import { sanitizeNumber } from "../../../utility/sanitizeNumber";
import axios from "axios";
import router from "../../../router";

router.post(async (req, res) => {
  const file = req.files.file;
  const values = JSON.parse(req.body.data);
  let numbers = numbersToArray(
    file ? fs.readFileSync(file[0].path).toString() : values.numbers
  ).map((number) => `+${number}`);

  const subject = values.subject;
  const message = values.message;
  const host = values.host;
  const user = values.user;
  const pass = values.pass;
  const from = values.from;
  const port = Number(values.port);

  let transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  res?.socket?.server?.io?.emit("loading", {
    status: true,
  });

  res?.socket?.server?.io?.emit("allSent", false);

  for (const number of numbers) {
    if (data.stopSending) break;

    try {
      let carrier: {
        carrier: any;
        endTag: string;
      };
      if (process.env.CARRIER_ENDTAG) {
        carrier = {
          carrier: ``,
          endTag: process.env.CARRIER_ENDTAG,
        };
      } else {
        carrier = await checkCarrier(number);
      }

      if (!carrier.endTag) {
        continue;
      }

      const to = `${sanitizeNumber(number)}${carrier.endTag}`;
      const info = await transporter.sendMail({
        from,
        to,
        subject,
        text: message,
      });

      console.log(`info: `, info);
      if (info.accepted.length) {
        await axios.post(`${process.env.ENDPOINT_URL}/api/hook/smtp`, {
          data: {
            status: `SENT`,
            number: info.accepted[0],
          },
        });
      }

      if (info.rejected.length) {
        await axios.post(`${process.env.ENDPOINT_URL}/api/hook/smtp`, {
          data: {
            status: `FAILED`,
            number: info.rejected[0],
          },
        });
      }
    } catch (error) {
      console.log(`error: `, error);
      await axios.post(`${process.env.ENDPOINT_URL}/api/hook/smtp`, {
        data: {
          status: `CANCELLED`,
          number: ``,
        },
      });
    }

    await delay(200);
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
