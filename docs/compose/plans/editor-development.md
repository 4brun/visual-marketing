# План разработки редактора изображений

## Ключевая фича: визуальный редактор для создания рекламных баннеров

---

## 1. Анализ требований

### Что должен делать редактор

| Функция | Описание | Приоритет |
|---------|----------|-----------|
| **Загрузка фото** | Drag & drop или клик, поддержка PNG/JPG до 20MB | P0 |
| **Удаление фона** | AI-удаление фона (RMBG 1.4) — уже реализовано на бэке | P0 |
| **Генерация фона** | AI-генерация сцены (Flux 1.1 Pro) — уже реализовано на бэке | P0 |
| **Позиционирование** | Размещение вырезанного товара на фоне, drag & resize | P0 |
| **Кадрирование (crop)** | Обрезка финального состава под нужный формат | P0 |
| **Ресайз** | Пресеты размеров: WB 3:4 (900×1200), Ozon 1:1 (900×900) | P0 |
| **Текстовые слои** | Заголовок, цена, описание — шрифт, размер, цвет, позиция | P0 |
| **Инфографика** | Бейджи «Хит продаж», «Скидка -30%» — SVG-шаблоны | P1 |
| **Экспорт** | Сохранение в PNG/JPEG, загрузка в S3, presigned URL | P0 |
| **Сохранение/загрузка** | Серийализация состояния canvas (JSON) → БД | P1 |
| **Отмена/повтор** | Undo/Redo история действий | P1 |
| **Масштабирование** | Zoom in/out, fit to screen | P2 |
| **Слои** | Панель слоёв: порядок, видимость, блокировка | P2 |
| **Фильтры** | Яркость, контраст, насыщенность изображения | P2 |
| **Тени/свечение** | Тень под товаром, свечение вокруг текста | P2 |

---

## 2. Анализ библиотек

### Вариант A: Fabric.js v6 (текущая зависимость)

**Плюсы:**
- Уже установлена в проекте (`fabric: ^6.4`)
- Хорошая поддержка слоёв (Image, Text, Group, Rect)
- Встроенное редактирование текста (IText — inline editing)
- JSON-сериализация для save/load
- Событийная модель (object:modified, selection:created)
- Активное сообщество, хорошая документация

**Минусы:**
- Нет встроенного crop-инструмента (нужно реализовывать вручную)
- Нет встроенных фильтров изображений (нужен отдельный пакет `fabric-filters`)
- WebGL рендеринг экспериментальный (v6)
- Производительность падает при >50 объектах

**Вердикт:** Подходит для P0/P1 функций. Crop и фильтры потребуют дополнительной реализации.

### Вариант B: Tui Image Editor (tui-image-editor)

**Плюсы:**
- Полнофункциональный редактор изображений «из коробки»
- Встроены: crop, rotate, flip, resize, draw, text, shapes, filters, icons
- Виджет-based — не нужно строить UI с нуля
- Поддержка Undo/Redo из коробки

**Минусы:**
- Тяжёлый (~500KB gzipped)
- Сложная кастомизация (React-компонент, не Vue-native)
- Не заточен под multi-layer composition (только одно изображение)
- Нет встроенной поддержки S3/загрузки

**Вердикт:** Хорош для простого редактора «одного изображения», но не подходит для composition (товар + фон + текст).

### Вариант C: Konva.js + vue-konva

**Плюсы:**
- Современный API, лучше чем Fabric.js для сложных сцен
- Отличная производительность (WebGL-оптимизация)
- Хорошая поддержка Vue через vue-konva
- Встроенный Transformer для resize/rotate объектов
- Konva.Node.toDataURL() для экспорта

**Минусы:**
- Меньше примеров для photo-editing сценариев
- Нет встроенного текстового редактирования (нужен DOM-оверлей)
- Меньше community-плагинов

**Вердикт:** Технически мощнее Fabric.js, но потребует больше работы для text editing.

### Вариант D: Гибрид — Fabric.js + DOM-оверлеи

**Идея:** Использовать Fabric.js для canvas (изображения, слои, позиционирование) + DOM-элементы для crop-тулбара, text editing панели, фильтров.

**Плюсы:**
- Fabric.js делает то, что умеет лучше всего (canvas, layers, images)
- DOM-оверлеи дают гибкость для UI (crop handles, color picker, font selector)
- Не нужно reinvent UI-компоненты

