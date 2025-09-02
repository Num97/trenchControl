import React from 'react';
import type { FossData, TrenchControl, Crops, Weather, FossNorms } from '../../types/form';
import styles from './FossDataDetails.module.css';

interface Props {
  data: FossData[];
  selectedFossId: number | null;
  setSelectedFossId: React.Dispatch<React.SetStateAction<number | null>>;
  trenchControlData: TrenchControl[];
  selectedFossRowId: number | null;
  weatherData: Weather[];
  cropsData: Crops[];
  fossNormsData: FossNorms[];
}

const FossDataDetails: React.FC<Props> = ({
  data,
  selectedFossId,
  setSelectedFossId,
  trenchControlData,
  selectedFossRowId,
  weatherData,
  cropsData,
  fossNormsData
}) => {
  if (data.length === 0) {
    return <div className={styles.empty}>Нет подробных данных FOSS</div>;
  }

  const numericFields = [
    'mw',
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

  // Проверка норм
  const isOutOfNorm = (
    cropId: number | null | undefined,
    key: typeof numericFields[number],
    value: number | null
  ): boolean => {
    if (!cropId || value === null) return false;
    const norm = fossNormsData.find(n => n.crop_id === cropId);
    if (!norm) return false;

    const lower = norm[`${key}_lower_limit`];
    const upper = norm[`${key}_upper_limit`];

    if (lower !== null && lower !== undefined && value < lower) return true;
    if (upper !== null && upper !== undefined && value > upper) return true;

    return false;
  };

  // Найдём среднюю температуру в траншее
  const avgTemp =
    relatedTrenchControl
      ? (() => {
          const temps = [
            relatedTrenchControl.left_edge_temp,
            relatedTrenchControl.middle_temp,
            relatedTrenchControl.right_edge_temp,
          ].filter((t): t is number => typeof t === 'number');

          return temps.length > 0
            ? (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1)
            : null;
        })()
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
            {cropsData.find(c => c.id === relatedTrenchControl.crop_id)?.name ?? '—'}
            <br />
            <strong>Погода:</strong>{' '}
            {weatherData.find(w => w.id === relatedTrenchControl.weather_id)?.name ?? '—'}
            <br />
            <strong>Темп. в траншее:</strong>
            {avgTemp !== null ? `${avgTemp}°C` : '—'}
            <br />
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
            <th colSpan={10}>Данные FOSS</th>
          </tr>
          <tr>
            <th>Поле</th>
            <th>Дата</th>
            <th>СВЧ</th>
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
              {numericFields.map((key) => {
                const value = entry[key];
                const outOfNorm = isOutOfNorm(relatedTrenchControl?.crop_id, key, value);
                return (
                  <td key={key} className={outOfNorm ? styles.highlight : undefined}>
                    {value ?? '-'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
        <tfoot>
  <tr className={styles.averageRow}>
    <td colSpan={2}>Средние:</td>
    {numericFields.map((key) => {
      const avgStr = averages[key];
      const avgVal = avgStr !== '-' ? parseFloat(avgStr) : null;
      const outOfNorm = isOutOfNorm(relatedTrenchControl?.crop_id, key, avgVal);

      return (
        <td key={key} className={outOfNorm ? styles.highlight : undefined}>
          {avgStr}
        </td>
      );
    })}
  </tr>
</tfoot>
      </table>
    </div>
  );
};

export default FossDataDetails;
