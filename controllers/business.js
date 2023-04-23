import { Business } from '../models.js';

export default class BusinessController {
  static async create(req, res) {
    const { name, description } = req.body;
    const business = await Business.create({ name, description });

    return res.send({ data: business })
  }

  static async getOne(req, res) {
    const { id } = req.params;
    const business = await Business.findById(id);

    return res.send({ data: business })
  }
}
