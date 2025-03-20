import React from 'react';

export default function DrawingTools({ 
  tool, 
  onToolChange, 
  onClear, 
  onSubmit, 
  isLoading, 
  submitText = "What Did I Draw?",
  loadingText = "Guessing..."
}) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex gap-2">
        <button
          className={`btn btn-neu tool-btn ${tool === 'pen' ? 'active' : ''}`}
          onClick={() => onToolChange('pen')}
          title="Pen"
        >
          <i className="bi bi-pencil"></i>
        </button>
        <button
          className={`btn btn-neu tool-btn ${tool === 'eraser' ? 'active' : ''}`}
          onClick={() => onToolChange('eraser')}
          title="Eraser"
        >
          <i className="bi bi-eraser"></i>
        </button>
      </div>
      <div className="flex gap-2">
        <button
          className="btn btn-neu btn-secondary"
          onClick={onClear}
        >
          Clear Canvas
        </button>
        <button
          className="btn btn-neu btn-primary"
          onClick={onSubmit}
          disabled={isLoading}
        >
          {isLoading ? loadingText : submitText}
        </button>
      </div>
    </div>
  );
}