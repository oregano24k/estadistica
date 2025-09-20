import React, { useState, useEffect } from 'react';
import { CopyIcon, CheckIcon, ErrorIcon } from './IconComponents';
import { Loader } from './Loader';

export interface ExtractionResult {
  rawText: string;
  extractedData: {
    driversRegistered: string;
    driversApproved: string;
    driversWaitingForApproval: string;
    usersRegistered: string;
  };
}

interface ResultDisplayProps {
  result: ExtractionResult | null;
  isLoading: boolean;
  error: string;
  userRole: 'admin' | 'yo';
}

const DataCard: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="bg-slate-700/50 p-4 rounded-lg text-center">
        <p className="text-sm text-slate-400">{label}</p>
        <p className="text-2xl font-bold text-sky-400">{value || 'N/A'}</p>
    </div>
);

const DataChart: React.FC<{ data: ExtractionResult['extractedData'] }> = ({ data }) => {
    const chartData = [
        { label: 'Registrados', value: data.driversRegistered, color: 'bg-sky-500' },
        { label: 'Aprobados', value: data.driversApproved, color: 'bg-emerald-500' },
        { label: 'En Espera', value: data.driversWaitingForApproval, color: 'bg-amber-500' },
        { label: 'Usuarios', value: data.usersRegistered, color: 'bg-violet-500' },
    ];

    const numericValues = chartData.map(item => parseInt(item.value, 10) || 0);
    const maxValue = Math.max(...numericValues) || 1; // Avoid division by zero

    return (
        <div className="w-full bg-slate-900/50 p-4 rounded-lg border border-slate-700">
            <div className="flex justify-around items-end h-48">
                {chartData.map((item, index) => {
                    const value = numericValues[index];
                    const barHeight = (value / maxValue) * 100;
                    return (
                        <div key={item.label} className="flex flex-col items-center h-full justify-end w-1/4 px-2">
                             <span className="text-sm font-bold text-slate-300 mb-1">{value}</span>
                            <div
                                className={`w-full rounded-t-md ${item.color} transition-all duration-700 ease-out`}
                                style={{ height: `${barHeight}%` }}
                                title={`${item.label}: ${value}`}
                            ></div>
                            <p className="text-xs text-slate-400 mt-2 text-center">{item.label}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, isLoading, error, userRole }) => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (result) {
        setIsCopied(false);
    }
  }, [result]);

  const handleCopy = async () => {
    if (!result?.rawText) return;
    try {
      await navigator.clipboard.writeText(result.rawText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err)      {
      console.error('Failed to copy text: ', err);
    }
  };
  
  const extractedData = result?.extractedData;

  return (
    <div className={`relative flex flex-col bg-slate-800/50 border border-slate-700 rounded-lg p-6 h-auto min-h-[24.5rem] transition-all duration-300 space-y-6`}>
      {isLoading && <Loader />}
      
      {!isLoading && error && (
        <div className="m-auto text-center text-red-400">
          <ErrorIcon />
          <p className="font-semibold mt-2">Error</p>
          <p className="text-slate-400">{error}</p>
        </div>
      )}

      {!isLoading && !error && !result && (
        <div className="m-auto text-center text-slate-500">
            <p className="text-lg font-medium">Los datos extraídos aparecerán aquí</p>
            <p>Sube una imagen y haz clic en "Convertir" para empezar.</p>
        </div>
      )}
      
      {result && !isLoading && !error && extractedData && (
        <>
          <div>
            <h2 className="text-xl font-bold text-slate-200 mb-4">Datos Clave Extraídos</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <DataCard label="Drivers Registrados" value={extractedData.driversRegistered} />
                <DataCard label="Drivers Aprobados" value={extractedData.driversApproved} />
                <DataCard label="Esperando Aprobación" value={extractedData.driversWaitingForApproval} />
                <DataCard label="Usuarios Registrados" value={extractedData.usersRegistered} />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-200 mb-4">Visualización de Datos</h2>
            <DataChart data={extractedData} />
          </div>

          {userRole === 'admin' && (
            <div className="flex flex-col flex-grow min-h-0">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-bold text-slate-200">Texto Completo</h2>
                    <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold bg-slate-700 hover:bg-slate-600 rounded-md transition-colors duration-200"
                    >
                    {isCopied ? <CheckIcon /> : <CopyIcon />}
                    {isCopied ? 'Copiado' : 'Copiar'}
                    </button>
                </div>
                <textarea
                    readOnly
                    value={result.rawText}
                    className="w-full flex-grow bg-slate-900 text-slate-300 rounded-md p-4 resize-none border border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="Texto extraído..."
                    rows={8}
                />
            </div>
          )}
        </>
      )}
    </div>
  );
};