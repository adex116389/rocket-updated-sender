import { createRouter } from "next-connect";
import { NextApiResponseServerIO } from "../../../types/next";
import { ExtendedRequest } from "../../../types/ExtendedRequest";

const router = createRouter<ExtendedRequest, NextApiResponseServerIO>();

router.get(async (req, res) => {
  const status = req.query.status;
  const number = req.query.recipient;

  const message = {
    response: `Message to ${number} ${status}`,
  };

  res?.socket?.server?.io?.emit("status", {
    number,
    status,
  });

  res.status(201).json(message);
});

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
