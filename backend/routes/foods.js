
const express = require('express');
const mongoose = require('mongoose');
const Food = require('../models/Food');

const router = express.Router();

// Kiem tra du lieu mon an
function validateFood(body) {
  const required = [
    'foodId',
    'name',
    'category',
    'cuisine',
    'ingredients',
    'price',
    'quantity'
  ];

  const missing = required.filter(
    key =>
      body[key] === undefined ||
      body[key] === null ||
      body[key] === ''
  );

  if (missing.length > 0) {
    return `Thieu truong: ${missing.join(', ')}`;
  }

  if (!Array.isArray(body.ingredients)) {
    return 'ingredients phai la mang';
  }

  if (
    !Number.isFinite(Number(body.price)) ||
    Number(body.price) < 0
  ) {
    return 'price phai la so khong am';
  }

  if (
    !Number.isInteger(Number(body.quantity)) ||
    Number(body.quantity) < 0
  ) {
    return 'quantity phai la so nguyen khong am';
  }

  return null;
}

// Tim mon an bang MongoDB _id hoac foodId
function findFilter(id) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return {
      $or: [
        { _id: id },
        { foodId: id }
      ]
    };
  }

  return { foodId: id };
}

// Chuyen tieng Viet co dau thanh khong dau
function removeVietnameseAccents(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

// GET /api/foods
// GET /api/foods?search=pho
router.get('/', async (req, res, next) => {
  try {
    const search = (req.query.search || '').trim();

    let foods;

    if (search) {
      const normalizedSearch =
        removeVietnameseAccents(search).toLowerCase();

      const allFoods = await Food.find({})
        .sort({ createdAt: -1 });

      foods = allFoods.filter(food => {
        const fields = [
          food.name,
          food.foodId,
          food.category,
          food.cuisine,
          food.description,
          ...(food.ingredients || [])
        ];

        return fields.some(value => {
          if (value === undefined || value === null) {
            return false;
          }

          const normalizedValue =
            removeVietnameseAccents(value).toLowerCase();

          return normalizedValue.includes(normalizedSearch);
        });
      });
    } else {
      foods = await Food.find({})
        .sort({ createdAt: -1 });
    }

    return res.status(200).json({
      success: true,
      count: foods.length,
      data: foods
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/foods/:id
router.get('/:id', async (req, res, next) => {
  try {
    const food = await Food.findOne(
      findFilter(req.params.id)
    );

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Khong tim thay mon an'
      });
    }

    return res.status(200).json({
      success: true,
      data: food
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/foods
router.post('/', async (req, res, next) => {
  try {
    const message = validateFood(req.body);

    if (message) {
      return res.status(400).json({
        success: false,
        message
      });
    }

    const duplicate = await Food.findOne({
      foodId: req.body.foodId
    });

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: 'foodId da ton tai'
      });
    }

    const food = await Food.create(req.body);

    return res.status(201).json({
      success: true,
      message: 'Them thanh cong',
      data: food
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/foods/:id
router.put('/:id', async (req, res, next) => {
  try {
    const message = validateFood(req.body);

    if (message) {
      return res.status(400).json({
        success: false,
        message
      });
    }

    const food = await Food.findOne(
      findFilter(req.params.id)
    );

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Khong tim thay mon an'
      });
    }

    const duplicate = await Food.findOne({
      foodId: req.body.foodId,
      _id: { $ne: food._id }
    });

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: 'foodId da ton tai'
      });
    }

    const fields = [
      'foodId',
      'name',
      'category',
      'cuisine',
      'ingredients',
      'price',
      'quantity',
      'description',
      'imageUrl'
    ];

    for (const key of fields) {
      if (req.body[key] !== undefined) {
        food[key] = req.body[key];
      }
    }

    await food.save();

    return res.status(200).json({
      success: true,
      message: 'Cap nhat thanh cong',
      data: food
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/foods/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const food = await Food.findOneAndDelete(
      findFilter(req.params.id)
    );

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Khong tim thay mon an'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Xoa thanh cong',
      data: food
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
