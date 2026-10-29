require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const foodsRouter = require('./routes/foods');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.use('/api/foods', foodsRouter);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API khong ton tai' });
});

app.use((err, req, res, next) => {
  console.error(err.message);

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Du lieu bi trung, foodId phai duy nhat'
    });
  }

  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  res.status(500).json({
    success: false,
    message: 'Loi may chu'
  });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  if (!process.env.MONGODB_URI) {
    console.error('Thieu MONGODB_URI trong file .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Da ket noi MongoDB Atlas');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server dang chay tai cong ${PORT}`);
    });
  } catch (err) {
    console.error('Khong the ket noi MongoDB:', err.message);
    process.exit(1);
  }
}

startServer();
