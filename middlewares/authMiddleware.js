export const authenticateReq = (next) => {
  return (root, args, context, info) => {
    if (!context.isAuthenticated) {
      throw new Error('Ошибка авторизации 55');
    }
    return next(root, args, context, info);
  };
};
