import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { FiLock, FiMail } from "react-icons/fi";
import { api } from "../../service/apiClient";
import { setSession } from "../../lib/cookie";
import { useApp } from "../../context/Context";
import { Logo } from "../../components/Logo/Logo";


export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { setRefresh } = useApp();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Ajuste a rota e o campo do token conforme sua API
      const { data } = await api.post("/auth/user", { email, senha:password });
      setSession(data.acessToken, data.refreshToken);
      setRefresh((prev: boolean) => !prev);
      navigate("/dashboard");
    } catch {
      setError("E-mail ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-stone-900 p-4">
      <div className="w-full max-w-sm rounded-lg border border-stone-200 bg-white p-6">
        {/* Logo */}
        <div className="mb-6 flex items-center justify-center gap-2 bg-black/80 p-5 rounded-lg text-stone-900">
         <Logo/>
        </div>

        <h1 className="mb-1 text-2xl font-bold text-stone-900">Painel admin</h1>
        <p className="mb-6 text-sm text-stone-500">Entre para continuar.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-stone-900">
              E-mail
            </span>
            <div className="flex items-center gap-2 rounded-md border border-stone-200 px-3 py-2 focus-within:border-red-500">
              <FiMail size={18} className="text-stone-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full bg-transparent text-sm text-stone-900 outline-none"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-stone-900">
              Senha
            </span>
            <div className="flex items-center gap-2 rounded-md border border-stone-200 px-3 py-2 focus-within:border-red-500">
              <FiLock size={18} className="text-stone-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-sm text-stone-900 outline-none"
              />
            </div>
          </label>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-md bg-vermelho-600 px-3 py-2 text-sm font-medium text-branco disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}