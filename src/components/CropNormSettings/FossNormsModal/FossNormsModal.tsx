import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import type { FossNorms } from "../../../types/form";

interface FossNormsModalProps {
  open: boolean;
  onClose: () => void;
  cropId: number;
  onAddFossNorms: (newItem: FossNorms) => void;
  mode: "create" | "edit";
  existingFossNorms?: FossNorms | null;
  onUpdateFossNorms?: (updatedItem: FossNorms) => void;
  cropName: string;
}

const fieldGroups = [
  {
    key: "dry_matter",
    label: "Сухое вещество (%)",
  },
  {
    key: "protein",
    label: "Белок (%)",
  },
  {
    key: "starch",
    label: "Крахмал (%)",
  },
  {
    key: "adf",
    label: "КДК",
  },
  {
    key: "ndf",
    label: "НДК",
  },
  {
    key: "ash",
    label: "Зола",
  },
  {
    key: "raw_fat",
    label: "Сырой жир (%)",
  },
];

const FossNormsModal: React.FC<FossNormsModalProps> = ({
  open,
  onClose,
  cropId,
  onAddFossNorms,
  mode,
  existingFossNorms = null,
  onUpdateFossNorms,
  cropName,
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (mode === "edit" && existingFossNorms) {
        const newData: Record<string, string> = {};
        fieldGroups.forEach(({ key }) => {
          newData[`${key}_lower_limit`] =
            (existingFossNorms as any)[`${key}_lower_limit`]?.toString() ?? "";
          newData[`${key}_upper_limit`] =
            (existingFossNorms as any)[`${key}_upper_limit`]?.toString() ?? "";
        });
        setFormData(newData);
      } else {
        const emptyData: Record<string, string> = {};
        fieldGroups.forEach(({ key }) => {
          emptyData[`${key}_lower_limit`] = "";
          emptyData[`${key}_upper_limit`] = "";
        });
        setFormData(emptyData);
      }
    }
  }, [open, mode, existingFossNorms]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const payload: any = { crop_id: cropId };

    fieldGroups.forEach(({ key }) => {
      payload[`${key}_lower_limit`] = formData[`${key}_lower_limit`]
        ? parseFloat(formData[`${key}_lower_limit`])
        : null;
      payload[`${key}_upper_limit`] = formData[`${key}_upper_limit`]
        ? parseFloat(formData[`${key}_upper_limit`])
        : null;
    });

    try {
      let response, data;
      if (mode === "create") {
        response = await fetch("/api/v1/trench/foss_norms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        data = await response.json();

        if (response.ok) {
          alert("Норма FOSS успешно добавлена");
          onAddFossNorms({ id: data.id, ...payload });
          onClose();
        } else {
          alert(`Ошибка: ${data.error}`);
        }
      } else if (mode === "edit" && existingFossNorms) {
        response = await fetch(
          `/api/v1/trench/foss_norms/${existingFossNorms.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        data = await response.json();

        if (response.ok) {
          alert("Норма FOSS успешно обновлена");
          onUpdateFossNorms?.({ id: existingFossNorms.id, ...payload });
          onClose();
        } else {
          alert(`Ошибка обновления: ${data.error}`);
        }
      }
    } catch (error) {
      alert(`Ошибка отправки: ${error}`);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {mode === "edit" ? `Редактировать норму FOSS для "${cropName}"` : `Добавить норму FOSS для "${cropName}"`}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          {fieldGroups.map(({ key, label }) => (
            <Box
              key={key}
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: "1fr 1fr",
                alignItems: "center",
              }}
            >
              <TextField
                label={`${label} (мин.)`}
                name={`${key}_lower_limit`}
                type="number"
                value={formData[`${key}_lower_limit`] ?? ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label={`${label} (макс.)`}
                name={`${key}_upper_limit`}
                type="number"
                value={formData[`${key}_upper_limit`] ?? ""}
                onChange={handleChange}
                fullWidth
              />
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FossNormsModal;
