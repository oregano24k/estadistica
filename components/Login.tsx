import React, { useState } from 'react';
import { OcrIcon, UserIcon, LockIcon } from './IconComponents';

interface LoginProps {
  onLogin: (username: string, pass: string) => boolean;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = onLogin(username, password);
    if (!success) {
      setError('Usuario o clave incorrecta.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <div className="inline-flex items-center gap-4">
                <OcrIcon />
                <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 to-indigo-500 text-transparent bg-clip-text">
                OCR con Gemini
                </h1>
            </div>
            <p className="mt-2 text-slate-400">Por favor, inicia sesión para continuar</p>
        </div>
        
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
                Usuario
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <UserIcon />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full rounded-md border-0 bg-slate-700 py-3 pl-10 pr-3 text-white ring-1 ring-inset ring-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password"className="block text-sm font-medium text-slate-300 mb-2">
                Clave
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <LockIcon />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border-0 bg-slate-700 py-3 pl-10 pr-3 text-white ring-1 ring-inset ring-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-400 text-center">{error}</p>}

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors duration-300"
              >
                Iniciar Sesión
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};