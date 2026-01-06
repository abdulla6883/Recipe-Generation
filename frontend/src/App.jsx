import React, { useState } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import ImageUpload from './components/ImageUpload';
import RecipeCard from './components/RecipeCard';

import InfoCard from './components/InfoCard';

function App() {
  const [loading, setLoading] = useState(false);
  const [recipeData, setRecipeData] = useState(null);
  const [error, setError] = useState(null);

  const handleImageGenerate = async (file) => {
    setLoading(true);
    setError(null);
    setRecipeData(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Assuming Backend runs on port 8000
      const response = await axios.post('http://localhost:8000/generate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setRecipeData(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to generate recipe. Make sure the backend is running!");
    } finally {
      setLoading(false);
    }
  };

  const triggerFileUpload = () => {
    document.getElementById('fileInput').click();
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans p-4 md:p-12 flex items-center justify-center relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-50 to-purple-50 -z-10"></div>

      <main className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">

          {/* Left Column: Input */}
          <div className="space-y-6">
            <ImageUpload onImageSelect={handleImageGenerate} isLoading={loading} />

            <div className="space-y-4">
              <button
                onClick={triggerFileUpload}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-full shadow-lg transform transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide text-sm"
              >
                {loading ? 'Processing...' : 'Upload a Food Image'}
              </button>

              <button
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-full shadow-lg transform transition-all hover:scale-[1.02] active:scale-95 uppercase tracking-wide text-sm opacity-90"
              >
                Choose from Sample Image
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm">
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            )}
          </div>

          {/* Right Column: Info or Result */}
          <div className="h-full min-h-[500px]">
            {loading ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 h-full flex flex-col items-center justify-center p-12 text-center min-h-[500px]">
                <Loader2 className="w-20 h-20 animate-spin text-indigo-500 mb-6" />
                <h3 className="text-2xl font-bold text-gray-700 mb-2">Cooking up your recipe...</h3>
                <p className="text-gray-500"> analyzing visual features and ingredients...</p>
              </div>
            ) : recipeData ? (
              <RecipeCard data={recipeData} />
            ) : (
              <InfoCard />
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
