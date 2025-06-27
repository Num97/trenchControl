import type { Farms, Trenches, TrenchControl, FossData } from '../../types/form';
import styles from './Header.module.css';
import { useEffect, useState } from 'react';

import TrenchControlModal from '../TrenchControlModal/TrenchControlModal';
import FossModal from '../FossModal/FossModal';


interface HeaderProps {
  farms: Farms[];
  trenches: Trenches[];
  selectedFarmId: number | null;
  selectedTrenchId: number | null;
  selectedSeason: number;
  onFarmChange: (id: number | null) => void;
  onTrenchChange: (id: number | null) => void;
  onSeasonChange: (season: number) => void;
  showBackButton?: boolean;
  onBackClick?: () => void;
  selectedFossRowId: number | null;
  selectedSieveRowId: number | null;
  onAddTrenchControl: (newItem: TrenchControl) => void;
  onAddFossData: (newItem: FossData) => void;
}

function Header({
  farms,
  trenches,
  selectedFarmId,
  selectedTrenchId,
  selectedSeason,
  onFarmChange,
  onTrenchChange,
  onSeasonChange,
  showBackButton,
  onBackClick,
  selectedFossRowId,
  selectedSieveRowId,
  onAddTrenchControl,
  onAddFossData,
}: HeaderProps) {
  const currentYear = new Date().getFullYear();
  const seasonOptions = Array.from({ length: 4 }, (_, i) => currentYear - i);

  const filteredTrenches = trenches.filter((t) => t.farm_id === selectedFarmId);
  
  const [openTrenchModal, setOpenTrenchModal] = useState(false);
  const [openFossModal, setOpenFossModal] = useState(false);


    const handleAddClick = () => {
    if (selectedFossRowId) {
      console.log('Модальное окно FOSS');
      setOpenFossModal(true); // Открываем модалку FOSS
      return;
    }
    if (selectedSieveRowId) {
      console.log('Модальное окно сито');
      // Здесь можно добавить логику открытия модалки Сито
      return;
    }
    if (selectedTrenchId === null) {
      alert('Пожалуйста, выберите траншею перед добавлением записи.');
      return;
    }
    setOpenTrenchModal(true);
  };

  useEffect(() => {
    if (
      selectedFarmId !== null &&
      !filteredTrenches.find((t) => t.id === selectedTrenchId)
    ) {
      if (filteredTrenches.length > 0) {
        onTrenchChange(filteredTrenches[0].id);
      } else {
        onTrenchChange(null);
      }
    }
  }, [selectedFarmId, trenches, selectedTrenchId]);

  return (
    <header className={styles.header}>
      <select
        className={styles.select}
        value={selectedSeason}
        onChange={(e) => onSeasonChange(Number(e.target.value))}
      >
        {seasonOptions.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      <select
        className={styles.select}
        value={selectedFarmId ?? ''}
        onChange={(e) => {
          const val = e.target.value;
          onFarmChange(val === '' ? null : Number(val));
        }}
      >
        {selectedFarmId === null && (
        <option value="" disabled>
          Добавьте хозяйство
        </option>
         )}

        {farms.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name}
          </option>
        ))}
      </select>

      <select
        className={styles.select}
        value={selectedTrenchId ?? ''}
        onChange={(e) => {
          const val = e.target.value;
          onTrenchChange(val === '' ? null : Number(val));
        }}
      >
        {selectedTrenchId === null && (
        <option value="" disabled>
          Добавьте траншею
        </option>
        )}
        {filteredTrenches.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

        <button className={styles.addButton} onClick={handleAddClick}>
          Добавить
        </button>

        <button className={styles.editButton}>
          Редактировать
        </button>

        <button className={styles.deleteButton}>
          Удалить
        </button>

      {showBackButton && onBackClick && (
        <button onClick={onBackClick} className={styles.backButton}>
          Назад
        </button>
      )}
      <TrenchControlModal 
        open={openTrenchModal}
        onClose={() => setOpenTrenchModal(false)}
        selectedSeason={selectedSeason}
        selectedTrenchId={selectedTrenchId}
        onAddTrenchControl={onAddTrenchControl}
         />

        <FossModal
          open={openFossModal}
          onClose={() => setOpenFossModal(false)}
          selectedTrenchControlId={selectedFossRowId as number}
          onAddFossData={(newItem) => {
            onAddFossData(newItem);
            setOpenFossModal(false);
            // или можно передать через пропс в App
          }}
        />

    </header>
  );
}

export default Header;
