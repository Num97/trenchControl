import React from 'react';
import type { TrenchControl, FossData, Sieve } from '../../types/form';
import TrenchControlTable from '../TrenchControlTable/TrenchControlTable';
import FossTable from '../FossTable/FossTable';
import SieveTable from '../SieveTable/SieveTable';
import styles from './TrenchControlView.module.css';

interface Props {
  data: TrenchControl[];
  foss: FossData[];
  sieve: Sieve[];
  onFossRowClick: (id: number) => void;
  onSieveRowClick: (id: number) => void;
}

const TrenchControlView: React.FC<Props> = ({ data, foss, sieve, onFossRowClick, onSieveRowClick }) => {
  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <div className={styles.tableBlock}>
          <TrenchControlTable data={data} />
        </div>
        <div className={styles.tableBlock}>
          <FossTable data={data} foss={foss} onRowClick={onFossRowClick} />
        </div>
        <div className={styles.tableBlock}>
          <SieveTable data={data} sieve={sieve} onRowClick={onSieveRowClick} />
        </div>
      </div>
    </div>
  );
};
export default TrenchControlView;
