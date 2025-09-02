import { useEffect, useState } from 'react';
import { getFarms, getTrenches, getTrenchControl, getFossData, getSieve, getHarvest, getWeather, getCrops, getFossNorms, getSieveNorms, getFossTemplate } from './utils/api';
import type { Farms, Trenches, TrenchControl, FossData, Sieve, Harvest, Weather, Crops, FossNorms, SieveNorms, FossTemplate } from './types/form';
import Header from './components/Header/Header';
import TrenchControlView from './components/TrenchControlView/TrenchControlView';
import FossDataDetails from './components/FossDataDetails/FossDataDetails';
import SieveDataDetails from './components/SieveDataDetails/SieveDataDetails';
import FarmsSettings from './components/FarmSettings/FarmSettings';
import CropNormSettings from './components/CropNormSettings/CropNormSettings/CropNormSettings';

function App() {
  const [farms, setFarms] = useState<Farms[]>([]);
  const [trenches, setTrenches] = useState<Trenches[]>([]);
  const [harvest, setHarvest] = useState<Harvest[]>([])
  const [weather, setWeather] = useState<Weather[]>([])
  const [crops, setCrops] = useState<Crops[]>([])
  const [trenchControl, setTrenchControl] = useState<TrenchControl[]>([]);
  const [foss, setFossData] = useState<FossData[]>([]);
  const [sieve, setSieveData] = useState<Sieve[]>([]);
  const [fossNorms, setFossNorms] = useState<FossNorms[]>([]);
  const [sieveNorms, setSieveNorms] = useState<SieveNorms[]>([]);
  const [fossTemplate, setFossTemplate] = useState<FossTemplate[]>([]);

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

  // Компонент управления шаблонами
  const [showCropNormsSettings, setShowCropNormsSettings] = useState<boolean>(false);

  const handleAddFossNorms = (newFossNorms: FossNorms) => {
    setFossNorms(prev => [...prev, newFossNorms]);
  };

  const handleUpdateFossNorms = (updatedFossNorms: FossNorms) => {
    setFossNorms(prev => prev.map(t => t.id === updatedFossNorms.id ? updatedFossNorms : t));
  };

  const handleDeleteFossNorms = (id: number) => {
    setFossNorms(prev => prev.filter(t => t.id !== id));
  };
  
  const handleAddSieveNorms = (newSieveNorms: SieveNorms) => {
    setSieveNorms(prev => [...prev, newSieveNorms]);
  };

  const handleUpdateSieveNorms = (updatedSieveNorms: SieveNorms) => {
    setSieveNorms(prev => prev.map(t => t.id === updatedSieveNorms.id ? updatedSieveNorms : t));
  };

  const handleDeleteSieveNorms = (id: number) => {
    setSieveNorms(prev => prev.filter(t => t.id !== id));
  };

    const handleAddFossTemplate = (newFossTemplate: FossTemplate) => {
    setFossTemplate(prev => [...prev, newFossTemplate]);
  };

  const handleUpdateFossTemplate = (updatedFossTemplate: FossTemplate) => {
    setFossTemplate(prev => prev.map(t => t.id === updatedFossTemplate.id ? updatedFossTemplate : t));
  };

  const handleDeleteFossTemplate = (id: number) => {
    setFossTemplate(prev => prev.filter(t => t.id !== id));
  };

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

  // начало колбэков хозяйств
  const handleAddHarvest = (newHarvest: Harvest) => {
    setHarvest(prev => [...prev, newHarvest]);
  };

  const handleDeleteHarvest = (harvestId: number) => {
    setHarvest((prev) => prev.filter((h) => h.id !== harvestId));
  };

  const handleUpdateHarvest = (updated: Harvest) => {
    setHarvest((prev) =>
      prev.map((h) => (h.id === updated.id ? updated : h))
    );
  };
// Погода
  const handleAddWeather = (newWeather: Weather) => {
    setWeather(prev => [...prev, newWeather]);
  };

  const handleDeleteWeather = (weatherId: number) => {
    setWeather((prev) => prev.filter((h) => h.id !== weatherId));
  };

  const handleUpdateWeather = (updated: Weather) => {
    setWeather((prev) =>
      prev.map((h) => (h.id === updated.id ? updated : h))
    );
  };

// Культуры
  const handleAddCrop = (newCrop: Crops) => {
    setCrops(prev => [...prev, newCrop]);
  };

  const handleDeleteCrop = (cropId: number) => {
    setCrops((prev) => prev.filter((h) => h.id !== cropId));
  };

  const handleUpdateCrop = (updated: Crops) => {
    setCrops((prev) =>
      prev.map((h) => (h.id === updated.id ? updated : h))
    );
  };


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
    // setSelectedTrenchControlId(null);
    setShowFarmSettings(false);
    setShowCropNormsSettings(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const farmsData = await getFarms();
      const trenchesData = await getTrenches();
      const harvestData = await getHarvest(selectedSeason);
      const trenchControlData = await getTrenchControl();
      const fossData = await getFossData();
      const sieveData = await getSieve();
      const weatherData = await getWeather();
      const cropsData = await getCrops();
      const fossNormsData = await getFossNorms();
      const sieveNormsData = await getSieveNorms();
      const fossTemplateData = await getFossTemplate();

      setFarms(farmsData);
      setTrenches(trenchesData);
      setTrenchControl(trenchControlData);
      setFossData(fossData);
      setSieveData(sieveData);
      setHarvest(harvestData);
      setWeather(weatherData);
      setCrops(cropsData);
      setFossNorms(fossNormsData);
      setSieveNorms(sieveNormsData);
      setFossTemplate(fossTemplateData);

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
      const data = await getHarvest(selectedSeason);
      setHarvest(data);
    };
    fetchData();
  }, [selectedSeason]);

  const filteredTrenchData = trenchControl.filter((entry) => {
  const harvestEntry = harvest.find(h => h.id === entry.harvest_id);
  if (!harvestEntry) return false;

  const trench = trenches.find(t => t.id === harvestEntry.trench_id);
  if (!trench) return false;

  const matchFarm = selectedFarmId ? trench.farm_id === selectedFarmId : true;
  const matchTrench = selectedTrenchId ? trench.id === selectedTrenchId : true;
  return matchFarm && matchTrench;
});

