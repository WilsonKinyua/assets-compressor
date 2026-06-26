'use client';

interface QualitySliderProps {
  value: number;
  onChange: (value: number) => void;
}

export default function QualitySlider({ value, onChange }: QualitySliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value));
  };

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-3">
        <label htmlFor="quality" className="text-sm font-medium text-gray-700">
          Quality
        </label>
        <span className="text-sm font-semibold text-teal-700">{value}%</span>
      </div>

      <input
        id="quality"
        type="range"
        min="10"
        max="100"
        value={value}
        onChange={handleChange}
        className="w-full h-2 rounded-full bg-gray-200 appearance-none cursor-pointer
          accent-teal-700
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-5
          [&::-webkit-slider-thumb]:h-5
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-teal-700
          [&::-webkit-slider-thumb]:border-2
          [&::-webkit-slider-thumb]:border-white
          [&::-webkit-slider-thumb]:shadow
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-moz-range-thumb]:w-5
          [&::-moz-range-thumb]:h-5
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-teal-700
          [&::-moz-range-thumb]:border-2
          [&::-moz-range-thumb]:border-white
          [&::-moz-range-thumb]:cursor-pointer"
      />

      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
        <span>Smaller file</span>
        <span>Higher quality</span>
      </div>
    </div>
  );
}
