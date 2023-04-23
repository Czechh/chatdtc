import { prompt } from "../openai.js";
import { Business } from "../models.js";

export default class BusinessController {
  static async create(req, res) {
    const { name, description } = req.body;
    const business = await Business.create({ name, description });
    const promptRes =
      prompt(`Given a business with this philosophy return a JSON object with the following Keys:
      "theme": "string",
      "product": "string",
      "targetDemographic": "string"

      Business Name and Philosophy:
      Name: ${name}
      Philosophy: ${description}
      Result:
      `);

    console.log(promptRes);
    return res.send({ data: business });
  }

  static async getOne(req, res) {
    const { id } = req.params;
    const business = await Business.findById(id);

    return res.send({ data: business });
  }
}
