import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

export const prompt = async (p) =>
  openai.createCompletion({
    model: 'text-davinci-003',
    prompt: 'Hello world',
  })

export const promptImage = (p) =>
  openai
    .createImage({
      prompt: prompt,
      n: 1,
      size: '1024x1024',
    })
    .then((res) => res.data.data[0].url)
