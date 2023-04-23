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

const generateThesisPrompt = (marketingInsight, philosophy) => `here’s our marketing insight:
marketing insights: ${marketingInsight}
Here’s our business philosophy: ${philosophy}
incorporate these into a business thesis that will guide marketing, design, and overall business, keep it 100 words or less. Make sure that it is consistent with the business philosophy but also incorporates recent feedback`

async function getNewData(business, events) {
  const marketingPrompt = generateMarketingInsightPrompt(events, business.marketingInsight)
  const newMarketingInsight = await openai.prompt(marketingPrompt)
  const thesisPrompt = generateThesisPrompt(newMarketingInsight, business.philosophy)
  const newThesis = await openai.prompt(thesisPrompt)

  return { newThesis, newMarketingInsight }
}

export default async function iterateProduct(business, events) {
  const { newThesis, newMarketingInsight } = await getNewData(business, events)
  const newBusiness = await Business.findOneAndUpdate(
    { _id: business._id },
    { $set: { thesis: newThesis, marketingInsight: newMarketingInsight } }
  )

  console.log('newBusiness', newBusiness)
}
