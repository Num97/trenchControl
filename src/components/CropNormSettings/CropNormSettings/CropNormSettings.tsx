// src/components/CropNormSettings/CropNormSettings.tsx
import React from "react";
import CropNormSettingMenu from "../CropNormsSettingsMenu/CropNormsSettingsMenu";
import CropNormsSettingsManual from "../CropNormsSettingsManual/CropNormsSettingsManual";
import FossTemplatesSettingsManual from "../FossTemplateSettingsManual/FossTemplatesSettingsManual";
import type { Crops, FossNorms, SieveNorms, FossTemplate } from "../../../types/form";

interface CropNormSettingsProps {
  cropsData: Crops[];
  fossNormsData: FossNorms[];
  sieveNormsData: SieveNorms[];
  onAddFossNorms: (newItem: FossNorms) => void;
  onUpdateFossNorms?: (updatedItem: FossNorms) => void;
  onDeleteFossNorms?: (deletedId: number) => void;
  onAddSieveNorms: (newSieveNorms: SieveNorms) => void;
  onUpdateSieveNorms?: (updatedSieveNorms: SieveNorms) => void;
  onDeleteSieveNorms?: (deletedId: number) => void;
  fossTemplatesData: FossTemplate[];
  onAddFossTemplate: (newFossTemplate: FossTemplate) => void;
  onUpdateFossTemplate?: (updatedFossTemplate: FossTemplate) => void;
  onDeleteFossTemplate?: (deletedId: number) => void;
}

type ActiveTab = "manual" | "fossTemplates" | "sieveTemplates";

const CropNormSettings: React.FC<CropNormSettingsProps> = ({
  cropsData,
  fossNormsData,
  sieveNormsData,
  onAddFossNorms,
  onUpdateFossNorms, 
  onDeleteFossNorms,
  onAddSieveNorms,
  onUpdateSieveNorms, 
  onDeleteSieveNorms,
  fossTemplatesData,
  onAddFossTemplate,
  onUpdateFossTemplate, 
  onDeleteFossTemplate,
}) => {
  const [activeTab, setActiveTab] = React.useState<ActiveTab>("manual");

  return (
    <>
      <CropNormSettingMenu activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "manual" && (
        <CropNormsSettingsManual 
          cropsData={cropsData}
          fossNormsData={fossNormsData}
          sieveNormsData={sieveNormsData} 
          onAddFossNorms={onAddFossNorms}
          onUpdateFossNorms={onUpdateFossNorms}
          onDeleteFossNorms={onDeleteFossNorms}
          onAddSieveNorms={onAddSieveNorms}
          onUpdateSieveNorms={onUpdateSieveNorms}
          onDeleteSieveNorms={onDeleteSieveNorms}
        />
      )}

      {activeTab === "fossTemplates" && (
        <FossTemplatesSettingsManual
          fossTemplatesData={fossTemplatesData} // пока данные сюда надо пробросить из родителя
          onAddFossTemplate={onAddFossTemplate}
          onUpdateFossTemplate={onUpdateFossTemplate}
          onDeleteFossTemplate={onDeleteFossTemplate}
        />
      )}

      {activeTab === "sieveTemplates" && (
        <div style={{ padding: "1rem" }}>
          <p>⚙ Настройка шаблонов сито (пока пусто)</p>
        </div>
      )}
    </>
  );
};

export default CropNormSettings;
