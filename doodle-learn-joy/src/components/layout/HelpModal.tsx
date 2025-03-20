import React, { useState } from 'react';

export default function HelpModal({ word, isOpen, onClose }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateHelpImages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://709f-34-55-191-208.ngrok-free.app/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          prompt: `Doodle outline drawing of ${word}, black and white, minimal, line drawing, simple, easy to understand and draw with a pencil for a kid.` 
        })
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate images');
      }

      if (!data.images || !data.images.length) {
        throw new Error('No images received from server');
      }

      setImages(data.images);
    } catch (err) {
      console.error('Error generating help images:', err);
      setError(err.message || 'Failed to load help images');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Reference Images for "{word}"</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          {!images.length && !loading && !error && (
            <button
              onClick={generateHelpImages}
              className="btn btn-neu btn-primary w-full"
            >
              Generate Reference Images
            </button>
          )}
          
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin text-2xl mb-2">🎨</div>
              <p>Generating images...</p>
            </div>
          )}
          
          {error && (
            <div className="text-red-500 text-center py-4 flex flex-col gap-2">
              <p>{error}</p>
              <button
                onClick={generateHelpImages}
                className="btn btn-neu btn-primary"
              >
                Try Again
              </button>
            </div>
          )}
          
          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {images.map((base64Image, index) => (
                <div key={index} className="relative pt-[100%] border-2 border-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={`data:image/png;base64,${base64Image}`}
                    alt={`Reference ${index + 1} for ${word}`}
                    className="absolute inset-0 w-full h-full object-contain bg-white"
                    onError={(e) => {
                      console.error('Image load error');
                      e.target.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          {images.length > 0 && (
            <button
              onClick={generateHelpImages}
              className="btn btn-neu btn-primary"
            >
              Generate New Images
            </button>
          )}
          <button
            onClick={onClose}
            className="btn btn-neu btn-secondary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}	