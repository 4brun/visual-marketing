import { ref } from 'vue';
import * as fabric from 'fabric';

export function useCanvas() {
  const canvas = ref<fabric.Canvas | null>(null);
  const activeObject = ref<fabric.FabricObject | null>(null);

  function initCanvas(canvasId: string, width: number, height: number): fabric.Canvas {
    if (canvas.value) {
      canvas.value.dispose();
    }

    const el = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!el) throw new Error(`Canvas element #${canvasId} not found`);

    canvas.value = new fabric.Canvas(el, {
      width,
      height,
      backgroundColor: '#ffffff',
      selection: true,
      controlsAboveOverlay: true,
    });

    // Style selection controls
    fabric.InteractiveFabricObject.prototype.set({
      cornerColor: '#6366f1',
      cornerStrokeColor: '#6366f1',
      cornerSize: 10,
      cornerStyle: 'circle',
      borderScaleFactor: 2,
      transparentCorners: false,
      borderColor: '#6366f1',
    });

    // Track active object
    canvas.value.on('selection:created', () => {
      activeObject.value = canvas.value?.getActiveObject() ?? null;
    });
    canvas.value.on('selection:updated', () => {
      activeObject.value = canvas.value?.getActiveObject() ?? null;
    });
    canvas.value.on('selection:cleared', () => {
      activeObject.value = null;
    });

    return canvas.value;
  }

  function getCanvas(): fabric.Canvas | null {
    return canvas.value;
  }

  async function setBackgroundFromUrl(url: string): Promise<void> {
    if (!canvas.value) return;

    const img = await fabric.FabricImage.fromURL(url, { crossOrigin: 'anonymous' });
    const scaleX = canvas.value.width! / img.width!;
    const scaleY = canvas.value.height! / img.height!;
    const scale = Math.max(scaleX, scaleY);

    img.set({
      scaleX,
      scaleY,
      selectable: false,
      evented: false,
    });

    canvas.value.backgroundImage = img;
    canvas.value.renderAll();
  }

  async function addObjectFromUrl(url: string, options?: { left?: number; top?: number }): Promise<fabric.FabricImage | undefined> {
    if (!canvas.value) return;

    const img = await fabric.FabricImage.fromURL(url, { crossOrigin: 'anonymous' });

    img.set({
      left: options?.left ?? canvas.value.width! / 2,
      top: options?.top ?? canvas.value.height! / 2,
      originX: 'center',
      originY: 'center',
      id: `obj-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    });

    img.scaleToWidth(Math.min(canvas.value.width! * 0.6, img.width!));
    canvas.value.add(img);
    canvas.value.setActiveObject(img);
    canvas.value.renderAll();

    return img;
  }

  async function addImageFromFile(file: File): Promise<fabric.FabricImage | undefined> {
    if (!canvas.value) return;

    const url = URL.createObjectURL(file);
    const img = await fabric.FabricImage.fromURL(url);

    const scaleX = canvas.value.width! / img.width!;
    const scaleY = canvas.value.height! / img.height!;
    const scale = Math.min(scaleX, scaleY, 1);

    img.set({
      left: canvas.value.width! / 2,
      top: canvas.value.height! / 2,
      originX: 'center',
      originY: 'center',
      scaleX: scale,
      scaleY: scale,
      id: `obj-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    });

    canvas.value.add(img);
    canvas.value.setActiveObject(img);
    canvas.value.renderAll();

    URL.revokeObjectURL(url);
    return img;
  }

  function addText(text: string, options?: {
    left?: number;
    top?: number;
    fontSize?: number;
    fill?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textAlign?: string;
  }): fabric.IText | undefined {
    if (!canvas.value) return;

    const textObj = new fabric.IText(text, {
      left: options?.left ?? canvas.value.width! / 2,
      top: options?.top ?? canvas.value.height! / 2,
      originX: 'center',
      originY: 'center',
      fontSize: options?.fontSize ?? 36,
      fill: options?.fill ?? '#ffffff',
      fontFamily: options?.fontFamily ?? 'Inter, sans-serif',
      fontWeight: options?.fontWeight ?? 'bold',
      fontStyle: options?.fontStyle ?? 'normal',
      textAlign: options?.textAlign ?? 'center',
      shadow: new fabric.Shadow({
        color: 'rgba(0,0,0,0.5)',
        blur: 10,
        offsetX: 2,
        offsetY: 2,
      }),
      id: `obj-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    });

    canvas.value.add(textObj);
    canvas.value.setActiveObject(textObj);
    canvas.value.renderAll();

    return textObj;
  }

  function resize(width: number, height: number): void {
    if (!canvas.value) return;
    canvas.value.setWidth(width);
    canvas.value.setHeight(height);
    canvas.value.renderAll();
  }

  function exportToDataURL(format: 'png' | 'jpeg' = 'png', quality: number = 1): string {
    if (!canvas.value) throw new Error('Canvas not initialized');
    canvas.value.discardActiveObject();
    canvas.value.renderAll();
    return canvas.value.toDataURL({ format, quality, multiplier: 1 });
  }

  function toJSON(): string {
    if (!canvas.value) throw new Error('Canvas not initialized');
    return JSON.stringify(canvas.value.toJSON());
  }

  function loadFromJSON(json: string): void {
    if (!canvas.value) return;
    canvas.value.loadFromJSON(json).then(() => {
      canvas.value!.renderAll();
    });
  }

  function dispose(): void {
    if (canvas.value) {
      canvas.value.dispose();
      canvas.value = null;
    }
  }

  return {
    canvas,
    activeObject,
    initCanvas,
    getCanvas,
    setBackgroundFromUrl,
    addObjectFromUrl,
    addImageFromFile,
    addText,
    resize,
    exportToDataURL,
    toJSON,
    loadFromJSON,
    dispose,
  };
}
