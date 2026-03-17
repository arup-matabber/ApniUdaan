"use client"

// src/components/auth/SignupPage.jsx
import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { User, Mail, Lock, Phone } from "lucide-react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

export default function SignupPage({ onSwitch }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", mobile: "" })
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Signup data:", form)
    navigate("/profile/form")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-pink-50 px-4">
      <Card className="w-full max-w-md border-0 shadow-xl rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-pink-500 bg-clip-text text-transparent">
            Create Account
          </CardTitle>
          <p className="text-gray-500 text-sm mt-2">Sign up to get started</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600">Full Name</label>
              <div className="relative mt-1">
                <Input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="pl-10 rounded-lg"
                  placeholder="Your Name"
                  required
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <div className="relative mt-1">
                <Input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="pl-10 rounded-lg"
                  placeholder="you@example.com"
                  required
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Mobile Number</label>
              <div className="relative mt-1">
                <Input
                  type="tel"
                  name="mobile"
                  value={form.mobile}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, "").slice(0, 10)
                    setForm((prev) => ({ ...prev, mobile: numericValue }))
                  }}
                  className="pl-10 rounded-lg"
                  placeholder="Enter 10-digit mobile number"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  required
                />
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Password</label>
              <div className="relative mt-1">
                <Input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="pl-10 rounded-lg"
                  placeholder="********"
                  required
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-sky-500 to-pink-500 text-white rounded-lg hover:opacity-90"
            >
              Sign Up
            </Button>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login">
                <button type="button" onClick={onSwitch} className="text-sky-600 hover:underline font-medium">
                  Login
                </button>
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
