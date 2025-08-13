import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { IUser, User } from "../models/userModel";
import { sign, verify } from "jsonwebtoken";

// Generate JWT token
const genToken = (id: string): string => {
  const secret = process.env.JWT_SECRET!;
  if (!secret) throw new Error("JWT_SECRET is not defined");
  const expiresIn = process.env.JWT_EXPIRE ?? "1d";
  return sign({ id }, secret, { expiresIn: expiresIn as any });
};

// Cookie options for dev
const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: false, // false for dev
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};

// @desc Register new user
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user: IUser = await User.create({ name, email: email.toLowerCase(), password: hashed });

    const token = genToken(user._id.toString());

    res
      .cookie("token", token, cookieOptions)
      .status(201)
      .json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc Login user
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
console.log(user);

    const match = await bcrypt.compare(password, user.password);
    console.log(match);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });


    const token = genToken(user._id.toString());

    res
      .cookie("token", token, cookieOptions)
      .json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc Logout user
export const logoutUser = async (req: Request, res: Response) => {
  res.clearCookie("token", cookieOptions)
     .json({ message: "Logged out" });
};

// @desc Get current user
export const getMe = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const secret = process.env.JWT_SECRET!;
    const decoded: any = verify(token, secret);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(401).json({ message: "Invalid token", error });
  }
};
