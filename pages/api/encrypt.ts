import { encrypt } from "../../utility/encrypt";
import router from "../../router";

router.post(async (req, res) => {
  const uncrypted = req.body.unencrypted[0];

  const text = [...uncrypted].map((e) => {
    const char = encrypt(e);

    if (char) return char;

    return e;
  });

  res.send({
    encrypted: text.join(``),
  });
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
