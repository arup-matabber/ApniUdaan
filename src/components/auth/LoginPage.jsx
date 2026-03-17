// src/components/auth/LoginPage.jsx
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { User, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ onSwitch }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login data:", form);
    navigate("/quiz");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-pink-50 px-4">
      <Card className="w-full max-w-md border-0 shadow-xl rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-pink-500 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <p className="text-gray-500 text-sm mt-2">Login to your account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
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
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
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
              Login
            </Button>

            <p className="text-center text-sm text-gray-500">
              Don’t have an account?{" "}
              <Link to="/signup">
              <button
                type="button"
                onClick={onSwitch}
                className="text-pink-600 hover:underline font-medium"
              >
                Sign up
              </button>
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
