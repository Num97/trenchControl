import React from 'react';
import type { Sieve, TrenchControl } from '../../types/form';
import styles from './SieveDataDetails.module.css';

interface Props {
  data: Sieve[];
  selectedSieveId: number | null;
  setSelectedSieveId: React.Dispatch<React.SetStateAction<number | null>>;
  trenchControlData: TrenchControl[];
  selectedSieveRowId: number | null;
}

const SieveDataDetails: React.FC<Props> = ({
  data,
  selectedSieveId,
  setSelectedSieveId,
  trenchControlData,
  selectedSieveRowId,
}) => {
  if (data.length === 0) {
    return <div className={styles.empty}>Нет подробных данных сито</div>;
  }

  // Рассчёт средних значений по числовым полям
  const numericFields = ['high', 'middle', 'low', 'pallet'] as const;
  const averages: Record<string, string> = {};

  for (const field of numericFields) {
    const values = data
      .map(d => d[field])
      .filter((v): v is number => typeof v === 'number');
    const avg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : null;
    averages[field] = avg !== null ? avg.toFixed(2) : '-';
  }

  // Найдём связанный объект траншеи по selectedSieveRowId
  const selectedSieve = trenchControlData.find((f) => f.id === selectedSieveRowId);
  const relatedTrenchControl = selectedSieve
    ? trenchControlData.find((tc) => tc.id === selectedSieve.id)
    : null;

  return (
    <div className={styles.wrapper}>
      {relatedTrenchControl && (
        <div className={styles.headerBlock}>
          <h4>Информация о траншее</h4>
          <p>
            <strong>Дата:</strong>{' '}
            {relatedTrenchControl.date
              ? new Date(relatedTrenchControl.date).toLocaleDateString()
              : '—'}
          </p>
          <p>
            <strong>Культура:</strong>{' '}
            {relatedTrenchControl.crop ? relatedTrenchControl.crop : '—'}<br />
            <strong>Погода:</strong>{' '}
            {relatedTrenchControl.weather ? relatedTrenchControl.weather : '—'}<br />
            <strong>Темп. в траншее:</strong>{' '}
            {relatedTrenchControl.temp_trench !== undefined && relatedTrenchControl.temp_trench !== null
              ? `${relatedTrenchControl.temp_trench}°C`
              : '—'}<br />
            <strong>Вес:</strong>{' '}
            {relatedTrenchControl.weight !== undefined && relatedTrenchControl.weight !== null
              ? `${relatedTrenchControl.weight} кг`
              : '—'}
          </p>
        </div>
      )}

      <table className={styles.table}>
        <thead>
          <tr>
            <th colSpan={5}>Сито</th>
          </tr>
          <tr>
            <th>Дата</th>
            <th>Верхнее</th>
            <th>Среднее</th>
            <th>Нижнее</th>
            <th>Поддон</th>
          </tr>
        </thead>
        <tbody>
          {data.map(entry => (
            <tr
              key={entry.id}
              onClick={() =>
                setSelectedSieveId(prevId => (prevId === entry.id ? null : entry.id))
              }
              className={entry.id === selectedSieveId ? styles.selectedRow : styles.row}
            >
              <td>
                {entry.date_time
                  ? new Date(entry.date_time).toLocaleString(undefined, {
                      hour12: false,
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '-'}
              </td>
              <td>{entry.high ?? '-'}</td>
              <td>{entry.middle ?? '-'}</td>
              <td>{entry.low ?? '-'}</td>
              <td>{entry.pallet ?? '-'}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className={styles.averageRow}>
            <td>Средние:</td>
            <td>{averages.high}</td>
            <td>{averages.middle}</td>
            <td>{averages.low}</td>
            <td>{averages.pallet}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default SieveDataDetails;
