import jwt from 'jsonwebtoken';

export const requireAuth = (roles = []) => {
  return (req, res, next) => {
    try {
      const header = req.headers.authorization || '';
      const token = header.startsWith('Bearer ') ? header.slice(7) : null;
      if (!token) return res.status(401).json({ message: 'Unauthorized' });
      const secret = process.env.JWT_SECRET;
      const payload = jwt.verify(token, secret);
      req.user = { id: payload.sub, role: payload.role };
      if (roles.length && !roles.includes(payload.role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}
