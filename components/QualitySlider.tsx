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
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl border-2 border-dashed border-gray-300">
      <div className="space-y-4">
        {/* Labels */}
        <div className="flex items-center justify-between text-sm font-medium text-gray-700">
          <span>Best Compression</span>
          <span>Balanced</span>
          <span>Best Quality</span>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* Gradient Background */}
          <div className="absolute inset-0 h-2 rounded-full overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-red-500 via-orange-400 via-yellow-400 to-gray-300"></div>
          </div>

          {/* Slider Input */}
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={handleChange}
            className="relative w-full h-2 bg-transparent appearance-none cursor-pointer z-10
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-6
              [&::-webkit-slider-thumb]:h-6
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-green-500
              [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:border-2
              [&::-webkit-slider-thumb]:border-white
              hover:[&::-webkit-slider-thumb]:scale-110
              [&::-webkit-slider-thumb]:transition-transform
              [&::-moz-range-thumb]:w-6
              [&::-moz-range-thumb]:h-6
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-green-500
              [&::-moz-range-thumb]:shadow-lg
              [&::-moz-range-thumb]:cursor-pointer
              [&::-moz-range-thumb]:border-2
              [&::-moz-range-thumb]:border-white
              [&::-moz-range-thumb]:border-none"
          />
        </div>

        {/* Tick marks */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-gray-500">0</span>
          <span className="text-xs text-gray-500 font-semibold">{value}</span>
          <span className="text-xs text-gray-500">100</span>
        </div>
      </div>
    </div>
  );
}
