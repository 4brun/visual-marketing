import { ref, computed } from 'vue';
import * as fabric from 'fabric';

export function useHistory(canvas: Ref<fabric.Canvas | null>) {
  const history = ref<string[]>([]);
  const currentIndex = ref(-1);
  const isUndoRedo = ref(false);

  const canUndo = computed(() => currentIndex.value > 0);
  const canRedo = computed(() => currentIndex.value < history.value.length - 1);

  function saveState(): void {
    if (isUndoRedo.value || !canvas.value) return;

    const json = JSON.stringify(canvas.value.toJSON(['id', 'selectable', 'evented', 'layerType']));

    // Remove future states if we're not at the end
    history.value = history.value.slice(0, currentIndex.value + 1);
    history.value.push(json);
    currentIndex.value = history.value.length - 1;

    // Limit history size (keep last 50 states)
    if (history.value.length > 50) {
      history.value.shift();
      currentIndex.value--;
    }
  }

  function undo(): void {
    if (!canUndo.value || !canvas.value) return;

    isUndoRedo.value = true;
    currentIndex.value--;

    canvas.value.loadFromJSON(history.value[currentIndex.value]).then(() => {
      canvas.value!.renderAll();
    }).catch((err) => {
      console.error('History load failed:', err);
    }).finally(() => {
      isUndoRedo.value = false;
    });
  }

  function redo(): void {
    if (!canRedo.value || !canvas.value) return;

    isUndoRedo.value = true;
    currentIndex.value++;

    canvas.value.loadFromJSON(history.value[currentIndex.value]).then(() => {
      canvas.value!.renderAll();
    }).catch((err) => {
      console.error('History load failed:', err);
    }).finally(() => {
      isUndoRedo.value = false;
    });
  }

  function clearHistory(): void {
    history.value = [];
    currentIndex.value = -1;
  }

  function getHistoryLength(): number {
    return history.value.length;
  }

  return {
    canUndo,
    canRedo,
    saveState,
    undo,
    redo,
    clearHistory,
    getHistoryLength,
  };
}
