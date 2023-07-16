import { ExtendedRequest } from "../../../types/ExtendedRequest";
import { NextApiResponseServerIO } from "../../../types/next";
import { numbersToArray } from "../../../utility/numbersToArray";
import fs from "fs";
import tl from "twilio";
import { data } from "../../../data";
import router from "../../../router";

router.post(async (req: ExtendedRequest, res: NextApiResponseServerIO) => {
  const file = req.files.file;
  const values = JSON.parse(req.body.data);
  let numbers = numbersToArray(
    file ? fs.readFileSync(file[0].path).toString() : values.numbers
  ).map((number) => {
    return JSON.stringify({ binding_type: "sms", address: number });
  });

  const message = values.message;
  const accountSID = values.sid;
  const authToken = values.token;
  const serviceSID = values.msgServiceSID;

  if (!accountSID) {
    res.status(500).send(`Please provide your account SID`);
    return;
  }

  if (!authToken) {
    res.status(500).send(`Please provide your account auth token`);
    return;
  }

  if (!serviceSID) {
    res.status(500).send(`Please provide your account notify service SID`);
    return;
  }

  const twilio = tl(accountSID, authToken);

  const service = twilio.notify.services(serviceSID);

  service.notifications
    .create({
      toBinding: numbers,
      body: message,
      deliveryCallbackUrl: `${process.env.ENDPOINT_URL}/api/hook/twilio`,
    })
    .then((notification) => {
      console.log(notification);
    })
    .catch((err) => {
      console.error(err);
    });

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
