import { ref } from 'vue';
import * as fabric from 'fabric';

export function useCrop(canvas: Ref<fabric.Canvas | null>) {
  const isCropping = ref(false);
  const cropRect = ref<fabric.Rect | null>(null);
  const originalImage = ref<fabric.FabricImage | null>(null);
  const aspectRatio = ref<number | null>(null);

  let scalingHandler: ((e: any) => void) | null = null;

  function startCrop(ratio?: number | null): void {
    if (!canvas.value) return;

    isCropping.value = true;
    aspectRatio.value = ratio ?? null;

    const bgImage = canvas.value.backgroundImage as fabric.FabricImage;
    const selectedObj = canvas.value.getActiveObject();

    if (bgImage && bgImage instanceof fabric.FabricImage) {
      originalImage.value = bgImage;
    } else if (selectedObj instanceof fabric.FabricImage) {
      originalImage.value = selectedObj;
    } else {
      console.error('No image to crop');
      isCropping.value = false;
      return;
    }

    const width = canvas.value.width!;
    const height = canvas.value.height!;

    let rectWidth = width * 0.8;
    let rectHeight = height * 0.8;

    if (aspectRatio.value) {
      if (rectWidth / rectHeight > aspectRatio.value) {
        rectWidth = rectHeight * aspectRatio.value;
      } else {
        rectHeight = rectWidth / aspectRatio.value;
      }
    }

    cropRect.value = new fabric.Rect({
      left: (width - rectWidth) / 2,
      top: (height - rectHeight) / 2,
      width: rectWidth,
      height: rectHeight,
      fill: 'rgba(0,0,0,0.3)',
      stroke: '#6366f1',
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      cornerColor: '#6366f1',
      cornerStrokeColor: '#6366f1',
      cornerSize: 12,
      cornerStyle: 'circle',
      transparentCorners: false,
      borderColor: '#6366f1',
      lockRotation: true,
      lockScalingFlip: true,
      id: 'crop-rect',
    });

    if (aspectRatio.value) {
      addScalingConstraint(aspectRatio.value);
    }

    canvas.value.add(cropRect.value);
    canvas.value.setActiveObject(cropRect.value);
    canvas.value.renderAll();
  }

  function addScalingConstraint(ratio: number): void {
    if (scalingHandler && canvas.value) {
      canvas.value.off('object:scaling', scalingHandler);
    }

    scalingHandler = (e: any) => {
      const target = e.target;
      if (target !== cropRect.value || !canvas.value) return;

      const absScaleX = Math.abs(target.scaleX!);
      const absScaleY = Math.abs(target.scaleY!);
      const currentRatio = (target.width! * absScaleX) / (target.height! * absScaleY);

      if (currentRatio > ratio) {
        target.set('scaleX', target.scaleY! * ratio * (target.width! / target.height!));
      } else {
        target.set('scaleY', target.scaleX! / ratio * (target.height! / target.width!));
      }

      target.setCoords();
      canvas.value.renderAll();
    };

    canvas.value?.on('object:scaling', scalingHandler);
  }

  function setAspectRatio(ratio: number | null): void {
    aspectRatio.value = ratio;

    if (!cropRect.value || !canvas.value) return;

    const rect = cropRect.value;
    const centerX = rect.left! + (rect.width! * (rect.scaleX ?? 1)) / 2;
    const centerY = rect.top! + (rect.height! * (rect.scaleY ?? 1)) / 2;

    rect.set({ scaleX: 1, scaleY: 1 });

    if (ratio) {
      const currentW = rect.width!;
      const currentH = rect.height!;

      if (currentW / currentH > ratio) {
        rect.set({ width: currentH * ratio });
      } else {
        rect.set({ height: currentW / ratio });
      }
    }

    rect.set({
      left: centerX - rect.width! / 2,
      top: centerY - rect.height! / 2,
    });

    if (ratio) {
      addScalingConstraint(ratio);
    } else if (scalingHandler && canvas.value) {
      canvas.value.off('object:scaling', scalingHandler);
      scalingHandler = null;
    }

    rect.setCoords();
    canvas.value.renderAll();
  }

  function cleanup(): void {
    if (canvas.value && scalingHandler) {
      canvas.value.off('object:scaling', scalingHandler);
      scalingHandler = null;
    }

    if (cropRect.value && canvas.value) {
      canvas.value.remove(cropRect.value);
    }

    cropRect.value = null;
    originalImage.value = null;
    isCropping.value = false;
  }

  function applyCrop(): void {
    if (!canvas.value || !cropRect.value || !originalImage.value) return;

    const rect = cropRect.value;
    const img = originalImage.value;

    const imgScaleX = img.scaleX ?? 1;
    const imgScaleY = img.scaleY ?? 1;
    const imgLeft = img.originX === 'center'
      ? (img.left ?? 0) - ((img.width ?? 0) * imgScaleX) / 2
      : (img.left ?? 0);
    const imgTop = img.originY === 'center'
      ? (img.top ?? 0) - ((img.height ?? 0) * imgScaleY) / 2
      : (img.top ?? 0);

    let cropLeft = ((rect.left ?? 0) - imgLeft) / imgScaleX;
    let cropTop = ((rect.top ?? 0) - imgTop) / imgScaleY;
    let cropWidth = ((rect.width ?? 0) * (rect.scaleX ?? 1)) / imgScaleX;
    let cropHeight = ((rect.height ?? 0) * (rect.scaleY ?? 1)) / imgScaleY;

    // Clamp to image bounds
    const imgW = img.width ?? 0;
    const imgH = img.height ?? 0;
    if (cropLeft < 0) { cropWidth += cropLeft; cropLeft = 0; }
    if (cropTop < 0) { cropHeight += cropTop; cropTop = 0; }
    if (cropLeft + cropWidth > imgW) cropWidth = imgW - cropLeft;
    if (cropTop + cropHeight > imgH) cropHeight = imgH - cropTop;

    if (cropWidth <= 0 || cropHeight <= 0) return;

    const croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = cropWidth;
    croppedCanvas.height = cropHeight;

    const ctx = croppedCanvas.getContext('2d');
    if (!ctx) return;

    const imgEl = img.getElement() as HTMLImageElement;

    ctx.drawImage(
      imgEl,
      cropLeft, cropTop, cropWidth, cropHeight,
      0, 0, cropWidth, cropHeight,
    );

    const dataUrl = croppedCanvas.toDataURL('image/png');
    const prevId = (img as any).id;
    const prevLeft = img.left;
    const prevTop = img.top;
    const prevOriginX = img.originX;
    const prevOriginY = img.originY;
    const prevScaleX = img.scaleX;
    const prevScaleY = img.scaleY;

    // Save cleanup references before they are cleared
    const cvs = canvas.value;
    const rectToRemove = cropRect.value;
    const handlerToClean = scalingHandler;

    // Clean up reactive state immediately (clears refs before async resolves)
    cropRect.value = null;
    originalImage.value = null;
    isCropping.value = false;

    // Remove non-async artifacts now
    if (handlerToClean && cvs) {
      cvs.off('object:scaling', handlerToClean);
      scalingHandler = null;
    }
    if (rectToRemove && cvs) {
      cvs.remove(rectToRemove);
    }

    fabric.FabricImage.fromURL(dataUrl).then((croppedImg) => {
      cvs.remove(img);

      croppedImg.set({
        left: prevLeft,
        top: prevTop,
        originX: prevOriginX,
        originY: prevOriginY,
        scaleX: prevScaleX,
        scaleY: prevScaleY,
        id: prevId,
      });

      cvs.add(croppedImg);
      cvs.setActiveObject(croppedImg);
      cvs.renderAll();
    });
  }

  function cancelCrop(): void {
    cleanup();
  }

  return {
    isCropping,
    cropRect,
    aspectRatio,
    startCrop,
    applyCrop,
    cancelCrop,
    setAspectRatio,
  };
}