const filteredHarvests = selectedTrenchId
  ? harvest.filter(h => h.trench_id === selectedTrenchId)
  : [];


const harvestOptions = filteredHarvests.map(h => ({
  id: h.id,
  harvesting: h.harvesting
}));

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
        showBackButton={!!selectedFossRowId || !!selectedSieveRowId || !!showFarmSettings || !!showCropNormsSettings}
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
        harvestOptions={harvestOptions}
        onAddHarvest={handleAddHarvest}
        harvests={harvest}
        onDeleteHarvest={handleDeleteHarvest}
        onUpdateHarvest={handleUpdateHarvest}
        onAddWeather={handleAddWeather}
        weathers={weather}
        onDeleteWeather={handleDeleteWeather}
        onUpdateWeather={handleUpdateWeather}
        weatherData={weather}
        cropsData={crops}
        onAddCrop={handleAddCrop}
        onDeleteCrop={handleDeleteCrop}
        onUpdateCrop={handleUpdateCrop}
        setShowCropNormSettings={setShowCropNormsSettings}
        showCropNormsSettings={showCropNormsSettings}
      />

        {showFarmSettings ? (
            <FarmsSettings
              farms={farms}
              trenches = {trenches}
              selectedCardFarmId={selectedCardFarmId}
              setSelectedCardFarmId={setSelectedCardFarmId}
              />
        ) : showCropNormsSettings ? (
          <CropNormSettings
          cropsData={crops}
          fossNormsData={fossNorms}
          sieveNormsData={sieveNorms}
          onAddFossNorms={handleAddFossNorms}
          onUpdateFossNorms={handleUpdateFossNorms}
          onDeleteFossNorms={handleDeleteFossNorms}
          onAddSieveNorms={handleAddSieveNorms}
          onUpdateSieveNorms={handleUpdateSieveNorms}
          onDeleteSieveNorms={handleDeleteSieveNorms}
          fossTemplatesData={fossTemplate}
          onAddFossTemplate={handleAddFossTemplate}
          onUpdateFossTemplate={handleUpdateFossTemplate}
          onDeleteFossTemplate={handleDeleteFossTemplate}
          />
        ) : selectedSieveRowId ? (
          <div>
            <SieveDataDetails 
              data={sieve.filter(s => s.trench_control_id === selectedSieveRowId)} 
              selectedSieveId={selectedSieveId}
              setSelectedSieveId={setSelectedSieveId}
              trenchControlData={filteredTrenchData}
              selectedSieveRowId={selectedSieveRowId}
              weatherData={weather}
              cropsData={crops}
              sieveNormsData={sieveNorms}
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
                weatherData={weather}
                cropsData={crops}
                fossNormsData={fossNorms}
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
            harvestData={filteredHarvests}
            wetherData={weather}
            cropsData={crops}
            fossNormsData={fossNorms}
            sieveNormsData={sieveNorms}
          />
        )}

    </div>
  );
}

export default App;
