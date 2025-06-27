import React from 'react';
import type { TrenchControl, FossData } from '../../types/form';
import styles from './FossTable.module.css';

interface Props {
  data: TrenchControl[];
  foss: FossData[];
  onRowClick: (trenchControlId: number) => void;
}

const FossTable: React.FC<Props> = ({ data, foss, onRowClick }) => {
  type NumericKeys = Extract<keyof FossData, 'dry_matter' | 'protein' | 'starch' | 'adf' | 'ndf' | 'ash' | 'raw_fat'>;

  const getAvg = (entries: FossData[], key: NumericKeys): string => {
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
          <th colSpan={7}>Данные FOSS</th>
        </tr>
        <tr>
          <th>Сух. вещество</th>
          <th>Протеин</th>
          <th>Крахмал</th>
          <th>КДК</th>
          <th>НДК</th>
          <th>Зола</th>
          <th>Сырой жир</th>
        </tr>
      </thead>
      <tbody>
        {data.map(entry => {
          const related = foss.filter(f => f.trench_control_id === entry.id);

          if (related.length === 0) {
            return (
              <tr key={entry.id} onClick={() => onRowClick(entry.id)}>
                <td colSpan={7} className={styles.row} style={{ textAlign: 'center', fontStyle: 'italic', color: '#888' }}>
                  Нет данных FOSS
                </td>
              </tr>
            );
          }

          return (
            <tr key={entry.id} onClick={() => onRowClick(entry.id)} className={styles.row}>
              <td>{getAvg(related, 'dry_matter')}</td>
              <td>{getAvg(related, 'protein')}</td>
              <td>{getAvg(related, 'starch')}</td>
              <td>{getAvg(related, 'adf')}</td>
              <td>{getAvg(related, 'ndf')}</td>
              <td>{getAvg(related, 'ash')}</td>
              <td>{getAvg(related, 'raw_fat')}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default FossTable;
