import styles from "./FossTemplateCard.module.css";
import { Button } from "@mui/material";
import type { FossTemplate } from "../../../types/form";
import { deleteFossTemplateById } from "../../../utils/api";

interface FossTemplateCardProps {
  template: FossTemplate;
  onDeleteFossTemplate?: (deletedId: number) => void;
  onEditTemplate?: (template: FossTemplate) => void;
}

const FossTemplateCard: React.FC<FossTemplateCardProps> = ({
  template,
  onDeleteFossTemplate,
  onEditTemplate,
}) => {

  const handleDelete = async () => {
    if (!template.id) return;
    const confirmed = window.confirm(`Удалить шаблон "${template.name}"?`);
    if (!confirmed) return;

    try {
      await deleteFossTemplateById(template.id);
      onDeleteFossTemplate?.(template.id);
    } catch (error) {
      console.error("Ошибка при удалении:", error);
      alert("Не удалось удалить шаблон");
    }
  };

const renderNormsTable = (
  template: FossTemplate,
  labels: Record<string, string>
) => {
  return (
    <table className={styles.normsTable}>
      <thead>
        <tr>
          <th>Параметр</th>
          <th>Мин</th>
          <th>Макс</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(labels).map(([key, label]) => {
          const lower = (template as any)[`${key}_lower_limit`];
          const upper = (template as any)[`${key}_upper_limit`];
          return (
            <tr key={key}>
              <td>{label}</td>
              <td>{lower ?? "—"}</td>
              <td>{upper ?? "—"}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};


  return (
    <div className={styles.card}>
      <h3 className={styles.cropName}>{template.name}</h3>

      <div className={styles.normsSection}>
        <h4>Foss шаблон:</h4>
        <div className={styles.normsTableWrapper}>
          {renderNormsTable(template, {
            dry_matter: "Сухое вещество",
            protein: "Протеин",
            starch: "Крахмал",
            adf: "КДК",
            ndf: "НДК",
            ash: "Зола",
            raw_fat: "Сырой жир",
          })}

          <div className={styles.buttonsRow}>
            <Button
              variant="contained"
              size="small"
              sx={{
                mt: 1,
                textTransform: "none",
                borderRadius: "8px",
                bgcolor: "warning.main",
                "&:hover": {
                  bgcolor: "warning.dark",
                },
              }}
            onClick={() => onEditTemplate?.(template)}
            >
              {template.id ? "Редактировать шаблон" : "Добавить шаблон"}
            </Button>

            {template.id && (
              <Button
                variant="contained"
                color="error"
                size="small"
                sx={{ mt: 1, ml: 1, textTransform: "none", borderRadius: "8px" }}
                onClick={handleDelete}
              >
                Удалить
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FossTemplateCard;
