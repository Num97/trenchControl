import React from 'react';
import type { TrenchControl, Weather, Crops } from '../../types/form';
import styles from './TrenchControlTable.module.css';

interface Props {
  data: TrenchControl[];
  selectedTrenchControlId: number | null;
  setSelectedTrenchControlId: React.Dispatch<React.SetStateAction<number | null>>;
  weatherData: Weather[];
  cropsData: Crops[];
}

const TrenchControlTable: React.FC<Props> = ({
  data,
  selectedTrenchControlId,
  setSelectedTrenchControlId,
  weatherData,
  cropsData,
}) => {
  const handleRowClick = (id: number) => {
    setSelectedTrenchControlId(prevId => (prevId === id ? null : id));
  };

  const weatherMap = React.useMemo(
    () => Object.fromEntries(weatherData.map(w => [w.id, w.name])),
    [weatherData]
  );

  const cropsMap = React.useMemo(
    () => Object.fromEntries(cropsData.map(c => [c.id, c.name])),
    [cropsData]
  );

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th colSpan={8}>Заготовка</th>
        </tr>
        <tr>
          <th>Дата</th>
          <th>Культура</th>
          <th>Погода</th>
          <th>Температура</th>
          <th>Левый край</th>
          <th>Центр</th>
          <th>Правый край</th>
          <th>Вес</th>
        </tr>
      </thead>
      <tbody>
        {data.map((entry) => {
          const temps = [
            entry.left_edge_temp,
            entry.middle_temp,
            entry.right_edge_temp,
          ].filter((t): t is number => typeof t === 'number');

          const avgTemp =
            temps.length > 0
              ? (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1)
              : null;

          return (
            <tr
              key={entry.id}
              onClick={() => handleRowClick(entry.id)}
              className={entry.id === selectedTrenchControlId ? styles.selectedRow : styles.row}
            >
              <td>{entry.date?.toLocaleDateString() ?? '-'}</td>
              <td>{cropsMap[entry.crop_id ?? 0] ?? '-'}</td>
              <td>{weatherMap[entry.weather_id ?? 0] ?? '-'}</td>
              <td>{avgTemp ?? '-'}</td>
              <td>{entry.left_edge_temp ?? '-'}</td>
              <td>{entry.middle_temp ?? '-'}</td>
              <td>{entry.right_edge_temp ?? '-'}</td>
              <td>{entry.weight ?? '-'}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TrenchControlTable;