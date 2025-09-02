import React, { useState } from "react";
import styles from "./CropNormCard.module.css";
import FossNormsModal from "../FossNormsModal/FossNormsModal";
import type { Crops, FossNorms, SieveNorms } from "../../../types/form";
import { deleteFossNormsById, deleteSieveNormsById } from "../../../utils/api";
import { Button } from "@mui/material";
import SieveNormsModal from "../SieveNormsModal/SieveNormsModal";

interface CropNormCardProps {
  crop: Crops;
  fossNorm?: FossNorms | null;
  sieveNorm?: SieveNorms | null;
  onAddFossNorms: (newItem: FossNorms) => void;
  onUpdateFossNorms?: (updatedItem: FossNorms) => void;
  onDeleteFossNorms?: (deletedId: number) => void;
  onAddSieveNorms: (newSieveNorms: SieveNorms) => void;
  onUpdateSieveNorms?: (updatedSieveNorms: SieveNorms) => void;
  onDeleteSieveNorms?: (deletedId: number) => void;
}

const CropNormCard: React.FC<CropNormCardProps> = ({ 
  crop,
  fossNorm, 
  sieveNorm,
  onAddFossNorms,
  onUpdateFossNorms, 
  onDeleteFossNorms,
  onAddSieveNorms,
  onUpdateSieveNorms, 
  onDeleteSieveNorms,
}) => {
  const [isFossModalOpen, setIsFossModalOpen] = useState(false);
  const [isSieveModalOpen, setIsSieveModalOpen] = useState(false);

  const handleDeleteFoss = async () => {
    if (!fossNorm?.id) return;
    const confirmed = window.confirm(`Вы уверены, что хотите удалить нормы Foss для "${crop.name}"?`);
    if (!confirmed) return;

    try {
      await deleteFossNormsById(fossNorm.id);
      onDeleteFossNorms?.(fossNorm.id);
    } catch (error) {
      console.error("Ошибка при удалении:", error);
      alert("Не удалось удалить нормы Foss");
    }
  };

const handleDeleteSieve = async () => {
  if (!sieveNorm?.id) return;

  const confirmed = window.confirm(
    `Вы уверены, что хотите удалить нормы Сито для "${crop.name}"?`
  );
  if (!confirmed) return;

  try {
    // вызов API для удаления
    await deleteSieveNormsById(sieveNorm.id);

    // обновляем UI через колбек, если он передан
    onDeleteSieveNorms?.(sieveNorm.id);

    alert("Нормы Сито успешно удалены");
  } catch (error) {
    console.error("Ошибка при удалении:", error);
    alert("Не удалось удалить нормы Сито");
  }
};

  const renderNormsTable = (
    norms: Record<string, number | null | undefined>,
    labels: Record<string, string>
  ) => {
    const rows = Object.entries(labels).map(([key, label]) => {
      const lower = norms[`${key}_lower_limit`];
      const upper = norms[`${key}_upper_limit`];
      return (
        <tr key={key}>
          <td>{label}</td>
          <td>{lower ?? "—"}</td>
          <td>{upper ?? "—"}</td>
        </tr>
      );
    });

    return (
      <table className={styles.normsTable}>
        <thead>
          <tr>
            <th>Параметр</th>
            <th>Мин</th>
            <th>Макс</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.cropName}>{crop.name}</h3>
      <div className={styles.normsContainer}>
        {/* Foss нормы */}
        <div className={styles.normsSection}>
          <h4>Foss нормы:</h4>
          <div className={styles.normsTableWrapper}>
            {fossNorm ? renderNormsTable(fossNorm, {
              dry_matter: "Сухое вещество",
              protein: "Протеин",
              starch: "Крахмал",
              adf: "КДК",
              ndf: "НДК",
              ash: "Зола",
              raw_fat: "Сырой жир",
            }) : <p className={styles.empty}>Нормы не заданы</p>}

            <div className={styles.buttonsRow}>
              <Button
                  variant="contained"
                  size="small"
                  sx={{
                    mt: 1,
                    textTransform: "none",
                    borderRadius: "8px",
                    bgcolor: fossNorm ? "warning.main" : "primary.main",
                    "&:hover": {
                      bgcolor: fossNorm ? "warning.dark" : "primary.dark",
                    },
                  }}
                  onClick={() => setIsFossModalOpen(true)}
                >
                  {fossNorm ? "Редактировать нормы Foss" : "Добавить нормы Foss"}
              </Button>

              {fossNorm && (
                <Button variant="contained" color="error" size="small" sx={{ mt: 1, ml: 1, textTransform: "none", borderRadius: "8px" }} onClick={handleDeleteFoss}>
                  Удалить нормы
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Сито нормы */}
        <div className={styles.normsSection}>
          <h4>Сито нормы:</h4>
          <div className={styles.normsTableWrapper}>
            {sieveNorm ? renderNormsTable(sieveNorm, {
              high: "Верхняя фракция",
              middle: "Средняя фракция",
              low: "Мелкая фракция",
              pallet: "Поддон",
            }) : <p className={styles.empty}>Нормы не заданы</p>}

            <div className={styles.buttonsRow}>
              <Button
                variant="contained"
                size="small"
                sx={{
                  mt: 1,
                  textTransform: "none",
                  borderRadius: "8px",
                  bgcolor: sieveNorm ? "warning.main" : "primary.main",
                  "&:hover": {
                    bgcolor: sieveNorm ? "warning.dark" : "primary.dark",
                  },
                }}
                onClick={() => setIsSieveModalOpen(true)}
              >
                {sieveNorm ? "Редактировать нормы Сито" : "Добавить нормы Сито"}
              </Button>
              {sieveNorm && (
                <Button variant="contained" color="error" size="small" sx={{ mt: 1, ml: 1, textTransform: "none", borderRadius: "8px" }} onClick={handleDeleteSieve}>
                  Удалить нормы
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Модалки */}
      <FossNormsModal
        open={isFossModalOpen}
        onClose={() => setIsFossModalOpen(false)}
        cropId={crop.id}
        mode={fossNorm ? "edit" : "create"}
        existingFossNorms={fossNorm}
        onAddFossNorms={onAddFossNorms}
        onUpdateFossNorms={onUpdateFossNorms}
        cropName={crop.name}
      />

      <SieveNormsModal
        open={isSieveModalOpen}
        onClose={() => setIsSieveModalOpen(false)}
        cropId={crop.id}
        mode={sieveNorm ? "edit" : "create"}
        existingSieveNorms={sieveNorm}
        onAddSieveNorms={onAddSieveNorms}
        onUpdateSieveNorms={onUpdateSieveNorms}
        cropName={crop.name}
      />
    </div>
  );
};

export default CropNormCard;