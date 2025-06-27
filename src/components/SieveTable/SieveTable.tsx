import React from 'react';
import type { TrenchControl, Sieve } from '../../types/form';
import styles from './SieveTable.module.css';

interface Props {
  data: TrenchControl[];
  sieve: Sieve[];
  onRowClick: (trenchControlId: number) => void;
}

const SieveTable: React.FC<Props> = ({ data, sieve, onRowClick }) => {
// const getAvg = (entries: Sieve[], key: keyof Sieve): string => {
//   const values = entries.map(e => e[key]).filter((v): v is number => v !== null && !isNaN(v));
//   if (values.length === 0) return '-';
//   const avg = values.reduce((acc, val) => acc + val, 0) / values.length;
//   return isNaN(avg) ? '-' : avg.toFixed(1);
// };
type NumericKeys = Extract<keyof Sieve, 'high' | 'low' | 'middle' | 'pallet' >;
  const getAvg = (entries: Sieve[], key: NumericKeys): string => {
    const values = entries
      .map(e => e[key])
      .filter((v): v is number => v !== null && typeof v === 'number' && !isNaN(v));
    if (values.length === 0) return '-';
    const avg = values.reduce((acc, val) => acc + val, 0) / values.length;
    return avg.toFixed(1);
  };


  return (
    <table className={styles.table}>
      <thead>
        <tr >
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
        {data.map((entry) => {
          const sieveEntries = sieve.filter(s => s.trench_control_id === entry.id);

          if (sieveEntries.length === 0) {
            return (
              <tr key={entry.id} onClick={() => onRowClick(entry.id)}>
                <td colSpan={4} className={styles.row} style={{ textAlign: 'center', fontStyle: 'italic', color: '#888' }}>
                  Нет данных Сито
                </td>
              </tr>
            );
          }

          return (
            <tr key={entry.id} onClick={() => onRowClick(entry.id)} className={styles.row}>
              <td>{getAvg(sieveEntries, 'high')}</td>
              <td>{getAvg(sieveEntries, 'middle')}</td>
              <td>{getAvg(sieveEntries, 'low')}</td>
              <td>{getAvg(sieveEntries, 'pallet')}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default SieveTable;
