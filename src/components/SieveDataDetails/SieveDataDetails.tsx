import React from 'react';
import type { Sieve, TrenchControl, Weather, Crops, SieveNorms } from '../../types/form';
import styles from './SieveDataDetails.module.css';

interface Props {
  data: Sieve[];
  selectedSieveId: number | null;
  setSelectedSieveId: React.Dispatch<React.SetStateAction<number | null>>;
  trenchControlData: TrenchControl[];
  selectedSieveRowId: number | null;
  weatherData: Weather[];
  cropsData: Crops[];
  sieveNormsData: SieveNorms[];
}

const SieveDataDetails: React.FC<Props> = ({
  data,
  selectedSieveId,
  setSelectedSieveId,
  trenchControlData,
  selectedSieveRowId,
  weatherData,
  cropsData,
  sieveNormsData,
}) => {
  if (data.length === 0) {
    return <div className={styles.empty}>Нет подробных данных сито</div>;
  }

  type NumericKeys = 'high' | 'middle' | 'low' | 'pallet';
  const keys: NumericKeys[] = ['high', 'middle', 'low', 'pallet'];
  const averages: Record<string, string> = {};

  for (const key of keys) {
    const percents = data.map(entry => {
      const total =
        (entry.high ?? 0) +
        (entry.middle ?? 0) +
        (entry.low ?? 0) +
        (entry.pallet ?? 0);
      return total > 0 ? ((entry[key] ?? 0) / total) * 100 : 0;
    });

    const avg =
      percents.length > 0
        ? percents.reduce((acc, val) => acc + val, 0) / percents.length
        : 0;

    averages[key] = percents.length > 0 ? avg.toFixed(1) + ' %' : '-';
  }

  // траншея для нормы
  const selectedTrench = trenchControlData.find(tc => tc.id === selectedSieveRowId);
  const cropId = selectedTrench?.crop_id ?? null;

  // проверка нормы (только для процентов!)
  const isOutOfNormPercent = (
    cropId: number | null,
    key: NumericKeys,
    percent: number | null
  ): boolean => {
    if (!cropId || percent == null) return false;
    const norms = sieveNormsData.find(n => n.crop_id === cropId);
    if (!norms) return false;

    const lower = norms[`${key}_lower_limit`];
    const upper = norms[`${key}_upper_limit`];

    if (lower != null && percent < lower) return true;
    if (upper != null && percent > upper) return true;

    return false;
  };

  // средняя температура
  const avgTemp = selectedTrench
    ? (() => {
        const temps = [
          selectedTrench.left_edge_temp,
          selectedTrench.middle_temp,
          selectedTrench.right_edge_temp,
        ].filter((t): t is number => typeof t === 'number');
        return temps.length > 0
          ? (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1)
          : null;
      })()
    : null;

  return (
    <div className={styles.wrapper}>
      {selectedTrench && (
        <div className={styles.headerBlock}>
          <h4>Информация о траншее</h4>
          <p>
            <strong>Дата:</strong>{' '}
            {selectedTrench.date
              ? new Date(selectedTrench.date).toLocaleDateString()
              : '—'}
          </p>
          <p>
            <strong>Культура:</strong>{' '}
            {cropsData.find(c => c.id === selectedTrench.crop_id)?.name ?? '—'}
            <br />
            <strong>Погода:</strong>{' '}
            {weatherData.find(w => w.id === selectedTrench.weather_id)?.name ??
              '—'}
            <br />
            <strong>Темп. в траншее:</strong>{' '}
            {avgTemp !== null ? `${avgTemp}°C` : '—'}
            <br />
            <strong>Вес:</strong>{' '}
            {selectedTrench.weight != null
              ? `${selectedTrench.weight} кг`
              : '—'}
          </p>
        </div>
      )}

      <table className={styles.table}>
        <thead>
          <tr>
            <th colSpan={6}>Сито</th>
          </tr>
          <tr>
            <th>Дата</th>
            <th>Механизатор</th>
            <th>Верхнее</th>
            <th>Среднее</th>
            <th>Нижнее</th>
            <th>Поддон</th>
          </tr>
        </thead>
        <tbody>
          {data.map(entry => {
            const total =
              (entry.high ?? 0) +
              (entry.middle ?? 0) +
              (entry.low ?? 0) +
              (entry.pallet ?? 0);

            const renderCell = (key: NumericKeys, value: number | null) => {
              if (value == null || total === 0) return <td>-</td>;
              const percent = (value / total) * 100;
              return (
                <td
                  className={
                    isOutOfNormPercent(cropId, key, percent)
                      ? styles.highlight
                      : undefined
                  }
                >
                  {percent.toFixed(1)} % ({value}г)
                </td>
              );
            };

            return (
              <tr
                key={entry.id}
                onClick={() =>
                  setSelectedSieveId(prevId =>
                    prevId === entry.id ? null : entry.id
                  )
                }
                className={
                  entry.id === selectedSieveId
                    ? styles.selectedRow
                    : styles.row
                }
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
                <td>{entry.machine_operator ?? '-'}</td>
                {renderCell('high', entry.high)}
                {renderCell('middle', entry.middle)}
                {renderCell('low', entry.low)}
                {renderCell('pallet', entry.pallet)}
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className={styles.averageRow}>
            <td colSpan={2}>Средние:</td>
            {keys.map(key => {
              const avg = parseFloat(averages[key]);
              return (
                <td
                  key={key}
                  className={
                    isOutOfNormPercent(cropId, key, isNaN(avg) ? null : avg)
                      ? styles.highlight
                      : undefined
                  }
                >
                  {isNaN(avg) ? '-' : `${avg.toFixed(1)} %`}
                </td>
              );
            })}
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default SieveDataDetails;
