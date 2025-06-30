import React from 'react';
import type { Sieve } from '../../types/form';
import styles from './SieveDataDetails.module.css';

interface Props {
  data: Sieve[];
  selectedSieveId: number | null;
  setSelectedSieveId: React.Dispatch<React.SetStateAction<number | null>>;
}

const SieveDataDetails: React.FC<Props> = ({ data, selectedSieveId, setSelectedSieveId}) => {
  if (data.length === 0) {
    return <div className={styles.empty}>Нет подробных данных сито</div>;
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr >
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
          {data.map((entry) => (
            // <tr key={entry.id}>
            <tr
              key={entry.id}
              onClick={() =>
                setSelectedSieveId((prevId) => (prevId === entry.id ? null : entry.id))
              }
              className={entry.id === selectedSieveId ? styles.selectedRow : styles.row}
            >
              <td>{new Date(entry.date_time).toLocaleString()}</td>
              <td>{entry.high ?? '-'}</td>
              <td>{entry.middle ?? '-'}</td>
              <td>{entry.low ?? '-'}</td>
              <td>{entry.pallet ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SieveDataDetails;
