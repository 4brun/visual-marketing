import { ref } from 'vue';
import * as fabric from 'fabric';

export function useFilters(canvas: Ref<fabric.Canvas | null>) {
  const brightness = ref(0);
  const contrast = ref(0);
  const saturation = ref(0);
  const blur = ref(0);

  function applyFilter(filterName: string, value: number): void {
    if (!canvas.value) return;

    const activeObj = canvas.value.getActiveObject();
    if (!activeObj || !(activeObj instanceof fabric.FabricImage)) return;

    let filters = activeObj.filters || [];

    // Remove existing filter of same type
    filters = filters.filter(f => {
      if (filterName === 'brightness' && f instanceof fabric.filters.Brightness) return false;
      if (filterName === 'contrast' && f instanceof fabric.filters.Contrast) return false;
      if (filterName === 'saturation' && f instanceof fabric.filters.Saturation) return false;
      if (filterName === 'blur' && f instanceof fabric.filters.Blur) return false;
      return true;
    });

    // Add new filter if value is not default
    if (value !== 0) {
      if (filterName === 'brightness') {
        filters.push(new fabric.filters.Brightness({ brightness: value / 100 }));
      } else if (filterName === 'contrast') {
        filters.push(new fabric.filters.Contrast({ contrast: value / 100 }));
      } else if (filterName === 'saturation') {
        filters.push(new fabric.filters.Saturation({ saturation: value / 100 }));
      } else if (filterName === 'blur') {
        filters.push(new fabric.filters.Blur({ blur: value / 100 }));
      }
    }

    activeObj.filters = filters;
    activeObj.applyFilters();
    canvas.value.renderAll();
  }

  function resetFilters(): void {
    if (!canvas.value) return;

    const activeObj = canvas.value.getActiveObject();
    if (!activeObj || !(activeObj instanceof fabric.FabricImage)) return;

    activeObj.filters = [];
    activeObj.applyFilters();
    canvas.value.renderAll();

    brightness.value = 0;
    contrast.value = 0;
    saturation.value = 0;
    blur.value = 0;
  }

  function setBrightness(value: number): void {
    brightness.value = value;
    applyFilter('brightness', value);
  }

  function setContrast(value: number): void {
    contrast.value = value;
    applyFilter('contrast', value);
  }

  function setSaturation(value: number): void {
    saturation.value = value;
    applyFilter('saturation', value);
  }

  function setBlur(value: number): void {
    blur.value = value;
    applyFilter('blur', value);
  }

  return {
    brightness,
    contrast,
    saturation,
    blur,
    setBrightness,
    setContrast,
    setSaturation,
    setBlur,
    resetFilters,
  };
}
