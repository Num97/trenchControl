import React from 'react';
import {useMemo, useState} from 'react';
import type { TrenchControl, FossData, Sieve, Harvest, Weather, Crops, FossNorms, SieveNorms } from '../../types/form';
import TrenchControlTable from '../TrenchControlTable/TrenchControlTable';
import { AverageHarvestingLabDataComparison } from '../AverageHarvestingLabDataComparison/AverageHarvestingLabDataComparison';
import FossTable from '../FossTable/FossTable';
import SieveTable from '../SieveTable/SieveTable';
import styles from './TrenchControlView.module.css';

interface Props {
  data: TrenchControl[];
  foss: FossData[];
  sieve: Sieve[];
  onFossRowClick: (id: number) => void;
  onSieveRowClick: (id: number) => void;
  selectedTrenchControlId: number | null;
  setSelectedTrenchControlId: React.Dispatch<React.SetStateAction<number | null>>;
  harvestData: Harvest[];
  wetherData: Weather[];
  cropsData: Crops[];
  fossNormsData: FossNorms[];
  sieveNormsData: SieveNorms[];
}

const TrenchControlView: React.FC<Props> = ({
  data,
  foss,
  sieve,
  onFossRowClick,
  onSieveRowClick,
  selectedTrenchControlId,
  setSelectedTrenchControlId,
  harvestData,
  wetherData,
  cropsData,
  fossNormsData,
  sieveNormsData,
}) => {
  if (data.length === 0) {
    return <div className={styles.empty}>Данные заготовки траншеи еще не занесены</div>;
  }

  const harvestingGroups = useMemo(() => {
    return harvestData.reduce<Record<number, Harvest>>((acc, h) => {
      acc[h.id] = h;
      return acc;
    }, {});
  }, [harvestData]);

  const harvestIds = useMemo(() => {
    return Array.from(
      new Set(data.map((d) => d.harvest_id).filter((id): id is number => !!id))
    );
  }, [data]);

  const sortedHarvests = useMemo(() => {
    return harvestIds
      .map((id) => harvestingGroups[id])
      .filter(Boolean)
      .sort((a, b) => (a.harvesting || 0) - (b.harvesting || 0));
  }, [harvestIds, harvestingGroups]);

  const [openedHarvestIds, setOpenedHarvestIds] = useState<number[]>([]);

  const toggleHarvestOpen = (id: number) => {
    setOpenedHarvestIds((prev) =>
      prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id]
    );
  };

  const isHarvestOpen = (id: number) => openedHarvestIds.includes(id);


  const weightedAveragesByHarvest = useMemo(() => {
    return sortedHarvests.map((harvest) => {
      const groupTrenchControl = data.filter((d) => d.harvest_id === harvest.id);

      const valuesToAverage = [
        'adf',
        'ash',
        'dry_matter',
        'ndf',
        'protein',
        'raw_fat',
        'starch',
      ] as const;

      const fossByTrenchId: Record<number, typeof foss> = {};
      foss.forEach((f) => {
        const trench = data.find((tc) => tc.id === f.trench_control_id);
        if (trench?.harvest_id === harvest.id) {
          if (!fossByTrenchId[f.trench_control_id]) {
            fossByTrenchId[f.trench_control_id] = [];
          }
          fossByTrenchId[f.trench_control_id].push(f);
        }
      });

      const totalTrenchWeight = groupTrenchControl.reduce((sum, trench) => sum + (trench.weight ?? 0), 0);

      let totalWeight = 0;
      const weightedSums: Record<string, number> = {};
      valuesToAverage.forEach((key) => (weightedSums[key] = 0));

      Object.entries(fossByTrenchId).forEach(([trenchIdStr, fossItems]) => {
        const trenchId = Number(trenchIdStr);
        const trench = groupTrenchControl.find((tc) => tc.id === trenchId);
        const weight = trench?.weight ?? 0;

        if (weight === 0) return;

        totalWeight += weight;

        const avgValues: Record<string, number> = {};
        valuesToAverage.forEach((key) => {
          const valid = fossItems.map((f) => f[key]).filter((v): v is number => typeof v === 'number');
          const avg = valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : 0;
          avgValues[key] = avg;
        });

        valuesToAverage.forEach((key) => {
          weightedSums[key] += avgValues[key] * weight;
        });
      });

      const weightedAverages: Record<string, number> = {};
      valuesToAverage.forEach((key) => {
        weightedAverages[key] = totalWeight > 0 ? weightedSums[key] / totalWeight : 0;
      });

      return {
        harvestId: harvest.id,
        weightedAverages,
        totalTrenchWeight,
      };
    });
  }, [data, foss, sortedHarvests]);

  return (
    <div className={styles.container}>
      {sortedHarvests.map((harvest) => {
        const groupTrenchControl = data.filter((d) => d.harvest_id === harvest.id);
        const groupFoss = foss.filter((f) =>
          groupTrenchControl.some((tc) => tc.id === f.trench_control_id)
        );
        const groupSieve = sieve.filter((s) =>
          groupTrenchControl.some((tc) => tc.id === s.trench_control_id)
        );

        const averageData = weightedAveragesByHarvest.find(
          (item) => item.harvestId === harvest.id
        );

        return (
          <div key={harvest.id} className={styles.harvestBlock}>
            <h2>Укос {harvest.harvesting || '—'}
            {/* <h2>Укос {sortedHarvests.findIndex(h => h.id === harvest.id) + 1} */}
            <button
              className={`${styles.toggleButton} ${
                isHarvestOpen(harvest.id) ? styles.toggleOpen : styles.toggleClosed
              }`}
              onClick={() => toggleHarvestOpen(harvest.id)}
            >
              {isHarvestOpen(harvest.id) ? '▲' : '▼'}
          </button>
            </h2>

            {isHarvestOpen(harvest.id) && averageData && (
              <AverageHarvestingLabDataComparison data={averageData} />
            )}

            <div className={styles.tableWrapper}>
              <div className={styles.tableBlock}>
                <TrenchControlTable
                  data={groupTrenchControl}
                  selectedTrenchControlId={selectedTrenchControlId}
                  setSelectedTrenchControlId={setSelectedTrenchControlId}
                  weatherData={wetherData}
                  cropsData={cropsData}
                />
              </div>
              <div className={styles.tableBlock}>
                <FossTable
                  data={groupTrenchControl}
                  foss={groupFoss}
                  onRowClick={onFossRowClick}
                  fossNormsData={fossNormsData}
                />
              </div>
              <div className={styles.tableBlock}>
                <SieveTable
                  data={groupTrenchControl}
                  sieve={groupSieve}
                  onRowClick={onSieveRowClick}
                  sieveNormsData={sieveNormsData}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrenchControlView;