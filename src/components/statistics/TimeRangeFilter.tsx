
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';
import { TimeRange } from '@/pages/Statistics';

interface TimeRangeFilterProps {
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
}

const TimeRangeFilter: React.FC<TimeRangeFilterProps> = ({ timeRange, onTimeRangeChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <Calendar className="h-4 w-4 text-gray-500" />
      <Select value={timeRange} onValueChange={onTimeRangeChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="last30days">Last 30 Days</SelectItem>
          <SelectItem value="last6months">Last 6 Months</SelectItem>
          <SelectItem value="alltime">All Time</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimeRangeFilter;
