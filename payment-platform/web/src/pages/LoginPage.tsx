import { FormEvent, useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { api, setAuthToken, storeUser, getStoredUser } from "../lib/api";

export function LoginPage() {
  const [email, setEmail] = useState("merchant@example.com");
  const [password, setPassword] = useState("Password123!");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = getStoredUser();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post("/auth/login", { email, password });
      const { accessToken, user } = res.data;
      setAuthToken(accessToken);
      storeUser(user);
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || "Login failed");
    }
  }

  return (
    <div className="max-w-md mx-auto px-4">
      <div className="card p-4 sm:p-6">
        <h1 className="text-lg sm:text-xl font-semibold mb-4">Login</h1>
        {error && (
          <div className="mb-3 text-sm text-red-600 dark:text-red-400">{error}</div>
        )}
        <form onSubmit={onSubmit} className="space-y-3">
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
          <button className="btn w-full" type="submit">
            Sign In
          </button>
        </form>
        <p className="mt-3 text-xs sm:text-sm text-center">
          No account?{" "}
          <Link className="underline font-medium" to="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
