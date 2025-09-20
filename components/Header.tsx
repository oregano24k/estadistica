import React from 'react';
import { OcrIcon } from './IconComponents';

interface HeaderProps {
    username: string;
    onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ username, onLogout }) => {
  return (
    <header className="relative text-center pt-12 sm:pt-0">
      <div className="absolute top-0 right-0 flex items-center gap-4">
        <span className="text-slate-400 hidden sm:inline">
            Bienvenido, <span className="font-bold text-slate-200">{username}</span>
        </span>
        <button
            onClick={onLogout}
            className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 text-sm"
        >
            Salir
        </button>
      </div>
      <div className="inline-flex items-center gap-4">
        <OcrIcon />
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 to-indigo-500 text-transparent bg-clip-text">
          OCR con Gemini
        </h1>
      </div>
      <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
        Sube una imagen para extraer instantáneamente todo su texto. Impulsado por la inteligencia artificial multimodal de Google Gemini.
      </p>
    </header>
  );
};
