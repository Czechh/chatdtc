import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export const prompt = (p) =>
  replicate.run(
    "rossjillian/controlnet:d55b9f2dcfb156089686b8f767776d5b61b007187a4e1e611881818098100fbb",
    {
      input: {
        image: p,
      },
    }
  );
