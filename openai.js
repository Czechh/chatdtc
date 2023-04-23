import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

export const prompt = async (prompt) =>
  openai
    .createCompletion({
      model: 'gpt-3.5-turbo',
      prompt,
    })
    .then((res) => res.data.choices[0].text)

export const promptImage = (prompt, dim = '1024x1024') =>
  openai
    .createImage({
      prompt,
      n: 1,
      size: dim, // 896x912
    })
    .then((res) => res.data.data[0].url)
