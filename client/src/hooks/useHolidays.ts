import { useState, useEffect } from 'react';
import { Holiday } from '@/types/calendar';

const cache = new Map<string, Holiday[]>();

export function useHolidays(year: number, countryCode: string = 'US') {
  const [holidays, setHolidays] = useState<Holiday[]>([]);

  useEffect(() => {
    const key = `${year}-${countryCode}`;
    if (cache.has(key)) {
      setHolidays(cache.get(key)!);
      return;
    }

    fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`)
      .then(res => res.json())
      .then((data: Holiday[]) => {
        cache.set(key, data);
        setHolidays(data);
      })
      .catch(() => setHolidays([]));
  }, [year, countryCode]);

  const getHolidaysForDate = (dateStr: string) => {
    return holidays.filter(h => h.date === dateStr);
  };

  return { holidays, getHolidaysForDate };
}
