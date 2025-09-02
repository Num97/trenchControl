import React from "react";
import styles from "./CropNormsSettingsMenu.module.css";

type ActiveTab = "manual" | "fossTemplates" | "sieveTemplates";

interface CropNormsSettingsMenuProps {
  activeTab: ActiveTab;
  setActiveTab: React.Dispatch<React.SetStateAction<ActiveTab>>;
}

const CropNormsSettingsMenu: React.FC<CropNormsSettingsMenuProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className={styles.container}>
      <div
        className={`${styles.block} ${activeTab === "manual" ? styles.active : ""}`}
        onClick={() => setActiveTab("manual")}
      >
        Управление нормами
      </div>
      <div
        className={`${styles.block} ${activeTab === "fossTemplates" ? styles.active : ""}`}
        onClick={() => setActiveTab("fossTemplates")}
      >
        Настройка шаблонов Foss
      </div>
      <div
        className={`${styles.block} ${activeTab === "sieveTemplates" ? styles.active : ""}`}
        onClick={() => setActiveTab("sieveTemplates")}
      >
        Настройка шаблонов сито
      </div>
    </div>
  );
};

export default CropNormsSettingsMenu;
