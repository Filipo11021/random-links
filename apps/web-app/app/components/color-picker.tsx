import { useState } from "react";

const COLOR_PRESETS = [
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#10b981" },
  { name: "Red", value: "#ef4444" },
  { name: "Yellow", value: "#f59e0b" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Pink", value: "#ec4899" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Orange", value: "#f97316" },
];

type ColorPickerProps = {
  selectedColor: string;
  onColorChange: (color: string) => void;
};

function ColorPicker({ selectedColor, onColorChange }: ColorPickerProps) {
  return (
    <div>
      <label className="text-sm font-medium mb-2 block">Color</label>
      <div className="grid grid-cols-4 gap-3">
        {COLOR_PRESETS.map((color) => (
          <button
            key={color.value}
            type="button"
            onClick={() => onColorChange(color.value)}
            className={`w-full h-12 rounded-lg transition-all cursor-pointer ${
              selectedColor === color.value
                ? "ring-4 ring-blue-500 ring-offset-2 ring-offset-content1"
                : "hover:scale-105"
            }`}
            style={{ backgroundColor: color.value }}
            title={color.name}
          />
        ))}
      </div>
    </div>
  );
}

type ColorPickerFieldProps = {
  name: string;
};

export function ColorPickerField({ name }: ColorPickerFieldProps) {
  const [selectedColor, setSelectedColor] = useState(COLOR_PRESETS[0].value);

  return (
    <>
      <ColorPicker
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
      />
      <input type="hidden" name={name} value={selectedColor} />
    </>
  );
}
