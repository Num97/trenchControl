import { useEffect, useState } from 'react';
import { getFarms, getTrenches, getTrenchControl, getFossData, getSieve } from './utils/api';
import type { Farms, Trenches, TrenchControl, FossData, Sieve } from './types/form';
import Header from './components/Header/Header';
import TrenchControlView from './components/TrenchControlView/TrenchControlView';
import FossDataDetails from './components/FossDataDetails/FossDataDetails';
import SieveDataDetails from './components/SieveDataDetails/SieveDataDetails';
import FarmsSettings from './components/FarmSettings/FarmSettings';

function App() {
  const [farms, setFarms] = useState<Farms[]>([]);
  const [trenches, setTrenches] = useState<Trenches[]>([]);
  const [trenchControl, setTrenchControl] = useState<TrenchControl[]>([]);
  const [foss, setFossData] = useState<FossData[]>([]);
  const [sieve, setSieveData] = useState<Sieve[]>([]);

  const [selectedFarmId, setSelectedFarmId] = useState<number | null>(null);
  const [selectedTrenchId, setSelectedTrenchId] = useState<number | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<number>(new Date().getFullYear());

  const [selectedFossRowId, setSelectedFossRowId] = useState<number | null>(null);
  const [selectedSieveRowId, setSelectedSieveRowId] = useState<number | null>(null);

  const [selectedTrenchControlId, setSelectedTrenchControlId] = useState<number | null>(null);
  const [selectedFossId, setSelectedFossId] = useState<number | null>(null);
  const [selectedSieveId, setSelectedSieveId] = useState<number | null>(null);

  const [showFarmSettings, setShowFarmSettings] = useState<boolean>(false);
  const [selectedCardFarmId, setSelectedCardFarmId] = useState<number | null>(null);

  // колбэки для карточек хозяйств

  const handleUpdateFarm = (updatedFarm: Farms) => {
    setFarms(prev => prev.map(f => f.id === updatedFarm.id ? updatedFarm : f));
  };

  const handleAddTrench = (newTrench: Trenches) => {
    setTrenches(prev => [...prev, newTrench]);
  };

  const handleUpdateTrench = (updatedTrench: Trenches) => {
    setTrenches(prev => prev.map(t => t.id === updatedTrench.id ? updatedTrench : t));
  };

  const handleDeleteTrench = (id: number) => {
    setTrenches(prev => prev.filter(t => t.id !== id));
  };

  // конец колбэков карточек хозяйств

  const handleAddTrenchControl = (newItem: TrenchControl) => {
    setTrenchControl(prev => {
      const updated = [...prev, newItem];
      return updated.sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA; // сортировка по убыванию даты
      });
    });
  };

  const handleUpdateTrenchControl = (updatedItem: TrenchControl) => {
    setTrenchControl(prev => {
      const updated = prev.map(item => item.id === updatedItem.id ? updatedItem : item);
      return updated.sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      });
    });
  };

  const handleAddFossData = (newItem: FossData) => {
      setFossData(prev => {
    const updated = [...prev, newItem];
    return updated.sort((a, b) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime());
  });
  };

  const handleAddSieveData = (newItem: Sieve) => {
      setSieveData(prev => {
    const updated = [...prev, newItem];
    return updated.sort((a, b) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime());
  });
  };
  
  const handleFossRowClick = (trenchControlId: number) => {
    setSelectedFossRowId(trenchControlId);
  };

  const handleSieveRowClick = (trenchControlId: number) => {
    setSelectedSieveRowId(trenchControlId);
  };

  const handleBack = () => {
    setSelectedFossRowId(null);
    setSelectedSieveRowId(null);
    setSelectedFossId(null);
    setSelectedSieveId(null);
    setShowFarmSettings(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const farmsData = await getFarms();
      const trenchesData = await getTrenches();
      const trenchControlData = await getTrenchControl(selectedSeason);
      const fossData = await getFossData();
      const sieveData = await getSieve();

      setFarms(farmsData);
      setTrenches(trenchesData);
      setTrenchControl(trenchControlData);
      setFossData(fossData);
      setSieveData(sieveData);

      if (farmsData.length > 0) {
        const initialFarmId = farmsData[0].id;
        setSelectedFarmId(initialFarmId);

        const trenchesForFarm = trenchesData.filter(t => t.farm_id === initialFarmId);
        if (trenchesForFarm.length > 0) {
          setSelectedTrenchId(trenchesForFarm[0].id);
        }
      }
    };
    fetchData();
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      const data = await getTrenchControl(selectedSeason);
      setTrenchControl(data);
    };
    fetchData();
  }, [selectedSeason]);

    const filteredTrenchData = trenchControl.filter((entry) => {
    const trench = trenches.find((t) => t.id === entry.trench_id);
    if (!trench) return false;

    const matchFarm = selectedFarmId ? trench.farm_id === selectedFarmId : true;
    const matchTrench = selectedTrenchId ? entry.trench_id === selectedTrenchId : true;

    return matchFarm && matchTrench;
  });

  return (
    <div>
      <Header
        farms={farms}
        trenches={trenches}
        selectedFarmId={selectedFarmId}
        selectedTrenchId={selectedTrenchId}
        selectedSeason={selectedSeason}
        onFarmChange={setSelectedFarmId}
        onTrenchChange={setSelectedTrenchId}
        onSeasonChange={setSelectedSeason}
        showBackButton={!!selectedFossRowId || !!selectedSieveRowId || !!showFarmSettings}
        onBackClick={handleBack}
        selectedFossRowId={selectedFossRowId}
        selectedSieveRowId={selectedSieveRowId}
        onAddTrenchControl={handleAddTrenchControl}
        onAddFossData={handleAddFossData}
        onAddSieveData={handleAddSieveData}
        selectedTrenchControlId={selectedTrenchControlId}
        setTrenchControlData={setTrenchControl}
        setSelectedTrenchControlId={setSelectedTrenchControlId}
        selectedFossId={selectedFossId}
        setSelectedFossId={setSelectedFossId}
        selectedSieveId={selectedSieveId}
        setSelectedSieveId={setSelectedSieveId}
        setFossData={setFossData}
        setSieveData={setSieveData}
        onUpdateTrenchControl={handleUpdateTrenchControl}
        trenchControlData={trenchControl}
        fossData={foss}
        sieveData={sieve}
        setShowFarmSettings={setShowFarmSettings}
        showFarmSettings = {showFarmSettings}
        setFarms={setFarms}
        selectedCardFarmId={selectedCardFarmId}
        setSelectedCardFarmId={setSelectedCardFarmId}
        onUpdateFarm = {handleUpdateFarm}
        onAddTrench = {handleAddTrench}
        onUpdateTrench = {handleUpdateTrench}
        onDeleteTrench = {handleDeleteTrench}
      />

        {showFarmSettings ? (
            <FarmsSettings
              farms={farms}
              trenches = {trenches}
              selectedCardFarmId={selectedCardFarmId}
              setSelectedCardFarmId={setSelectedCardFarmId}
              />
        ) : selectedSieveRowId ? (
          <div>
            <SieveDataDetails 
              data={sieve.filter(s => s.trench_control_id === selectedSieveRowId)} 
              selectedSieveId={selectedSieveId}
              setSelectedSieveId={setSelectedSieveId}
              trenchControlData={filteredTrenchData}
              selectedSieveRowId={selectedSieveRowId}
            />
          </div>
        ) : selectedFossRowId ? (
          <div>
            <FossDataDetails 
                data={foss.filter(f => f.trench_control_id === selectedFossRowId)}
                selectedFossId={selectedFossId}
                setSelectedFossId={setSelectedFossId}
                trenchControlData={filteredTrenchData}
                selectedFossRowId={selectedFossRowId}
            />
          </div>
        ) : (
          <TrenchControlView
            data={filteredTrenchData}
            foss={foss}
            sieve={sieve}
            onFossRowClick={handleFossRowClick}
            onSieveRowClick={handleSieveRowClick}
            selectedTrenchControlId={selectedTrenchControlId}
            setSelectedTrenchControlId={setSelectedTrenchControlId}
          />
        )}

    </div>
  );
}

export default App;
