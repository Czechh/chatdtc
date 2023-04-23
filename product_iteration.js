import * as openai from './openai.js'
import { Business } from './models.js'

const generateMarketingInsightPrompt = (
  events,
  prevMarketingInsight
) => `As a top marketing analyst, analyze the following customer feedback and recent customization requests to identify trends. Update the existing customer insights with new findings, and keep the current insights if they still apply.
  Please find below the details of the past 10 orders and their reviews: ${events
    .map((e) => e.context)
    .join('\n')}
Here are the previous customer insights: ${prevMarketingInsight}
Please provide a concise summary of the updated insights in bullet-point format, under 100 words. Focus on the most significant trends, and only mention specific examples if they consistently appear. Return only the final insights without additional commentary.`

export const generateThesisPrompt = (marketingInsight, philosophy) => `here’s our marketing insight:
marketing insights: ${marketingInsight}
Here’s our business philosophy: ${philosophy}
incorporate these into a business thesis that will guide marketing, design, and overall business, keep it 100 words or less. Make sure that it is consistent with the business philosophy but also incorporates recent feedback`

export const generateSloganAndHeaderPrompt = (
  thesis
) => `You are an agent which converts a business thesis into a header and slogan for a custom t-shirt website.
Here are some examples for different thesis categories:
- Anime
 {"header"": "Cartoon Capes"","slogan"": "Anime apparel for the ultimate fan"}

- Holidays
 {"header"": "Warm Holidays"","slogan"": "Clothing that brings joy to the season"}

- Fitness
 {"header"": "Steel Fits"","slogan"": "Train harder, go further"}

- Luxury
 {"header"": "Sleek Central"","slogan"": "Style that exudes elegance"}

- Eco-friendly
 {"header"": "Love Earth Shirts"","slogan"": "Eco-chic for a sustainable world"}

Our business thesis is:
${thesis}

Provide a header and slogan. Do not use inappropriate or rude words. Do not emit any text other than the JSON containing the header and slogan
`

export const generateImageTagsPrompt = (
  thesis
) => `You are an agent which converts a business thesis into a series of tags used to describe an image.
Here are some examples for different thesis categories:
- Anime: "highly detailed, digital painting, sharp focus, illustration, colorful"
- Holidays: "wintry, cozy, 100mm lens, oil painting, highly detailed, beautiful"
- Luxury: "elegant, modern design, artstation, render, album art"
- Eco-friendly: "organic green, nature, award winning, sprite, abstract shape"

Our business thesis is:
${thesis}

First, think about which category the thesis belongs in. Then, provide a series of tags in quotations. Only provide 4-5 tags at maximum.
`

export const generateWebsiteBannerPrompt = (tags) => `header, pattern, ${tags}`
export const generateAdsPrompt = (tags) => `eye-catching, clothing advertisement, minimal, ${tags}`

async function getNewData(business, events) {
  console.log('events', events)
  const marketingPrompt = generateMarketingInsightPrompt(events, business.marketingInsight)
  const newMarketingInsight = await openai.prompt(marketingPrompt)
  const thesisPrompt = generateThesisPrompt(newMarketingInsight, business.philosophy)
  const newThesis = await openai.prompt(thesisPrompt)

  const imageTagPrompt = generateImageTagsPrompt(newThesis)
  const sloganHeaderPrompt = generateSloganAndHeaderPrompt(newThesis)
  const [newImageTags, sloganAndHeader] = await Promise.all([
    openai.prompt(imageTagPrompt),
    openai.prompt(sloganHeaderPrompt),
  ])

  let slogan = ''
  let header = ''
  console.log(sloganAndHeader)

  try {
    const parsedJob = JSON.parse(sloganAndHeader)
    slogan = parsedJob.slogan
    header = parsedJob.header
  } catch (err) {
    console.log(err)
  }

  const bannerPrompt = generateWebsiteBannerPrompt(newImageTags)
  const newBanner = await openai.promptImage(bannerPrompt)

  return {
    newThesis,
    newMarketingInsight,
    newSlogan: slogan,
    newHeader: header,
    newImageTags,
    newBanner,
  }
}

export default async function iterateProduct(business, events) {
  const { newThesis, newMarketingInsight, newHeader, newSlogan, newImageTags, newBanner } =
    await getNewData(business, events)
  const newBusiness = await Business.findOneAndUpdate(
    { _id: business._id },
    {
      $set: {
        thesis: newThesis,
        marketingInsight: newMarketingInsight,
        slogan: newSlogan,
        header: newHeader,
        imageTags: newImageTags,
        banner: newBanner,
      },
    }
  )

  console.log('newBusiness', newBusiness)
}
