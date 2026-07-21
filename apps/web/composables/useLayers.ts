import { computed } from 'vue';
import { useEditorStore } from '~/stores/editor';
import type { Layer } from '~/stores/editor';

export function useLayers() {
  const store = useEditorStore();
  const canvas = useCanvas();

  const layers = computed(() => store.layers);
  const selectedLayerId = computed(() => store.selectedLayerId);

  function addLayer(name: string): Layer {
    const layer: Layer = {
      id: `layer-${Date.now()}`,
      name,
      visible: true,
      locked: false,
      objectIds: [],
    };
    store.addLayer(layer);
    return layer;
  }

  function moveLayer(layerId: string, direction: 'up' | 'down'): void {
    const idx = store.layers.findIndex(l => l.id === layerId);
    if (idx === -1) return;

    const newIdx = direction === 'up' ? idx + 1 : idx - 1;
    if (newIdx < 0 || newIdx >= store.layers.length) return;

    store.reorderLayers(idx, newIdx);

    reorderCanvasObjects();
  }

  function toggleVisibility(layerId: string): void {
    const layer = store.layers.find(l => l.id === layerId);
    if (!layer) return;

    const newVisible = !layer.visible;
    store.updateLayer(layerId, { visible: newVisible });

    const fabricCanvas = canvas.getCanvas();
    if (!fabricCanvas) return;

    layer.objectIds.forEach(objId => {
      const obj = fabricCanvas.getObjects().find((o: any) => o.id === objId);
      if (obj) {
        obj.set('visible', newVisible);
        obj.set('evented', newVisible);
      }
    });
    fabricCanvas.renderAll();
  }

  function toggleLock(layerId: string): void {
    const layer = store.layers.find(l => l.id === layerId);
    if (!layer) return;

    const newLocked = !layer.locked;
    store.updateLayer(layerId, { locked: newLocked });

    const fabricCanvas = canvas.getCanvas();
    if (!fabricCanvas) return;

    layer.objectIds.forEach(objId => {
      const obj = fabricCanvas.getObjects().find((o: any) => o.id === objId);
      if (obj) {
        obj.set({
          selectable: !newLocked,
          evented: !newLocked,
        });
      }
    });
    fabricCanvas.renderAll();
  }

  function reorderCanvasObjects(): void {
    const fabricCanvas = canvas.getCanvas();
    if (!fabricCanvas) return;

    const objects = fabricCanvas.getObjects();

    // Sort by layer order (first layer = bottom)
    const sorted = [...store.layers].reverse();
    sorted.forEach((layer, idx) => {
      layer.objectIds.forEach(objId => {
        const obj = objects.find((o: any) => o.id === objId);
        if (obj) {
          fabricCanvas.moveObjectTo(obj, idx);
        }
      });
    });
    fabricCanvas.renderAll();
  }

  function selectLayer(layerId: string): void {
    store.setSelectedLayerId(layerId);

    const fabricCanvas = canvas.getCanvas();
    if (!fabricCanvas) return;

    const layer = store.layers.find(l => l.id === layerId);
    if (!layer) return;

    fabricCanvas.discardActiveObject();
    const objects = fabricCanvas.getObjects()
      .filter((o: any) => layer.objectIds.includes(o.id));

    if (objects.length >= 1) {
      fabricCanvas.setActiveObject(objects[0]);
    }
    fabricCanvas.renderAll();
  }

  function deleteLayer(layerId: string): void {
    const layer = store.layers.find(l => l.id === layerId);
    if (!layer) return;

    const fabricCanvas = canvas.getCanvas();
    if (fabricCanvas) {
      layer.objectIds.forEach(objId => {
        const obj = fabricCanvas.getObjects().find((o: any) => o.id === objId);
        if (obj) fabricCanvas.remove(obj);
      });
      fabricCanvas.renderAll();
    }

    store.removeLayer(layerId);
  }

  function addObjectToLayer(layerId: string, objectId: string): void {
    const layer = store.layers.find(l => l.id === layerId);
    if (layer && !layer.objectIds.includes(objectId)) {
      store.updateLayer(layerId, { objectIds: [...layer.objectIds, objectId] });
    }
  }

  function removeObjectFromLayer(layerId: string, objectId: string): void {
    const layer = store.layers.find(l => l.id === layerId);
    if (layer) {
      store.updateLayer(layerId, { objectIds: layer.objectIds.filter(id => id !== objectId) });
    }
  }

  return {
    layers,
    selectedLayerId,
    addLayer,
    moveLayer,
    toggleVisibility,
    toggleLock,
    selectLayer,
    deleteLayer,
    addObjectToLayer,
    removeObjectFromLayer,
    reorderCanvasObjects,
  };
}
