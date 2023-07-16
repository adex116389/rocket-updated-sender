import axios from "axios";

export const checkCarrier = async (number: string | number) => {
  const { data } = await axios.get(
    `https://api.numlookupapi.com/v1/validate/${number}?apikey=${process.env.NUMLOOKUPAPI_KEY}`
  );

  const carrier = data ? data.carrier : ``;
  const location = data ? data.location : ``;

  const endTag = getEndTag(carrier.toLowerCase(), location);

  return {
    carrier,
    endTag,
  };
};

const getEndTag = (carrier: string, location?: string) => {
  carrier = carrier.toLowerCase();
  if (carrier.includes(`at&t`)) {
    return `@txt.att.net`;
  } else if (carrier.includes(`t-mobile`)) {
    return `@tmomail.net`;
  }
  if (carrier.includes(`metro`)) {
    return `@mymetropcs.com`;
  }
  if (carrier.includes(`sprint`)) {
    return `@messaging.sprintpcs.com`;
  }
  if (carrier.includes(`us cellular`)) {
    return `@email.uscc.net`;
  }
  if (
    carrier.includes(`verizon`) ||
    location === "Denver" ||
    carrier.includes(`boost`)
  ) {
    return `@vtext.com`;
  }
  if (carrier.includes(`virgin`)) {
    return `@vmobl.com`;
  } else {
    return `@tmomail.net`;
  }
};
