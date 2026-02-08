module.exports = (...allowedRoles) => {
  return (req, res, next) => {

    // 1. Нет пользователя → не авторизован
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }

    // 2. Если роли не указаны — доступ всем авторизованным
    if (allowedRoles.length === 0) {
      return next();
    }

    // 3. Роль не разрешена
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Forbidden: insufficient permissions'
      });
    }

    // 4. Всё ок
    next();
  };
};