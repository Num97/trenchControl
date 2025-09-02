import React from 'react';
import type { TrenchControl, Sieve, SieveNorms } from '../../types/form';
import styles from './SieveTable.module.css';

interface Props {
  data: TrenchControl[];
  sieve: Sieve[];
  onRowClick: (trenchControlId: number) => void;
  sieveNormsData: SieveNorms[];
}

const SieveTable: React.FC<Props> = ({ data, sieve, onRowClick, sieveNormsData }) => {
  type NumericKeys = Extract<keyof Sieve, 'high' | 'low' | 'middle' | 'pallet'>;

  // Проверка выхода за норму
  const isOutOfNorm = (
    cropId: number | null | undefined,
    key: NumericKeys,
    value: number | null
  ): boolean => {
    if (!cropId || value === null) return false;
    const norms = sieveNormsData.find(n => n.crop_id === cropId);
    if (!norms) return false;

    const lower = norms[`${key}_lower_limit`];
    const upper = norms[`${key}_upper_limit`];

    if (lower != null && value < lower) return true;
    if (upper != null && value > upper) return true;

    return false;
  };

  const getAvg = (entries: Sieve[], key: NumericKeys): number | null => {
    if (entries.length === 0) return null;

    const percents = entries.map(entry => {
      const total =
        (entry.high ?? 0) +
        (entry.middle ?? 0) +
        (entry.low ?? 0) +
        (entry.pallet ?? 0);
      return total > 0 ? ((entry[key] ?? 0) / total) * 100 : 0;
    });

    const avg = percents.reduce((acc, val) => acc + val, 0) / percents.length;
    return Number(avg.toFixed(1));
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th colSpan={4}>Сито</th>
        </tr>
        <tr>
          <th>Верхнее</th>
          <th>Среднее</th>
          <th>Нижнее</th>
          <th>Поддон</th>
        </tr>
      </thead>
      <tbody>
        {data.map(entry => {
          const sieveEntries = sieve.filter(s => s.trench_control_id === entry.id);

          if (sieveEntries.length === 0) {
            return (
              <tr key={entry.id} onClick={() => onRowClick(entry.id)}>
                <td
                  colSpan={4}
                  className={styles.row}
                  style={{
                    textAlign: 'center',
                    fontStyle: 'italic',
                    color: '#888',
                  }}
                >
                  Нет данных Сито
                </td>
              </tr>
            );
          }

          const avgHigh = getAvg(sieveEntries, 'high');
          const avgMiddle = getAvg(sieveEntries, 'middle');
          const avgLow = getAvg(sieveEntries, 'low');
          const avgPallet = getAvg(sieveEntries, 'pallet');

          return (
            <tr
              key={entry.id}
              onClick={() => onRowClick(entry.id)}
              className={styles.row}
            >
              <td
                className={
                  isOutOfNorm(entry.crop_id, 'high', avgHigh)
                    ? styles.highlight
                    : undefined
                }
              >
                {avgHigh !== null ? avgHigh : '-'}
              </td>
              <td
                className={
                  isOutOfNorm(entry.crop_id, 'middle', avgMiddle)
                    ? styles.highlight
                    : undefined
                }
              >
                {avgMiddle !== null ? avgMiddle : '-'}
              </td>
              <td
                className={
                  isOutOfNorm(entry.crop_id, 'low', avgLow)
                    ? styles.highlight
                    : undefined
                }
              >
                {avgLow !== null ? avgLow : '-'}
              </td>
              <td
                className={
                  isOutOfNorm(entry.crop_id, 'pallet', avgPallet)
                    ? styles.highlight
                    : undefined
                }
              >
                {avgPallet !== null ? avgPallet : '-'}
              </td>
            </tr>
            // <tr
            //   key={entry.id}
            //   onClick={() => onRowClick(entry.id)}
            //   className={styles.row}
            // >
            //   {(['high', 'middle', 'low', 'pallet'] as NumericKeys[]).map((key) => {
            //     const avgValue =
            //       key === 'high'
            //         ? avgHigh
            //         : key === 'middle'
            //         ? avgMiddle
            //         : key === 'low'
            //         ? avgLow
            //         : avgPallet;

            //     let cellClass: string | undefined;
            //     if (avgValue !== null) {
            //       cellClass = isOutOfNorm(entry.crop_id, key, avgValue)
            //         ? styles.highlight // красный, если вышло за норму
            //         : styles.inRange;  // зелёный, если в пределах нормы
            //     }

            //     return (
            //       <td key={key} className={cellClass}>
            //         {avgValue !== null ? avgValue : '-'}
            //       </td>
            //     );
            //   })}
            // </tr>

          );
        })}
      </tbody>
    </table>
  );
};

export default SieveTable;
