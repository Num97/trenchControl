import React from 'react';
import type { FossData } from '../../types/form';
import styles from './FossDataDetails.module.css';

interface Props {
  data: FossData[];
  selectedFossId: number | null;
  setSelectedFossId: React.Dispatch<React.SetStateAction<number | null>>;
}

const FossDataDetails: React.FC<Props> = ({
                                    data,
                                    selectedFossId,
                                    setSelectedFossId, }) => {
  if (data.length === 0) {
    return <div className={styles.empty}>Нет подробных данных FOSS</div>;
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr >
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
            // <tr key={entry.id}>
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
      </table>
    </div>
  );
};

export default FossDataDetails;
