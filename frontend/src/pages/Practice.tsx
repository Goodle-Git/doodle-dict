import React, { useState, useRef, useEffect } from 'react';
import DashboardNavbar from '@/components/layout/DashboardNavbar';
import Canvas from '@/components/doodle/Canvas';
import DrawingTools, { DrawingTool } from '@/components/doodle/DrawingTools';
import Help from '@/components/doodle/Help';
import { Card } from '@/components/ui/card';
import { Challenge, DOODLE_CHALLENGES } from '@/lib/challenge';
import { toast } from "@/hooks/use-toast";
import { gameService } from '@/services';

const Practice = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<DrawingTool>('pen');
  const [challenge, setChallenge] = useState<Challenge>(DOODLE_CHALLENGES[0]);
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    regenerateChallenge();
  }, []);

  const regenerateChallenge = () => {
    const randomChallenge = DOODLE_CHALLENGES[
      Math.floor(Math.random() * DOODLE_CHALLENGES.length)
    ];
    setChallenge(randomChallenge);
    clearCanvas();
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setResult('');
  };

  const handleRecognizeDoodle = async () => {
    if (!canvasRef.current) return;
    
    setIsLoading(true);
    try {
      const canvas = canvasRef.current;
      const imageData = canvas.toDataURL('image/png');
      const response = await gameService.recognize(imageData);
      
      if (response.result.toLowerCase() === challenge.word.toLowerCase()) {
        toast({
          title: "Correct! 🎨",
          description: "Well done! Try another challenge.",
          variant: "success",
        });
      } else {
        toast({
          title: "Not quite right",
          description: "Keep practicing! Try again.",
          variant: "destructive",
        });
      }
      setResult(response.result);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check your drawing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <DashboardNavbar />
      <div className="container mx-auto px-4 py-8 flex-1 pt-24">
        <div className="max-w-4xl mx-auto">
          {/* Stats Card - Similar to GameStats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2">
              <Card className="p-6 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                <div className="bg-white p-4 rounded-lg border-2 border-black relative">
                  <div className="text-center">
                    <span className="text-3xl font-bold uppercase">
                      {challenge.word}
                    </span>
                    <button
                      onClick={regenerateChallenge}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-blue-100 rounded-full text-2xl"
                      title="New Challenge"
                    >
                      🔄
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Main Drawing Area - Similar to GameBoard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="p-4 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                <Canvas
                  ref={canvasRef}
                  tool={tool}
                  isDrawing={isDrawing}
                  setIsDrawing={setIsDrawing}
                  width={400}
                  height={300}
                  className="w-full aspect-[4/3] bg-white rounded-lg"
                />
              </Card>

              <div className="mt-4">
                <DrawingTools
                  tool={tool}
                  onToolChange={setTool}
                  onClear={clearCanvas}
                  onSubmit={handleRecognizeDoodle}
                  isLoading={isLoading}
                  submitText="Check Drawing"
                  loadingText="Checking..."
                />
              </div>

              {result && (
                <Card className="mt-4 p-4 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                  <p className="text-xl text-center font-semibold">{result}</p>
                </Card>
              )}
            </div>

            <div className="md:col-span-1">
              <Help word={challenge.word} className="sticky top-24" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Practice;
