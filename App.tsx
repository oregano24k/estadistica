import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ResultDisplay, ExtractionResult } from './components/ResultDisplay';
import { extractTextFromImage } from './services/geminiService';
import { Login } from './components/Login';
import { Configuration } from './components/Configuration';

// Persiste el estado a través de los inicios de sesión en esta sesión para permitir que el usuario 'yo' vea la carga del admin.
let sharedExtractionResult: ExtractionResult | null = null;

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<'admin' | 'yo' | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  // Usa un estado que se puede inicializar desde la variable compartida
  const [extractionResult, setExtractionResult] = useState<ExtractionResult | null>(sharedExtractionResult);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Función para actualizar tanto el estado del componente como el estado compartido
  const updateExtractionResult = (data: ExtractionResult | null) => {
    sharedExtractionResult = data;
    setExtractionResult(data);
  };

  const handleLogin = (username: string, pass: string): boolean => {
    if (username === 'admin' && pass === 'admin') {
      setCurrentUser('admin');
      return true;
    }
    if (username === 'yo' && pass === '123') {
      setCurrentUser('yo');
      // Asegura que 'yo' vea los últimos datos al iniciar sesión
      setExtractionResult(sharedExtractionResult);
      return true;
    }
    return false;
  };
  
  const handleLogout = () => {
      setCurrentUser(null);
      // El estado se conserva en `sharedExtractionResult`
  };

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    updateExtractionResult(null); // Limpia los resultados anteriores en una nueva carga
    setError('');
  };
  
  const handleClear = () => {
    setImageFile(null);
    setImageUrl(null);
    updateExtractionResult(null);
    setError('');
    setIsLoading(false);
  };

  const fileToBase64 = (file: File): Promise<{mimeType: string, data: string}> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const [mimePart, dataPart] = result.split(';base64,');
        const mimeType = mimePart.split(':')[1];
        resolve({ mimeType, data: dataPart });
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleConvert = useCallback(async () => {
    if (!imageFile) {
      setError('Por favor, selecciona una imagen primero.');
      return;
    }

    setIsLoading(true);
    setError('');
    updateExtractionResult(null);

    try {
      const { mimeType, data } = await fileToBase64(imageFile);
      const result = await extractTextFromImage(data, mimeType);
      updateExtractionResult(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido durante la extracción de texto.');
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-7xl">
        <Header username={currentUser} onLogout={handleLogout} />
        <main className="mt-8">
          {currentUser === 'admin' ? (
            <div className="flex flex-col gap-8">
                <Configuration
                    onImageUpload={handleImageUpload}
                    imageUrl={imageUrl}
                    onConvert={handleConvert}
                    onClear={handleClear}
                    isLoading={isLoading}
                    imageFile={imageFile}
                />
              <ResultDisplay result={extractionResult} isLoading={isLoading} error={error} userRole={currentUser} />
            </div>
          ) : ( // Cuando currentUser es 'yo'
            <ResultDisplay result={extractionResult} isLoading={isLoading} error={error} userRole={currentUser} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;