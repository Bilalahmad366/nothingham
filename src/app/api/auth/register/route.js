import { connectDB } from "@/lib/db"
import User from "@/models/User"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET

export async function POST(req) {
  await connectDB()

  const { name , email, password } = await req.json()

  if (!name || !email || !password) {
    return new Response(JSON.stringify({ error: "Name , Email & password required" }), { status: 400 })
  }

  // check if user exists
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 })
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await User.create({ name , email, password: hashedPassword })

  // generate JWT
  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "7d" })

  return new Response(JSON.stringify({ message: "User created", token }), { status: 201 })
}
