import { useState, useCallback, useRef } from 'react';

/**
 * Custom hook for managing Fabric canvas undo/redo history.
 */
export const useHistoryManager = () => {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const undoStack = useRef([]);
  const redoStack = useRef([]);
  const isHandlingHistory = useRef(false);

  const saveState = useCallback((canvas) => {
    if (!canvas || isHandlingHistory.current) return;
    
    // Convert current canvas state to JSON
    const state = JSON.stringify(canvas.toJSON(['selectable', 'evented', 'excludeFromExport', 'id']));
    
    // If the state is identical to the last one, do not save
    const lastState = undoStack.current[undoStack.current.length - 1];
    if (lastState === state) return;

    undoStack.current.push(state);
    redoStack.current = []; // Clear redo stack on new action
    
    setCanUndo(true);
    setCanRedo(false);
  }, []);

  const undo = useCallback((canvas) => {
    if (!canvas || undoStack.current.length <= 1) return;
    
    isHandlingHistory.current = true;
    const currentState = undoStack.current.pop();
    redoStack.current.push(currentState);
    
    const previousState = undoStack.current[undoStack.current.length - 1];
    
    canvas.loadFromJSON(previousState, () => {
      canvas.renderAll();
      isHandlingHistory.current = false;
      setCanUndo(undoStack.current.length > 1);
      setCanRedo(true);
    });
  }, []);

  const redo = useCallback((canvas) => {
    if (!canvas || redoStack.current.length === 0) return;
    
    isHandlingHistory.current = true;
    const nextState = redoStack.current.pop();
    undoStack.current.push(nextState);
    
    canvas.loadFromJSON(nextState, () => {
      canvas.renderAll();
      isHandlingHistory.current = false;
      setCanUndo(true);
      setCanRedo(redoStack.current.length > 0);
    });
  }, []);

  const clearHistory = useCallback((canvas) => {
    undoStack.current = [];
    redoStack.current = [];
    setCanUndo(false);
    setCanRedo(false);
    if (canvas) {
      const state = JSON.stringify(canvas.toJSON(['selectable', 'evented', 'excludeFromExport', 'id']));
      undoStack.current.push(state);
    }
  }, []);

  return {
    undo,
    redo,
    canUndo,
    canRedo,
    saveState,
    clearHistory
  };
};

export default useHistoryManager;
