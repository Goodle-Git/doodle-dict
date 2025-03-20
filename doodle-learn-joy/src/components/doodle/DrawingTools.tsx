import React from 'react';
import { CustomButton } from '@/components/ui/custom-button';
import { Pencil, Eraser, RotateCcw, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

// Add the DrawingTool type
type DrawingTool = 'pen' | 'eraser';

interface DrawingToolsProps {
  tool: DrawingTool;
  onToolChange: (tool: DrawingTool) => void;
  onClear: () => void;
  onSubmit: () => void;
  isLoading: boolean;
  submitText?: string;
  loadingText?: string;
}

const DrawingTools = ({
  tool,
  onToolChange,
  onClear,
  onSubmit,
  isLoading,
  submitText = "What Did I Draw?",
  loadingText = "Guessing..."
}: DrawingToolsProps) => {
  return (
    <div className="flex justify-between items-center mb-4 p-4 bg-white rounded-lg border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
      <div className="flex gap-2">
        <CustomButton
          className={cn(
            "transition-colors",
            tool === 'pen' && "bg-doodle-yellow hover:bg-doodle-yellow/90"
          )}
          onClick={() => onToolChange('pen')}
          size="sm"
          withAnimation={true}
        >
          <Pencil className="w-4 h-4 mr-2" />
          Pen
        </CustomButton>
        <CustomButton
          className={cn(
            "transition-colors",
            tool === 'eraser' && "bg-doodle-yellow hover:bg-doodle-yellow/90"
          )}
          onClick={() => onToolChange('eraser')}
          size="sm"
          withAnimation={true}
        >
          <Eraser className="w-4 h-4 mr-2" />
          Eraser
        </CustomButton>
      </div>
      
      <div className="flex gap-2">
        <CustomButton
          className="bg-white hover:bg-gray-100"
          size="sm"
          onClick={onClear}
          withAnimation={true}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Clear
        </CustomButton>
        <CustomButton
          className={cn(
            "bg-doodle-yellow hover:bg-doodle-yellow/90",
            isLoading && "opacity-70 cursor-not-allowed"
          )}
          size="sm"
          onClick={onSubmit}
          disabled={isLoading}
          withAnimation={!isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin mr-2">⚡</div>
              {loadingText}
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              {submitText}
            </>
          )}
        </CustomButton>
      </div>
    </div>
  );
};

export type { DrawingTool };
export default DrawingTools;