import { data } from "../../data";
import router from "../../router";

router.post(async (req, res) => {
  const stopSending = JSON.parse(req.body.data[0]).stopSending;

  res?.socket?.server?.io?.emit("loading", {
    status: !stopSending,
  });

  data.stopSending = stopSending;

  res.end();
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
