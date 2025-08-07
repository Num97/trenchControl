import type { Farms, Trenches, TrenchControl, FossData, Sieve, Harvest } from '../../types/form';
import styles from './Header.module.css';
import { useEffect, useState } from 'react';

import TrenchControlModal from '../TrenchControlModal/TrenchControlModal';
import FossModal from '../FossModal/FossModal';
import SieveModal from '../SieveModal/SieveModal';
import FarmSettingsModal from '../FarmSettingsModal/FarmSettingsModal';
import FarmCardEditorModal from '../FarmCardEditorModal/FarmCardEditorModal';
import HarvestModal from '../HarvestModal/HarvestModal';

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
  onAddSieveData: (newItem: Sieve) => void;
  selectedTrenchControlId: number | null;
  setTrenchControlData: React.Dispatch<React.SetStateAction<TrenchControl[]>>;
  setSelectedTrenchControlId: React.Dispatch<React.SetStateAction<number | null>>;
  selectedFossId: number | null;
  setSelectedFossId: React.Dispatch<React.SetStateAction<number | null>>;
  selectedSieveId: number | null;
  setSelectedSieveId: React.Dispatch<React.SetStateAction<number | null>>;
  setFossData: React.Dispatch<React.SetStateAction<FossData[]>>;
  setSieveData: React.Dispatch<React.SetStateAction<Sieve[]>>;
  onUpdateTrenchControl: (updatedItem: TrenchControl) => void;
  trenchControlData: TrenchControl[];
  fossData: FossData[],
  sieveData: Sieve[],
  setShowFarmSettings: React.Dispatch<React.SetStateAction<boolean>>;
  showFarmSettings: boolean;
  setFarms: React.Dispatch<React.SetStateAction<Farms[]>>;
  selectedCardFarmId: number | null;
  setSelectedCardFarmId: React.Dispatch<React.SetStateAction<number | null>>;
  onUpdateFarm: (updatedFarm: Farms) => void;
  onAddTrench: (newTrench: Trenches) => void;
  onUpdateTrench: (updatedTrench: Trenches) => void;
  onDeleteTrench: (id: number) => void;
  harvestOptions: { id: number; harvesting: number }[];
  onAddHarvest: (newHarvest: Harvest) => void;
  harvests: Harvest[];
  onDeleteHarvest: (id: number) => void;
  onUpdateHarvest: (updatedHarvest: Harvest) => void;
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
  onAddSieveData,
  selectedTrenchControlId,
  setTrenchControlData,
  setSelectedTrenchControlId,
  selectedFossId,
  setSelectedFossId,
  selectedSieveId,
  setSelectedSieveId,
  setFossData,
  setSieveData,
  onUpdateTrenchControl,
  trenchControlData,
  fossData,
  sieveData,
  setShowFarmSettings,
  showFarmSettings,
  setFarms,
  selectedCardFarmId,
  setSelectedCardFarmId,
  onUpdateFarm,
  onAddTrench,
  onUpdateTrench,
  onDeleteTrench,
  harvestOptions,
  onAddHarvest,
  harvests,
  onDeleteHarvest,
  onUpdateHarvest
  
}: HeaderProps) {
  const currentYear = new Date().getFullYear();
  const seasonOptions = Array.from({ length: 4 }, (_, i) => currentYear - i);

  const filteredTrenches = trenches.filter((t) => t.farm_id === selectedFarmId);

  const [openTrenchModal, setOpenTrenchModal] = useState(false);
  const [openFossModal, setOpenFossModal] = useState(false);
  const [openSieveModal, setOpenSieveModal] = useState(false);
  const [openFarmModal, setOpenFarmModal] = useState(false);
  const [openFarmCardEditorModal, setOpenFarmCardEditorModal] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');

  const [confirmTrenchControlDelete, setConfirmTrenchControlDelete] = useState(false);
  const [confirmFossDelete, setConfirmFossDelete] = useState(false);
  const [confirmSieveDelete, setConfirmSieveDelete] = useState(false);
  const [confirmFarmDelete, setConfirmFarmDelete] = useState(false);

  const [isHarvestModalOpen, setIsHarvestModalOpen] = useState(false);

  const canEdit =
    (selectedFossRowId !== null && selectedFossId !== null && !showFarmSettings) ||
    (selectedSieveRowId !== null && selectedSieveId !== null && !showFarmSettings) ||
    (selectedTrenchControlId !== null && !selectedFossRowId && !selectedSieveRowId && !showFarmSettings) ||
    (showFarmSettings && selectedCardFarmId);

  const canDelete = canEdit;

  const handleShowFarmSettings = () => {
    setShowFarmSettings((prev) => !prev);
  };

  const handleAddClick = () => {
    if (showFarmSettings) {
      setOpenFarmModal(true);
      return;
    }
    if (selectedFossRowId) {
      setMode('create');
      setOpenFossModal(true);
      return;
    }
    if (selectedSieveRowId) {
      setMode('create');
      setOpenSieveModal(true);
      return;
    }
    if (selectedTrenchId === null) {
      alert('Пожалуйста, выберите траншею перед добавлением записи.');
      return;
    }
    setMode('create');
    setOpenTrenchModal(true);
  };

    const handleFarmAddSuccess = (id: number, name: string) => {
    alert(`Хозяйство добавлено: ${name}`);
    setFarms(prev => [...prev, { id, name }]);
    setOpenFarmModal(false);
  };

  //укос
  const handleScytheClick = () => {
    if (selectedTrenchId !== null) {
      setIsHarvestModalOpen(true);
    } else {
      console.warn('Сначала выберите траншею');
    }
  };

  const handleEditClick = () => {
    const canEditFoss = selectedFossRowId !== null && selectedFossId !== null  && !showFarmSettings;
    const canEditSieve = selectedSieveRowId !== null && selectedSieveId !== null  && !showFarmSettings;
    const canEditTrench = selectedTrenchControlId !== null && !selectedFossRowId && !selectedSieveRowId  && !showFarmSettings;
    const canEditFarm = showFarmSettings && selectedCardFarmId;

    if (!canEditFoss && !canEditSieve && !canEditTrench && !canEditFarm) {
      alert('Пожалуйста, выберите запись для редактирования.');
      return;
    }

    if (canEditFoss) {
      setMode('edit');
      setOpenFossModal(true);
      return;
    }

    if (canEditSieve) {
      setMode('edit');
      setOpenSieveModal(true);
      return;
    }

    if (canEditTrench) {
      setMode('edit');
      setOpenTrenchModal(true);
    }

    if (canEditFarm) {
      setOpenFarmCardEditorModal(true);
    }
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

  const handleDeleteClick = () => {
    const canDeleteFoss = selectedFossRowId !== null && selectedFossId !== null && !showFarmSettings;
    const canDeleteSieve = selectedSieveRowId !== null && selectedSieveId !== null && !showFarmSettings;
    const canDeleteFarm = showFarmSettings && selectedCardFarmId;
    const canDeleteTrench = selectedTrenchControlId !== null && !selectedFossRowId && !selectedSieveRowId && !showFarmSettings;

    if (!canDeleteFoss && !canDeleteSieve && !canDeleteTrench && !canDeleteFarm) {
      alert('Пожалуйста, выберите запись для удаления.');
      return;
    }

    const confirmed = window.confirm('Вы уверены, что хотите удалить эту запись и все связанные с ней данные?');
    if (!confirmed) return;

    if (canDeleteFarm) {
        setConfirmFarmDelete(true);
    }

    if (canDeleteFoss) {
      setConfirmFossDelete(true);
      return;
    }

    if (canDeleteSieve) {
      setConfirmSieveDelete(true);
      return;
    }

    if (canDeleteTrench) {
      setConfirmTrenchControlDelete(true);
      return;
    }
  };

  useEffect(() => {
    if (!confirmTrenchControlDelete || selectedTrenchControlId === null) return;

    const deleteTrenchControl = async () => {
      try {
        const response = await fetch(`/api/v1/trench/trench_control/${selectedTrenchControlId}`, {
          method: 'DELETE',
        });
        const data = await response.json();

        if (response.ok) {
          alert('Запись успешно удалена');
          setTrenchControlData(prev => prev.filter(item => item.id !== selectedTrenchControlId));
          setSelectedTrenchControlId(null);
        } else {
          alert(`Ошибка удаления: ${data.error}`);
        }
      } catch (err) {
        alert(`Ошибка сети: ${err}`);
      } finally {
        setConfirmTrenchControlDelete(false);
      }
    };

    deleteTrenchControl();
  }, [confirmTrenchControlDelete]);

  useEffect(() => {
    if (!confirmFossDelete || selectedFossId === null) return;

    const deleteFoss = async () => {
      try {
        const response = await fetch(`/api/v1/trench/foss_data/${selectedFossId}`, {
          method: 'DELETE',
        });
        const data = await response.json();

        if (response.ok) {
          alert('Запись успешно удалена');
          setFossData(prev => prev.filter(item => item.id !== selectedFossId));
          setSelectedFossId(null);
        } else {
          alert(`Ошибка удаления: ${data.error}`);
        }
      } catch (err) {
        alert(`Ошибка сети: ${err}`);
      } finally {
        setConfirmFossDelete(false);
      }
    };

    deleteFoss();
  }, [confirmFossDelete]);

  useEffect(() => {
    if (!confirmSieveDelete || selectedSieveId === null) return;

    const deleteSieve = async () => {
      try {
        const response = await fetch(`/api/v1/trench/sieve/${selectedSieveId}`, {
          method: 'DELETE',
        });
        const data = await response.json();

        if (response.ok) {
          alert('Запись успешно удалена');
          setSieveData(prev => prev.filter(item => item.id !== selectedSieveId));
          setSelectedSieveId(null);
        } else {
          alert(`Ошибка удаления: ${data.error}`);
        }
      } catch (err) {
        alert(`Ошибка сети: ${err}`);
      } finally {
        setConfirmSieveDelete(false);
      }
    };

    deleteSieve();
  }, [confirmSieveDelete]);

  useEffect(() => {
    if (!confirmFarmDelete || selectedCardFarmId === null) return;

    const deleteFarm = async () => {
      try {
        const response = await fetch(`/api/v1/trench/farms/${selectedCardFarmId}`, {
          method: 'DELETE',
        });
        const data = await response.json();

        if (response.ok) {
          alert('Хозяйство успешно удалено');
          setFarms(prev => prev.filter(item => item.id !== selectedCardFarmId));
          setSelectedCardFarmId(null);
        } else {
          alert(`Ошибка удаления: ${data.error}`);
        }
      } catch (err) {
        alert(`Ошибка сети: ${err}`);
      } finally {
        setConfirmFarmDelete(false);
      }
    };

    deleteFarm();
  }, [confirmFarmDelete]);

  const initialData = trenchControlData.find(item => item.id === selectedTrenchControlId);

  return (
    <header className={styles.header}>
      <select
        className={styles.select}
        value={selectedSeason}
        onChange={(e) => {
          const newSeason = Number(e.target.value);
          onSeasonChange(newSeason);
          if (onBackClick) onBackClick();
          onTrenchChange(null);
          setSelectedTrenchControlId(null);
        }}
      >
        {seasonOptions.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      <select className={styles.select} value={selectedFarmId ?? ''} onChange={(e) => {
        const val = e.target.value;
        onFarmChange(val === '' ? null : Number(val));
         if (onBackClick) onBackClick();
         setSelectedTrenchControlId(null);
      }}>
        {selectedFarmId === null && (
          <option value="" disabled>Добавьте хозяйство</option>
        )}
        {farms.map((f) => (
          <option key={f.id} value={f.id}>{f.name}</option>
        ))}
      </select>

      <select
        className={styles.select}
        value={selectedTrenchId ?? ''}
        onChange={(e) => {
          const val = e.target.value;
          onTrenchChange(val === '' ? null : Number(val));
          if (onBackClick) onBackClick(); 
          setSelectedTrenchControlId(null);
        }}
      >
        {selectedTrenchId === null && (
          <option value="" disabled>Добавьте траншею</option>
        )}
        {filteredTrenches.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>


      <button className={styles.addButton} onClick={handleAddClick}>{showFarmSettings ? 'Добавить хозяйство' : 'Добавить'}</button>
      <button className={styles.editButton} onClick={handleEditClick} disabled={!canEdit}>Редактировать</button>
      <button className={styles.deleteButton} onClick={handleDeleteClick} disabled={!canDelete}>Удалить</button>

      {showBackButton && onBackClick && (
        <button onClick={onBackClick} className={styles.backButton}>Назад</button>
      )}

      <div className={styles.iconBlock}>
        <img
          src="/static/img/trench/scythe.svg"
          alt="Settings"
          className={styles.icon}
          onClick={handleScytheClick}
        />

        <img
          src="/static/img/trench/wrench.svg"
          alt="Settings"
          className={styles.icon}
          onClick={handleShowFarmSettings}
        />
      </div>

      <TrenchControlModal
        open={openTrenchModal}
        onClose={() => setOpenTrenchModal(false)}
        selectedSeason={selectedSeason}
        selectedTrenchId={selectedTrenchId}
        onAddTrenchControl={onAddTrenchControl}
        selectedTrenchControlId={selectedTrenchControlId}
        onUpdateTrenchControl={onUpdateTrenchControl}
        mode={mode}
        initialData={initialData}
        harvestOptions={harvestOptions}
        onAddHarvest={onAddHarvest}
      />

      <FossModal
        open={openFossModal}
        onClose={() => setOpenFossModal(false)}
        selectedTrenchControlId={selectedFossRowId as number}
        onAddFossData={(newItem) => {
          onAddFossData(newItem);
          setOpenFossModal(false);
        }}
        mode={mode}
        existingFossData={
          selectedFossRowId
            ? fossData.find((f) => f.id === selectedFossId) || null
            : null
        }
        onUpdateFossData={(updatedItem) => {
          setFossData(prev =>
            prev.map(item => item.id === updatedItem.id ? updatedItem : item)
          );
          setOpenFossModal(false);
        }}
      />

      <SieveModal
        open={openSieveModal}
        onClose={() => setOpenSieveModal(false)}
        selectedTrenchControlId={selectedSieveRowId as number}
        onAddSieveData={(newItem) => {
          onAddSieveData(newItem);
          setOpenSieveModal(false);
        }}
        mode={mode}
        existingSieveData={
          selectedSieveRowId
            ? sieveData.find((f) => f.id === selectedSieveId) || null
            : null
        }
        onUpdateSieveData={(updatedItem) => {
          setSieveData(prev =>
            prev.map(item => item.id === updatedItem.id ? updatedItem : item)
          );
          setOpenSieveModal(false);
        }}
      />

      <FarmSettingsModal
        open={openFarmModal}
        onClose={() => setOpenFarmModal(false)}
        onSuccess={handleFarmAddSuccess}
      />

      <FarmCardEditorModal
        open={openFarmCardEditorModal}
        onClose={() => setOpenFarmCardEditorModal(false)}
        selectedFarmId={selectedCardFarmId}
        farms={farms}
        trenches={trenches}
        onUpdateFarm = {onUpdateFarm}
        onAddTrench = {onAddTrench}
        onUpdateTrench = {onUpdateTrench}
        onDeleteTrench = {onDeleteTrench}
      />

      <HarvestModal
        open={isHarvestModalOpen}
        onClose={() => setIsHarvestModalOpen(false)}
        trenchId={selectedTrenchId ?? 0}
        harvests={harvests}
        onAddHarvest={onAddHarvest}
        onDeleteHarvest={onDeleteHarvest}
        onUpdateHarvest={onUpdateHarvest}
      />
    </header>
  );
}

export default Header;
