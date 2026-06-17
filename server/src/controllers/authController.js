import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('name, email and password are required');
  }
  const exists = await User.findOne({ email });
  if (exists) {
    res.status(409);
    throw new Error('A user with that email already exists');
  }
  const user = await User.create({ name, email, password, role });
  res.status(201).json({ success: true, token: signToken(user), user });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error('email and password are required');
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }
  if (!user.active) {
    res.status(403);
    throw new Error('Account is disabled');
  }
  res.json({ success: true, token: signToken(user), user });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});
