import fs from "fs";
import axios from "axios";
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
  const baseUrl = values.url;
  const apiKey = values.key;
  const from = values.senderId || `Rocket`;

  if (!baseUrl) {
    res.status(500).send(`Please provide your account BASE URL`);
    return;
  }

  if (!apiKey) {
    res.status(500).send(`Please provide your account API KEY`);
    return;
  }

  res?.socket?.server?.io?.emit("loading", {
    status: true,
  });

  try {
    const messages = numbers.map((number) => {
      let text = message;

      if (text.includes("[id]")) {
        const randomId = generateRandomId();
        text = text.replace("[id]", randomId.toUpperCase());
      }

      return {
        destinations: [{ to: number }],
        from,
        text,
        notifyContentType: `application/json`,
        notifyUrl: `${process.env.ENDPOINT_URL}/api/hook/infobip`,
      };
    });

    const options = {
      messages,
    };

    const response = await axios.post(
      `${baseUrl}/sms/2/text/advanced` as string,
      options,
      {
        headers: {
          Authorization: `App ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    res?.socket?.server?.io?.emit("allSent", true);

    res?.socket?.server?.io?.emit("loading", {
      status: null,
    });

    data.stopSending = false;
    res.send(`Okay`);
  } catch (error) {
    console.log(`error: `, error);
    data.stopSending = false;
    res.send(error);
  }
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
