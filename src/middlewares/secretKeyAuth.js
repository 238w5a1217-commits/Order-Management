const secretKeyAuth = (req, res, next) => {
  const key = req.headers['x-secret-key'];
  if (!key || key !== process.env.SCHEDULER_SECRET) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: invalid or missing x-secret-key header',
    });
  }
  next();
};

export default secretKeyAuth;
