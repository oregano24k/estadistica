import React from 'react';
import { ImageUploader } from './ImageUploader';
import { ConvertIcon } from './IconComponents';

interface ConfigurationProps {
    onImageUpload: (file: File) => void;
    imageUrl: string | null;
    onConvert: () => void;
    onClear: () => void;
    isLoading: boolean;
    imageFile: File | null;
}

export const Configuration: React.FC<ConfigurationProps> = ({
    onImageUpload,
    imageUrl,
    onConvert,
    onClear,
    isLoading,
    imageFile,
}) => {
    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-slate-200 mb-4">Sección de Configuración</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <ImageUploader onImageUpload={onImageUpload} imageUrl={imageUrl} />
                <div className="flex flex-col space-y-4 mt-4 md:mt-0">
                     <p className="text-slate-400 text-sm">
                        Sube una imagen para analizar. Una vez cargada, puedes procesarla para extraer el texto o borrarla para empezar de nuevo.
                    </p>
                    <button
                        onClick={onConvert}
                        disabled={!imageFile || isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg shadow-indigo-600/30 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:ring-opacity-50"
                      >
                        {isLoading ? (
                          'Procesando...'
                        ) : (
                         <>
                            <ConvertIcon />
                            Convertir Imagen a Texto
                         </>
                        )}
                    </button>
                    <button 
                        onClick={onClear}
                        disabled={!imageFile || isLoading}
                        className="w-full bg-red-600 hover:bg-red-500 disabled:bg-red-900 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
                    >
                        Borrar Imagen y Datos
                    </button>
                </div>
            </div>
        </div>
    );
};
