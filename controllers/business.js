import { prompt } from '../openai.js'
import { Business } from '../models.js'
import { generateThesisPrompt } from '../product_iteration.js'

export default class BusinessController {
  static async create(req, res) {
    const { name, philosophy } = req.body
    const thesisPrompt = generateThesisPrompt(philosophy)
    const thesis = await prompt(thesisPrompt);

    const business = await Business.create({
      name,
      philosophy,
      marketInsight: 'NONE',
      thesis,
    })

    return res.send({ data: business })
  }

  static async getOne(req, res) {
    const { id } = req.params
    const business = await Business.findById(id)

    return res.send({ data: business })
  }
}
