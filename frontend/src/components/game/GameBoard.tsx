import React, { useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import Canvas from '../doodle/Canvas';
import DrawingTools, { DrawingTool } from '../doodle/DrawingTools';
import Help from '../doodle/Help';
import { useGame } from '@/contexts/GameContext';
import { gameService } from '@/services';
import { toast } from '@/hooks/use-toast';

export const GameBoard = () => {
  const { state, handleAttempt, startDrawing } = useGame();
  const [tool, setTool] = useState<DrawingTool>('pen');
  const [isDrawing, setIsDrawing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const handleCanvasStart = () => {
    startDrawing();
    setIsDrawing(true);
  };

  const handleCanvasGuess = async () => {
    if (!state.gameStarted || !canvasRef.current) return;
    
    try {
      setIsLoading(true);
      
      const canvas = canvasRef.current;
      const imageData = canvas.toDataURL('image/png');
      const { result, confidence } = await gameService.recognize(imageData);
      
      const isCorrect = result.toLowerCase() === state.currentWord.toLowerCase();
      // Pass the confidence (recognition accuracy) from the recognition result
      await handleAttempt(result, confidence);
      
      toast({
        title: isCorrect ? "Correct! 🎨" : "Wrong! ❌",
        description: isCorrect ? "Great job! Next challenge!" : "Keep trying! You have time!",
        variant: isCorrect ? "success" : "destructive",
      });
      
      clearCanvas();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check your drawing",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6"> {/* Changed from md:grid-cols-3 to lg:grid-cols-4 */}
      <div className="lg:col-span-3"> {/* Changed from md:col-span-2 */}
        <Card className="p-4 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          <Canvas
            ref={canvasRef}
            tool={tool}
            isDrawing={isDrawing}
            setIsDrawing={setIsDrawing}
            onDrawStart={handleCanvasStart}
            width={800} 
            height={500}
            className="w-full bg-white rounded-lg"
          />
        </Card>

        <div className="mt-4">
          <DrawingTools
            tool={tool}
            onToolChange={setTool}
            onClear={clearCanvas}
            onSubmit={handleCanvasGuess}
            isLoading={isLoading}
            submitText="Submit Guess"
            loadingText="Checking..."
          />
        </div>
      </div>
      <div className="lg:col-span-1"> {/* Changed from md:col-span-1 */}
        <Help word={state.currentWord} className="sticky top-24" />
      </div>
    </div>
  );
};
