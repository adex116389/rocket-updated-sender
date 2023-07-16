import type { NextApiRequest } from "next";

interface ExtendedRequest extends NextApiRequest {
    files: any;
  }
  