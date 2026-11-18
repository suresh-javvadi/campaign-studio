const jwt = require('jsonwebtoken');

const COOKIE_NAME = 'cs_token';
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required.');
}

function signToken(userId) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '30d' });
}

function setAuthCookie(res, userId) {
  res.cookie(COOKIE_NAME, signToken(userId), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
}

function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME);
}

function readUserId(req) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET).sub;
  } catch {
    return null;
  }
}

function requireAuth(req, res, next) {
  const userId = readUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'You must be logged in.' });
  }
  req.userId = userId;
  next();
}

function attachUserIfPresent(req, _res, next) {
  req.userId = readUserId(req);
  next();
}

module.exports = {
  COOKIE_NAME,
  setAuthCookie,
  clearAuthCookie,
  requireAuth,
  attachUserIfPresent,
};
