import { createRouter } from "next-connect";
import multiparty from "multiparty";
import { ExtendedRequest } from "../types/ExtendedRequest";
import { NextApiResponseServerIO } from "../types/next";

const router = createRouter<ExtendedRequest, NextApiResponseServerIO>();

router.use((request, _response, next) => {
  const form = new multiparty.Form();

  form.parse(request, async (_err, fields, files) => {
    request.body = fields;
    request.files = files;
    await next();
  });
});

export const middleware = (
  request: ExtendedRequest,
  response: NextApiResponseServerIO
) => {
  return router.run(request, response);
};

export default router;
