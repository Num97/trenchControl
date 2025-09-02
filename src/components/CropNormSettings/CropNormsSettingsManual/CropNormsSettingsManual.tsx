import React from "react";
import styles from "./CropNormsSettingsManual.module.css";
import type { Crops, FossNorms, SieveNorms } from "../../../types/form";
import CropNormCard from "../CropNormCard/CropNormCard";

interface CropNormsSettingsManualProps {
  cropsData: Crops[];
  fossNormsData: FossNorms[];
  sieveNormsData: SieveNorms[];
  onAddFossNorms: (newItem: FossNorms) => void;
  onUpdateFossNorms?: (updatedItem: FossNorms) => void;
  onDeleteFossNorms?: (deletedId: number) => void;
  onAddSieveNorms: (newSieveNorms: SieveNorms) => void;
  onUpdateSieveNorms?: (updatedSieveNorms: SieveNorms) => void;
  onDeleteSieveNorms?: (deletedId: number) => void;
}

const CropNormsSettingsManual: React.FC<CropNormsSettingsManualProps> = ({
  cropsData,
  fossNormsData,
  sieveNormsData,
  onAddFossNorms,
  onUpdateFossNorms, 
  onDeleteFossNorms,
  onAddSieveNorms,
  onUpdateSieveNorms, 
  onDeleteSieveNorms,
}) => {
  const activeCrops = cropsData.filter((crop) => crop.active);

  return (
    <div className={styles.container}>
      {activeCrops.length > 0 ? (
        activeCrops.map((crop) => {
          const fossNorm = fossNormsData.find((f) => f.crop_id === crop.id) || null;
          const sieveNorm = sieveNormsData.find((s) => s.crop_id === crop.id) || null;

          return (
            <CropNormCard
              key={crop.id}
              crop={crop}
              fossNorm={fossNorm}
              sieveNorm={sieveNorm}
              onAddFossNorms={onAddFossNorms}
              onUpdateFossNorms={onUpdateFossNorms}
              onDeleteFossNorms={onDeleteFossNorms}
              onAddSieveNorms={onAddSieveNorms}
              onUpdateSieveNorms={onUpdateSieveNorms}
              onDeleteSieveNorms={onDeleteSieveNorms}
            />
          );
        })
      ) : (
        <p className={styles.empty}>Нет активных культур</p>
      )}
    </div>
  );
};

export default CropNormsSettingsManual;