**Минусы:**
- Синхронизация состояния между canvas и DOM
- Сложность при экспорте (нужно объединять canvas + DOM)

---

## 3. Рекомендация: Fabric.js v6 + кастомные модули

**Почему Fabric.js:**
1. Уже в проекте — нет лишних зависимостей
2. Multi-layer composition — точно то, что нужно (фон + товар + текст + бейджи)
3. JSON serialization — save/load состояния
4. v6 активно развивается

**Что нужно реализовать дополнительно:**
1. **Crop module** —矩形ный crop с handles ( fabric.Rect + clipped Image)
2. **Filter panel** — fabric.filters (Brightness, Contrast, Saturation)
3. **Text editor panel** — DOM-панель для настроек + fabric.IText на canvas
4. **Layer panel** — порядок объектов, видимость, блокировка

---

## 4. Архитектура редактора

```
apps/web/
├── components/editor/
│   ├── CanvasZone.vue          # Обёртка над fabric.Canvas
│   ├── Toolbar.vue             # Панель инструментов (crop, text, etc.)
│   ├── LayerPanel.vue          # Управление слоями
│   ├── PropertyPanel.vue       # Свойства выделенного объекта
│   ├── CropModal.vue           # Модалка кадрирования
│   ├── TextEditor.vue          # Настройки текста (шрифт, размер, цвет)
│   ├── FilterPanel.vue         # Фильтры изображения
│   ├── PresetSelector.vue      # Выбор пресета размера (WB, Ozon)
│   └── ExportPanel.vue         # Экспорт и загрузка
├── composables/
│   ├── useCanvas.ts            # Fabric.js canvas instance + lifecycle
│   ├── useEditorState.ts       # Pinia store: layers, selection, history
│   ├── useCrop.ts              # Crop-логика
│   ├── useHistory.ts           # Undo/Redo (стек состояний)
│   └── useExport.ts            # Экспорт canvas → S3
└── stores/
    └── editor.ts               # Pinia: currentProject, layers, settings
```

---

## 5. Пошаговый план реализации

### Фаза 1: Базовый canvas + composition (3-4 дня)

**Задачи:**
1. `CanvasZone.vue` — инициализация fabric.Canvas, resize по container
2. `useCanvas.ts` — загрузка background image + cutout image как слоёв
3. Позиционирование cutout на фоне (drag, resize, rotate через Transformer)
4. Пресеты размеров (WB 3:4, Ozon 1:1) — изменение размера canvas
5. Базовый экспорт — `canvas.toDataURL('image/png')`

**Результат:** Пользователь может загрузить фото, удалить фон, сгенерировать фон, разместить товар на фоне, выбрать размер, экспортировать PNG.

### Фаза 2: Текстовые слои (2-3 дня)

**Задачи:**
1. `TextEditor.vue` — панель: ввод текста, выбор шрифта, размера, цвета, жирный/курсив
2. Добавление `fabric.IText` на canvas по клику «Добавить текст»
3. Inline-редактирование текста на canvas (двойной клик)
4. Панель свойств при выделении текстового объекта
5. Поддержка русских шрифтов (Inter, Montserrat — уже подключены через Google Fonts)

**Результат:** Пользователь может добавлять заголовки, цены, описания с настройкой внешнего вида.

### Фаза 3: Кадрирование (crop) (2-3 дня)

**Задачи:**
1. `CropModal.vue` — модальное окно с canvas и crop-рамкой
2. Кастомная реализация crop через `fabric.Rect` (clipPath) + handles
3. Фиксированные пропорции crop (1:1, 3:4, свободный)
4. Применение crop → обновление canvas

**Результат:** Пользователь может обрезать финальное изображение под нужный формат.

### Фаза 4: Инфографика + бейджи (2-3 дня)

**Задачи:**
1. Загрузка SVG-шаблонов из БД (`InfographicTemplate`)
2. Добавление SVG как `fabric.loadSVGFromString` → group объектов
3. Позиционирование, resize бейджей
4. Готовые категории: promo, badge, info, seasonal

**Результат:** Пользователь может добавлять «Хит продаж», «Скидка -30%», «Бесплатная доставка».

