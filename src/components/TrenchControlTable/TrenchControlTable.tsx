import React from 'react';
import type { TrenchControl } from '../../types/form';
import styles from './TrenchControlTable.module.css';

interface Props {
  data: TrenchControl[];
}

const TrenchControlTable: React.FC<Props> = ({ data }) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr >
          <th colSpan={8}>Заготовка</th>
        </tr>
        <tr>
          <th>Дата</th>
          <th>Культура</th>
          <th>Погода</th>
          <th>Темп. в траншее</th>
          <th>Левый край</th>
          <th>Центр</th>
          <th>Правый край</th>
          <th>Вес</th>
        </tr>
      </thead>
      <tbody>
        {data.map((entry) => (
          <tr key={entry.id}>
            <td>{entry.date?.toLocaleDateString() ?? '-'}</td>
            <td>{entry.crop ?? '-'}</td>
            <td>{entry.weather ?? '-'}</td>
            <td>{entry.temp_trench ?? '-'}</td>
            <td>{entry.left_edge_temp ?? '-'}</td>
            <td>{entry.middle_temp ?? '-'}</td>
            <td>{entry.right_edge_temp ?? '-'}</td>
            <td>{entry.weight ?? '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TrenchControlTable;

