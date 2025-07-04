import React from 'react';
import type { FossData, TrenchControl } from '../../types/form';
import styles from './FossDataDetails.module.css';

interface Props {
  data: FossData[];
  selectedFossId: number | null;
  setSelectedFossId: React.Dispatch<React.SetStateAction<number | null>>;
  trenchControlData: TrenchControl[];
  selectedFossRowId: number | null;
}

const FossDataDetails: React.FC<Props> = ({
  data,
  selectedFossId,
  setSelectedFossId,
  trenchControlData,
  selectedFossRowId,
}) => {
  if (data.length === 0) {
    return <div className={styles.empty}>Нет подробных данных FOSS</div>;
  }

  const numericFields = [
    'dry_matter',
    'protein',
    'starch',
    'adf',
    'ndf',
    'ash',
    'raw_fat',
  ] as const;

  const averages: Record<string, string> = {};

  for (const field of numericFields) {
    const values = data.map(d => d[field]).filter((v): v is number => typeof v === 'number');
    const avg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : null;
    averages[field] = avg !== null ? avg.toFixed(2) : '-';
  }

  const selectedFoss = trenchControlData.find((f) => f.id === selectedFossRowId);
  const relatedTrenchControl = selectedFoss
    ? trenchControlData.find((tc) => tc.id === selectedFoss.id)
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
              <strong>Культура:</strong> {relatedTrenchControl.crop ? relatedTrenchControl.crop : '—'}<br />
              <strong>Погода:</strong> {relatedTrenchControl.weather ? relatedTrenchControl.weather : '—'}<br />
              <strong>Темп. в траншее:</strong> {relatedTrenchControl.temp_trench !== undefined && relatedTrenchControl.temp_trench !== null ? `${relatedTrenchControl.temp_trench}°C` : '—'}<br />
              <strong>Вес:</strong> {relatedTrenchControl.weight !== undefined && relatedTrenchControl.weight !== null ? `${relatedTrenchControl.weight} кг` : '—'}
            </p>
          </div>
        )}

      <table className={styles.table}>
        <thead>
          <tr>
            <th colSpan={9}>Данные FOSS</th>
          </tr>
          <tr>
            <th>Поле</th>
            <th>Дата</th>
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
          {data.map((entry) => (
            <tr
              key={entry.id}
              onClick={() =>
                setSelectedFossId((prevId) => (prevId === entry.id ? null : entry.id))
              }
              className={entry.id === selectedFossId ? styles.selectedRow : styles.row}
            >
              <td>{entry.field ?? '-'}</td>
              <td>
                {new Date(entry.date_time).toLocaleString(undefined, {
                  hour12: false,
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </td>
              <td>{entry.dry_matter ?? '-'}</td>
              <td>{entry.protein ?? '-'}</td>
              <td>{entry.starch ?? '-'}</td>
              <td>{entry.adf ?? '-'}</td>
              <td>{entry.ndf ?? '-'}</td>
              <td>{entry.ash ?? '-'}</td>
              <td>{entry.raw_fat ?? '-'}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className={styles.averageRow}>
            <td colSpan={2}>Средние:</td>
            <td>{averages.dry_matter}</td>
            <td>{averages.protein}</td>
            <td>{averages.starch}</td>
            <td>{averages.adf}</td>
            <td>{averages.ndf}</td>
            <td>{averages.ash}</td>
            <td>{averages.raw_fat}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default FossDataDetails;
