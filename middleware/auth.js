const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // 1. Проверка секрета
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in .env');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // 2. Получаем header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization header' });
    }

    // 3. Извлекаем токен
    // Ожидается формат: "Bearer TOKEN"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ message: 'Invalid authorization format' });
    }

    const token = parts[1];

    if (!token) {
      return res.status(401).json({ message: 'Token missing' });
    }

    // 4. Проверка токена
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Кладём пользователя в req
    req.user = decoded;

    next();

  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};