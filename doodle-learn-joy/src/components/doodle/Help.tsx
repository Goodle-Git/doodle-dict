import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { CustomButton } from '@/components/ui/custom-button';
import { Lightbulb, RefreshCw } from 'lucide-react';

interface HelpProps {
  word: string;
  className?: string;
}

const Help: React.FC<HelpProps> = ({ word, className }) => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate images');
      }

      if (!data.images || !data.images.length) {
        throw new Error('No images received from server');
      }

      setImages(data.images);
    } catch (err) {
      console.error('Error generating help images:', err);
      setError(err instanceof Error ? err.message : 'Failed to load help images');
    } finally {
      setLoading(false);
    }
  };

  // Generate images when word changes
  useEffect(() => {
    if (word) {
      generateHelpImages();
    }
  }, [word]);

  return (
    <Card className={`p-4 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-doodle-yellow" />
          <h3 className="text-lg font-bold">Drawing Help</h3>
        </div>
        {images.length > 0 && (
          <CustomButton
            size="sm"
            className="bg-doodle-yellow hover:bg-doodle-yellow/90"
            onClick={generateHelpImages}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </CustomButton>
        )}
      </div>

      <div className="space-y-4">
        {!images.length && !loading && !error && (
          <CustomButton
            className="w-full bg-doodle-yellow hover:bg-doodle-yellow/90"
            onClick={generateHelpImages}
          >
            Generate Help Images
          </CustomButton>
        )}
        
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin text-2xl mb-2">🎨</div>
            <p>Generating help images...</p>
          </div>
        )}
        
        {error && (
          <div className="text-red-500 text-center py-4 flex flex-col gap-2">
            <p>{error}</p>
            <CustomButton
              className="bg-doodle-yellow hover:bg-doodle-yellow/90"
              onClick={generateHelpImages}
            >
              Try Again
            </CustomButton>
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
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    console.error('Image load error');
                    e.currentTarget.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default Help;