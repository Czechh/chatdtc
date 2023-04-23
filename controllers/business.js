import { prompt, promptImage } from '../openai.js'
import { Business } from '../models.js'
import {
  generateImageTagsPrompt,
  generateThesisPrompt,
  generateSloganAndHeaderPrompt,
  generateWebsiteBannerPrompt,
} from '../product_iteration.js'

export default class BusinessController {
  static async create(req, res) {
    const { philosophy } = req.body
    const thesisPrompt = generateThesisPrompt('NONE', philosophy)
    const thesis = await prompt(thesisPrompt)
    const imageTagPrompt = generateImageTagsPrompt(thesis)
    const sloganHeaderPrompt = generateSloganAndHeaderPrompt(thesis)
    const [imageTags, sloganAndHeader] = await Promise.all([
      prompt(imageTagPrompt),
      prompt(sloganHeaderPrompt),
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

    const bannerPrompt = generateWebsiteBannerPrompt(imageTags)
    const banner = await promptImage(bannerPrompt)

    const business = await Business.create({
      philosophy,
      marketInsight: 'NONE',
      thesis,
      banner,
      slogan,
      header,
      imageTags,
    })

    return res.send({ data: business })
  }

  static async getOne(req, res) {
    const { id } = req.params
    const business = await Business.findById(id)

    return res.send({ data: business })
  }
}
