import * as fabric from 'fabric';

let canvas: fabric.Canvas | null = null;

export function useCanvas() {
  function initCanvas(canvasId: string, width: number, height: number) {
    if (canvas) {
      canvas.dispose();
    }

    canvas = new fabric.Canvas(canvasId, {
      width,
      height,
      backgroundColor: '#ffffff',
      selection: true,
    });

    return canvas;
  }

  function getCanvas() {
    return canvas;
  }

  async function setBackgroundFromUrl(url: string) {
    if (!canvas) return;

    const img = await fabric.FabricImage.fromURL(url, { crossOrigin: 'anonymous' });
    const scaleX = canvas.width! / img.width!;
    const scaleY = canvas.height! / img.height!;
    const scale = Math.max(scaleX, scaleY);

    img.set({
      scaleX: scale,
      scaleY: scale,
      selectable: false,
      evented: false,
    });

    canvas.backgroundImage = img;
    canvas.renderAll();
  }

  async function addObjectFromUrl(url: string, options?: { left?: number; top?: number }) {
    if (!canvas) return;

    const img = await fabric.FabricImage.fromURL(url, { crossOrigin: 'anonymous' });

    img.set({
      left: options?.left ?? canvas.width! / 2,
      top: options?.top ?? canvas.height! / 2,
      originX: 'center',
      originY: 'center',
      cornerSize: 10,
      cornerColor: '#6366f1',
      borderColor: '#6366f1',
    });

    img.scaleToWidth(Math.min(canvas.width! * 0.6, img.width!));
    canvas.add(img);
    canvas.setActiveObject(img);
    canvas.renderAll();

    return img;
  }

  function addText(text: string, options?: { left?: number; top?: number; fontSize?: number; fill?: string }) {
    if (!canvas) return;

    const textObj = new fabric.FabricText(text, {
      left: options?.left ?? canvas.width! / 2,
      top: options?.top ?? canvas.height! / 2,
      originX: 'center',
      originY: 'center',
      fontSize: options?.fontSize ?? 36,
      fill: options?.fill ?? '#ffffff',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 'bold',
      shadow: new fabric.Shadow({
        color: 'rgba(0,0,0,0.5)',
        blur: 10,
        offsetX: 2,
        offsetY: 2,
      }),
    });

    canvas.add(textObj);
    canvas.setActiveObject(textObj);
    canvas.renderAll();

    return textObj;
  }

  function resize(width: number, height: number) {
    if (!canvas) return;
    canvas.setWidth(width);
    canvas.setHeight(height);
    canvas.renderAll();
  }

  function exportToDataURL(format: 'png' | 'jpeg' = 'png', quality = 1): string {
    if (!canvas) throw new Error('Canvas not initialized');
    return canvas.toDataURL({ format, quality, multiplier: 1 });
  }

  function toJSON(): string {
    if (!canvas) throw new Error('Canvas not initialized');
    return JSON.stringify(canvas.toJSON());
  }

  function loadFromJSON(json: string) {
    if (!canvas) return;
    canvas.loadFromJSON(json).then(() => {
      canvas!.renderAll();
    });
  }

  function dispose() {
    if (canvas) {
      canvas.dispose();
      canvas = null;
    }
  }

  return {
    initCanvas,
    getCanvas,
    setBackgroundFromUrl,
    addObjectFromUrl,
    addText,
    resize,
    exportToDataURL,
    toJSON,
    loadFromJSON,
    dispose,
  };
}
