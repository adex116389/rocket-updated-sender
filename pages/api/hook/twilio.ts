import { createRouter } from "next-connect";
import { NextApiResponseServerIO } from "../../../types/next";
import { ExtendedRequest } from "../../../types/ExtendedRequest";

const router = createRouter<ExtendedRequest, NextApiResponseServerIO>();

router.post(async (req, res) => {
  console.log(`body: `, req.body);

  // return message
  res.status(201);
});

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
