import type { Farms, Trenches } from '../../types/form';
import styles from './FarmSettings.module.css';

interface FarmSettingsProps {
  farms: Farms[];
  trenches: Trenches[];
  selectedCardFarmId: number | null;
  setSelectedCardFarmId: React.Dispatch<React.SetStateAction<number | null>>;
}

function FarmsSettings({
    farms,
    trenches,
    selectedCardFarmId,
    setSelectedCardFarmId,
   }: FarmSettingsProps) {

  return (
    <div className={styles.container}>
      {farms.map((farm) => {
        const farmTrenches = trenches.filter((t) => t.farm_id === farm.id);

        return (
          <div
            key={farm.id}
            className={
              farm.id === selectedCardFarmId ? styles.cardSelected : styles.card
            }
            onClick={() => setSelectedCardFarmId(prev => prev === farm.id ? null : farm.id)}
          >
            <h3 className={styles.farmName}>{farm.name}</h3>
            <ul className={styles.trenchList}>
              {farmTrenches.length > 0 ? (
                farmTrenches.map((trench) => (
                  <li key={trench.id} className={styles.trenchItem}>
                    {trench.name}
                  </li>
                ))
              ) : (
                <li className={styles.noTrenches}>Нет траншей</li>
              )}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

export default FarmsSettings;
