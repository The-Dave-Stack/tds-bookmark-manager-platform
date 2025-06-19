import { useState } from 'react';

import { Calendar, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export type DateRange = {
  start: Date;
  end: Date;
};

interface DateRangeSelectorProps {
  onChange: (range: DateRange) => void;
}

const PRESET_RANGES = [
  { i18n: 'lastHour', label: 'Last hour', hours: 1 },
  { i18n: 'last3Hours', label: 'Last 3 hours', hours: 3 },
  { i18n: 'last6Hours', label: 'Last 6 hours', hours: 6 },
  { i18n: 'last24Hours', label: 'Last 24 hours', hours: 24 }
];

const DateRangeSelector = ({ onChange }: DateRangeSelectorProps) => {
  const { t } = useTranslation();
  const [isCustomRange, setIsCustomRange] = useState(false);
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const handlePresetClick = (hours: number) => {
    setIsCustomRange(false);
    const end = new Date();
    const start = new Date(Date.now() - hours * 60 * 60 * 1000);
    onChange({ start, end });
  };

  const handleCustomRangeChange = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Set to end of day
      onChange({ start, end });
    }
  };

  return (
    <div className="bg-invertedText rounded-lg shadow-sm border border-lightBorder p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-mainText">
          {t('statistics.dateRange.title')}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsCustomRange(false)}
            className={`px-3 py-1 rounded-md text-sm transition-colors duration-200 ${
              !isCustomRange
                ? 'bg-primary text-invertedText'
                : 'text-mainText hover:bg-lightBg'
            }`}
            aria-label="Presets"
            role="tab"
            aria-selected={!isCustomRange}
            id="presets-tab"
          >
            <Clock className="h-4 w-4 inline-block mr-1" />
            {t('statistics.dateRange.presets')}
          </button>
          <button
            onClick={() => setIsCustomRange(true)}
            className={`px-3 py-1 rounded-md text-sm transition-colors duration-200 ${
              isCustomRange
                ? 'bg-primary text-invertedText'
                : 'text-mainText hover:bg-lightBg'
            }`}
            aria-label="Custom"
            role="tab"
            aria-selected={isCustomRange}
            id="custom-tab"
          >
            <Calendar className="h-4 w-4 inline-block mr-1" />
            {t('statistics.dateRange.custom')}
          </button>
        </div>
      </div>

      {isCustomRange ? (
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm text-mainText/70 mb-1" htmlFor="start-date">
              {t('statistics.dateRange.start')}
            </label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                handleCustomRangeChange();
              }}
              max={endDate}
              className="px-3 py-1 border border-lightBorder rounded-md text-mainText focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Start Date"
              data-testid="start-date-input"
            />
          </div>
          <div>
            <label className="block text-sm text-mainText/70 mb-1" htmlFor="end-date">
              {t('statistics.dateRange.end')}
            </label>
            <input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                handleCustomRangeChange();
              }}
              min={startDate}
              max={new Date().toISOString().split('T')[0]}
              className="px-3 py-1 border border-lightBorder rounded-md text-mainText focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="End Date"
              data-testid="end-date-input"
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2" role="tabpanel" aria-labelledby="presets-tab">
          {PRESET_RANGES.map(({ i18n, hours }, _index) => (
            <button
              key={hours}
              onClick={() => handlePresetClick(hours)}
              className="px-4 py-2 bg-lightBg hover:bg-lightBorder text-mainText rounded-md text-sm transition-colors duration-200"
              data-testid={`preset-${i18n}`}
              aria-label={t(`statistics.dateRange.presetOptions.${i18n}`)}
            >
              {t(`statistics.dateRange.presetOptions.${i18n}`)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DateRangeSelector;