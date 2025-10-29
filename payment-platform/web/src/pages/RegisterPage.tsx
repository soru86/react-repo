import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export function RegisterPage() {
  const [email, setEmail] = useState("newuser@example.com");
  const [name, setName] = useState("New User");
  const [password, setPassword] = useState("Password123!");
  const [role, setRole] = useState<"PROVIDER" | "MERCHANT">("MERCHANT");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const navigate = useNavigate();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(null);
    try {
      await api.post("/auth/register", { email, password, name, role });
      setOk("Registered! Please log in.");
      setTimeout(() => navigate("/login"), 800);
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || "Registration failed");
    }
  }

  return (
    <div className="max-w-md mx-auto px-4">
      <div className="card p-4 sm:p-6">
        <h1 className="text-lg sm:text-xl font-semibold mb-4">Register</h1>
        {error && (
          <div className="mb-3 text-sm text-red-600 dark:text-red-400">{error}</div>
        )}
        {ok && (
          <div className="mb-3 text-sm text-green-600 dark:text-green-400">{ok}</div>
        )}
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block mb-1 text-sm font-medium">Name</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Role</label>
            <select
              className="input"
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
            >
              <option value="MERCHANT">Merchant</option>
              <option value="PROVIDER">Provider</option>
            </select>
          </div>
          <button className="btn w-full" type="submit">
            Create Account
          </button>
        </form>
        <p className="mt-3 text-xs sm:text-sm text-center">
          Have an account?{" "}
          <Link className="underline font-medium" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
