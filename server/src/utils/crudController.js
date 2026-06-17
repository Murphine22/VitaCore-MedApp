import asyncHandler from 'express-async-handler';

/**
 * Build a standard set of CRUD route handlers for a Mongoose model.
 * @param {import('mongoose').Model} Model
 * @param {object} options
 * @param {string[]} options.searchFields - fields included in ?search= text matching
 * @param {function} [options.beforeSave] - async (body, req) => body, mutate/augment before create/update
 */
export function crudController(Model, { searchFields = [], beforeSave } = {}) {
  const list = asyncHandler(async (req, res) => {
    const { search, status, sort = '-createdAt', page, limit, ...filters } = req.query;

    const query = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') query[key] = value;
    });
    if (status) query.status = status;
    if (search && searchFields.length) {
      query.$or = searchFields.map((field) => ({
        [field]: { $regex: search, $options: 'i' },
      }));
    }

    let cursor = Model.find(query).sort(sort);
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    if (!Number.isNaN(pageNum) && !Number.isNaN(limitNum)) {
      cursor = cursor.skip((pageNum - 1) * limitNum).limit(limitNum);
    }

    const [data, total] = await Promise.all([cursor.exec(), Model.countDocuments(query)]);
    res.json({ success: true, count: data.length, total, data });
  });

  const getOne = asyncHandler(async (req, res) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) {
      res.status(404);
      throw new Error(`${Model.modelName} not found`);
    }
    res.json({ success: true, data: doc });
  });

  const create = asyncHandler(async (req, res) => {
    let body = req.body;
    if (beforeSave) body = await beforeSave(body, req);
    const doc = await Model.create(body);
    res.status(201).json({ success: true, data: doc });
  });

  const update = asyncHandler(async (req, res) => {
    let body = req.body;
    if (beforeSave) body = await beforeSave(body, req);
    const doc = await Model.findById(req.params.id);
    if (!doc) {
      res.status(404);
      throw new Error(`${Model.modelName} not found`);
    }
    Object.assign(doc, body);
    await doc.save();
    res.json({ success: true, data: doc });
  });

  const remove = asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      res.status(404);
      throw new Error(`${Model.modelName} not found`);
    }
    res.json({ success: true, data: doc, message: `${Model.modelName} deleted` });
  });

  return { list, getOne, create, update, remove };
}
