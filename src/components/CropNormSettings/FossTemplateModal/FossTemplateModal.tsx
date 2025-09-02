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
import type { FossTemplate } from "../../../types/form";

interface FossTemplateModalProps {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  existingTemplate?: FossTemplate | null;
  onAddFossTemplate: (newItem: FossTemplate) => void;
  onUpdateFossTemplate?: (updatedItem: FossTemplate) => void;
}

const fieldGroups = [
  { key: "dry_matter", label: "Сухое вещество (%)" },
  { key: "protein", label: "Белок (%)" },
  { key: "starch", label: "Крахмал (%)" },
  { key: "adf", label: "КДК" },
  { key: "ndf", label: "НДК" },
  { key: "ash", label: "Зола" },
  { key: "raw_fat", label: "Сырой жир (%)" },
];

const FossTemplateModal: React.FC<FossTemplateModalProps> = ({
  open,
  onClose,
  mode,
  existingTemplate = null,
  onAddFossTemplate,
  onUpdateFossTemplate,
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({
    name: "",
  });

  useEffect(() => {
    if (open) {
      if (mode === "edit" && existingTemplate) {
        const newData: Record<string, string> = {
          name: existingTemplate.name,
        };
        fieldGroups.forEach(({ key }) => {
          newData[`${key}_lower_limit`] =
            (existingTemplate as any)[`${key}_lower_limit`]?.toString() ?? "";
          newData[`${key}_upper_limit`] =
            (existingTemplate as any)[`${key}_upper_limit`]?.toString() ?? "";
        });
        setFormData(newData);
      } else {
        const emptyData: Record<string, string> = { name: "" };
        fieldGroups.forEach(({ key }) => {
          emptyData[`${key}_lower_limit`] = "";
          emptyData[`${key}_upper_limit`] = "";
        });
        setFormData(emptyData);
      }
    }
  }, [open, mode, existingTemplate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const payload: FossTemplate = {
      name: formData.name,
    };

    fieldGroups.forEach(({ key }) => {
      (payload as any)[`${key}_lower_limit`] = formData[`${key}_lower_limit`]
        ? parseFloat(formData[`${key}_lower_limit`])
        : null;
      (payload as any)[`${key}_upper_limit`] = formData[`${key}_upper_limit`]
        ? parseFloat(formData[`${key}_upper_limit`])
        : null;
    });

    try {
        let response, data;
        if (mode === "create") {
            response = await fetch("/api/v1/trench/foss_norms_template", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            });
            data = await response.json();

            if (response.ok) {
            alert("Шаблон FOSS успешно добавлен");
            onAddFossTemplate({ id: data.id, ...payload });
            onClose();
            } else {
            if (data.error?.includes("foss_norms_template_name_key")) {
                alert("Шаблон с таким именем уже существует");
            } else {
                alert(`Ошибка: ${data.error}`);
            }
            }
        } else if (mode === "edit" && existingTemplate) {
            response = await fetch(`/api/v1/trench/foss_norms_template/${existingTemplate.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            });
            data = await response.json();

            if (response.ok) {
            alert("Шаблон FOSS успешно обновлён");
            onUpdateFossTemplate?.({ id: existingTemplate.id, ...payload });
            onClose();
            } else {
            if (data.error?.includes("foss_norms_template_name_key")) {
                alert("Шаблон с таким именем уже существует");
            } else {
                alert(`Ошибка обновления: ${data.error}`);
            }
            }
        }
        } catch (error) {
        alert(`Ошибка отправки: ${error}`);
        }
    };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {mode === "edit"
          ? `Редактировать шаблон FOSS "${existingTemplate?.name}"`
          : "Добавить шаблон FOSS"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Название шаблона"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
          />
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

export default FossTemplateModal;
