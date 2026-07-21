import { computed, type Ref } from 'vue';
import { useEditorStore } from '~/stores/editor';
import type { Layer } from '~/stores/editor';

export function useLayers(canvas: Ref<fabric.Canvas | null>) {
  const store = useEditorStore();

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

    if (!canvas.value) return;

    layer.objectIds.forEach(objId => {
      const obj = canvas.value!.getObjects().find((o: any) => o.id === objId);
      if (obj) {
        obj.set('visible', newVisible);
        obj.set('evented', newVisible);
      }
    });
    canvas.value.renderAll();
  }

  function toggleLock(layerId: string): void {
    const layer = store.layers.find(l => l.id === layerId);
    if (!layer) return;

    const newLocked = !layer.locked;
    store.updateLayer(layerId, { locked: newLocked });

    if (!canvas.value) return;

    layer.objectIds.forEach(objId => {
      const obj = canvas.value!.getObjects().find((o: any) => o.id === objId);
      if (obj) {
        obj.set({
          selectable: !newLocked,
          evented: !newLocked,
        });
      }
    });
    canvas.value.renderAll();
  }

  function reorderCanvasObjects(): void {
    if (!canvas.value) return;

    const objects = canvas.value.getObjects();

    // Sort by layer order (first layer = bottom)
    const sorted = [...store.layers].reverse();
    sorted.forEach((layer, idx) => {
      layer.objectIds.forEach(objId => {
        const obj = objects.find((o: any) => o.id === objId);
        if (obj) {
          canvas.value!.moveObjectTo(obj, idx);
        }
      });
    });
    canvas.value!.renderAll();
  }

  function selectLayer(layerId: string): void {
    store.setSelectedLayerId(layerId);

    if (!canvas.value) return;

    const layer = store.layers.find(l => l.id === layerId);
    if (!layer) return;

    canvas.value.discardActiveObject();
    const objects = canvas.value.getObjects()
      .filter((o: any) => layer.objectIds.includes(o.id));

    if (objects.length >= 1) {
      canvas.value.setActiveObject(objects[0]);
    }
    canvas.value.renderAll();
  }

  function deleteLayer(layerId: string): void {
    const layer = store.layers.find(l => l.id === layerId);
    if (!layer) return;

    if (canvas.value) {
      layer.objectIds.forEach(objId => {
        const obj = canvas.value!.getObjects().find((o: any) => o.id === objId);
        if (obj) canvas.value!.remove(obj);
      });
      canvas.value.renderAll();
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