### Фаза 5: Undo/Redo + save/load (1-2 дня)

**Задачи:**
1. `useHistory.ts` — стек JSON-сериализаций canvas
2. Undo (Ctrl+Z) / Redo (Ctrl+Y)
3. `POST /api/editor/save` — сохранение `canvas.toJSON()` в БД
4. `GET /api/editor/load/:imageId` — загрузка и восстановление

**Результат:** Пользователь может отменять действия и сохранять/загружать проекты.

### Фаза 6: Фильтры + тени (1-2 дня)

**Задачи:**
1. `FilterPanel.vue` — слайдеры: яркость, контраст, насыщенность, размытие
2. Применение `fabric.Image.filters` (Brightness, Contrast, Saturation, Blur)
3. Тень под объектом — `fabric.Object.shadow`
4. Свечение текста — `fabric.Text.shadow`

**Результат:** Пользователь может настраивать внешний вид изображений и текста.

---

## 6. Ключевые технические решения

### Хранение состояния
```typescript
// Canvas → JSON → Prisma (CanvasState.data: Json)
const json = canvas.toJSON(['id', 'selectable', 'evented', 'layerType']);
await api.post('/editor/save', { projectId, imageId, data: json, width, height });
```

### Слои и порядок
```typescript
// fabric.Canvas objects ordered by z-index
// Первый объект = фон (bottom), последний = верхний слой
canvas.moveTo(imageObject, 0);  // Фон всегда внизу
canvas.bringObjectToFront(textObject);  // Текст поверх всего
```

### Экспорт для маркетплейсов
```typescript
// WB: 900×1200 (3:4), Ozon: 900×900 (1:1)
// canvas.toDataURL({ format: 'png', quality: 1, multiplier: 1 })
// Или canvas.toBlob() → upload to S3
```

### Undo/Redo
```typescript
// Стек состояний (JSON snapshots)
const history: string[] = [];
let currentIndex = -1;

function saveState() {
  history.splice(currentIndex + 1);
  history.push(canvas.toJSON());
  currentIndex++;
}

function undo() {
  if (currentIndex > 0) {
    currentIndex--;
    canvas.loadFromJSON(history[currentIndex]);
  }
}
```

---

## 7. Зависимости (уже есть / нужно добавить)

| Пакет | Статус | Назначение |
|-------|--------|------------|
| `fabric` ^6.4 | ✅ Установлен | Canvas engine |
| `@vueuse/core` ^11 | ✅ Установлен | useResizeObserver, useMagicKeys |
| `pinia` ^2.2 | ✅ Установлен | State management |
| `@nuxtjs/google-fonts` ^3 | ✅ Установлен | Inter, Montserrat |
| `@vueup/vue-quill` | ❓ Рассмотреть | Rich text (если нужен многострочный) |
| `vue-color` | ❓ Рассмотреть | Color picker компонент |

Дополнительные зависимости скорее всего не потребуются — Fabric.js покрывает все canvas-операции, а UI-компоненты (sliders, pickers) реализуются на Tailwind.

---

## 8. Таймлайн

| Фаза | Дни | Описание |
|------|-----|----------|
| 1. Canvas + composition | 3-4 | Базовый редактор: загрузка, позиционирование, ресайз, экспорт |
| 2. Текст | 2-3 | Текстовые слои с настройками |
| 3. Crop | 2-3 | Кадрирование финального состава |
| 4. Инфографика | 2-3 | SVG-бейджи и шаблоны |
| 5. Undo/Save | 1-2 | История действий, сохранение в БД |
| 6. Фильтры | 1-2 | Яркость, контраст, тени |
| **Итого** | **11-17 дней** | |

---

## 9. Риски и митигация

| Риск | Митигация |
|------|-----------|
| Производительность canvas при многих объектах | Ограничение: max 20 объектов, виртуализация слоёв |
| Crop-логика сложна в реализации | Начать с фиксированных пропорций (1:1, 3:4), не делать freeform crop |
| Русские шрифты в canvas | Использовать только Google Fonts (Inter, Montserrat) — они работают в fabric.Text |
| Экспорт при разных DPI | `canvas.toDataURL({ multiplier: 2 })` для Retina |
| Совместная работа (Phase 2) | Пока не реализовывать —_ONE user per project |
