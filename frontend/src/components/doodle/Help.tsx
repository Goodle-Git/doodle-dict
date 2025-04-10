import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { CustomButton } from '@/components/ui/custom-button';
import { Lightbulb, RefreshCw } from 'lucide-react';
import { generateHelpImages } from '@/lib/utils';
import { useImageGenConfig } from '@/hooks/useImageGenConfig';

interface HelpProps {
  word: string;
  className?: string;
}

const Help: React.FC<HelpProps> = ({ word, className }) => {
  const { useGemini } = useImageGenConfig();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [helpRequested, setHelpRequested] = useState(false);

  const handleGenerateImage = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const generatedImage = await generateHelpImages(word, useGemini);
      
      if (!generatedImage) {
        throw new Error('No image generated');
      }

      setImage(generatedImage);
      setHelpRequested(true);
    } catch (err) {
      console.error('Error generating help image:', err);
      setError("Please wait a moment and try again...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={`p-4 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-doodle-yellow" />
          <h3 className="text-lg font-bold">Drawing Help</h3>
        </div>
        {helpRequested && image && (
          <CustomButton
            size="sm"
            className="bg-doodle-yellow hover:bg-doodle-yellow/90"
            onClick={handleGenerateImage}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </CustomButton>
        )}
      </div>

      <div className="space-y-4">
        {!helpRequested && !loading && (
          <CustomButton
            className="w-full bg-doodle-yellow hover:bg-doodle-yellow/90"
            onClick={handleGenerateImage}
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            Help me draw this!
          </CustomButton>
        )}
        
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin text-2xl mb-2">🎨</div>
            <p>Generating help image...</p>
          </div>
        )}
        
        {error && (
          <div className="text-red-500 text-center py-4 flex flex-col gap-2">
            <p>{error}</p>
            <CustomButton
              className="bg-doodle-yellow hover:bg-doodle-yellow/90"
              onClick={handleGenerateImage}
            >
              Try Again
            </CustomButton>
          </div>
        )}
        
        {helpRequested && image && (
          <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
            <img
              src={`data:image/png;base64,${image}`}
              alt={`Reference for ${word}`}
              className="w-full h-auto object-contain bg-white"
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                console.error('Image load error');
                e.currentTarget.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
              }}
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default Help;