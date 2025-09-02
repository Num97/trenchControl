import React from 'react';
import type { TrenchControl, FossData, FossNorms } from '../../types/form';
import styles from './FossTable.module.css';

interface Props {
  data: TrenchControl[];
  foss: FossData[];
  onRowClick: (trenchControlId: number) => void;
  fossNormsData: FossNorms[];
}

const FossTable: React.FC<Props> = ({ data, foss, onRowClick, fossNormsData }) => {
  type NumericKeys = Extract<
    keyof FossData,
    'mw' | 'dry_matter' | 'protein' | 'starch' | 'adf' | 'ndf' | 'ash' | 'raw_fat'
  >;

  const getAvg = (entries: FossData[], key: NumericKeys): number | null => {
    const values = entries
      .map(e => e[key])
      .filter((v): v is number => v !== null && typeof v === 'number' && !isNaN(v));
    if (values.length === 0) return null;
    const avg = values.reduce((acc, val) => acc + val, 0) / values.length;
    return avg;
  };

  const isOutOfNorm = (cropId: number | null | undefined, key: NumericKeys, value: number | null): boolean => {
    if (!cropId || value === null) return false;
    const norm = fossNormsData.find(n => n.crop_id === cropId);
    if (!norm) return false;

    const lower = norm[`${key}_lower_limit`];
    const upper = norm[`${key}_upper_limit`];

    if (lower !== null && lower !== undefined && value < lower) return true;
    if (upper !== null && upper !== undefined && value > upper) return true;

    return false;
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th colSpan={8}>Данные FOSS</th>
        </tr>
        <tr>
          <th>СВЧ</th>
          <th>Сух. вещ</th>
          <th>Протеин</th>
          <th>Крахмал</th>
          <th>КДК</th>
          <th>НДК</th>
          <th>Зола</th>
          <th>Жир</th>
        </tr>
      </thead>
      <tbody>
        {data.map(entry => {
          const related = foss.filter(f => f.trench_control_id === entry.id);

          if (related.length === 0) {
            return (
              <tr key={entry.id} onClick={() => onRowClick(entry.id)}>
                <td colSpan={8} className={styles.row} style={{ textAlign: 'center', fontStyle: 'italic', color: '#888' }}>
                  Нет данных FOSS
                </td>
              </tr>
            );
          }

          const avgValues: Record<NumericKeys, number | null> = {
            mw: getAvg(related, 'mw'),
            dry_matter: getAvg(related, 'dry_matter'),
            protein: getAvg(related, 'protein'),
            starch: getAvg(related, 'starch'),
            adf: getAvg(related, 'adf'),
            ndf: getAvg(related, 'ndf'),
            ash: getAvg(related, 'ash'),
            raw_fat: getAvg(related, 'raw_fat'),
          };

          return (
            <tr key={entry.id} onClick={() => onRowClick(entry.id)} className={styles.row}>
              {(
                Object.keys(avgValues) as NumericKeys[]
              ).map(key => {
                const value = avgValues[key];
                const outOfNorm = isOutOfNorm(entry.crop_id, key, value);

                return (
                <td
                  key={key}
                  className={outOfNorm ? styles.highlight : undefined}
                >
                  {value !== null ? value.toFixed(1) : '-'}
                </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
export default FossTable;