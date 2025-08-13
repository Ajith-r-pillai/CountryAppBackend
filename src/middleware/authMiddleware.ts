import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import{User}  from "../models/userModel";

export const protect = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;
  console.log(req.cookies.token);
  
  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    res.status(401).json({ message: "Token failed" });
  }
};
