import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';
import type { LabData } from '../../types/form';

interface LabModalProps {
  open: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  existingData?: LabData | null;
  harvestId?: number; // чтобы при создании передать id укоса
  onSave?: (data: LabData) => void; // колбек при сохранении
}

const LabModal: React.FC<LabModalProps> = ({
  open,
  onClose,
  mode,
  existingData = null,
  harvestId,
  onSave,
}) => {
  const [formData, setFormData] = useState<LabData>({
    id: undefined,
    harvest_id: harvestId,
    dry_matter: '',
    protein: '',
    starch: '',
    raw_fat: '',
    adf: '',
    ndf: '',
    ash: '',
  });

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && existingData) {
        setFormData({
          id: existingData.id,
          harvest_id: existingData.harvest_id,
          dry_matter: existingData.dry_matter ?? '',
          protein: existingData.protein ?? '',
          starch: existingData.starch ?? '',
          raw_fat: existingData.raw_fat ?? '',
          adf: existingData.adf ?? '',
          ndf: existingData.ndf ?? '',
          ash: existingData.ash ?? '',
        });
      } else {
        setFormData({
          id: undefined,
          harvest_id: harvestId,
          dry_matter: '',
          protein: '',
          starch: '',
          raw_fat: '',
          adf: '',
          ndf: '',
          ash: '',
        });
      }
    }
  }, [open, mode, existingData, harvestId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
  if (!harvestId) {
    alert('Не указан harvest_id');
    return;
  }

  const payload = {
    harvest_id: harvestId,
    dry_matter: parseFloat(formData.dry_matter),
    protein: parseFloat(formData.protein),
    starch: parseFloat(formData.starch),
    raw_fat: parseFloat(formData.raw_fat),
    adf: parseFloat(formData.adf),
    ndf: parseFloat(formData.ndf),
    ash: parseFloat(formData.ash),
  };

  try {
    if (mode === 'create') {
      const response = await fetch('/api/v1/trench/lab_data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        const newLabEntry = {
          id: data.id,
          harvestId,
          dry_matter: payload.dry_matter.toString(),
          protein: payload.protein.toString(),
          starch: payload.starch.toString(),
          raw_fat: payload.raw_fat.toString(),
          adf: payload.adf.toString(),
          ndf: payload.ndf.toString(),
          ash: payload.ash.toString(),
        };
        onSave?.(newLabEntry);
        onClose();
      } else {
        alert(`Ошибка: ${data.error}`);
      }
    } else {
      // mode === 'edit'
      if (!formData.id) {
        alert('ID записи для редактирования не указан');
        return;
      }

      const response = await fetch(`/api/v1/trench/lab_data/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        const updatedLabEntry = {
          id: formData.id,
          harvestId,
          dry_matter: payload.dry_matter.toString(),
          protein: payload.protein.toString(),
          starch: payload.starch.toString(),
          raw_fat: payload.raw_fat.toString(),
          adf: payload.adf.toString(),
          ndf: payload.ndf.toString(),
          ash: payload.ash.toString(),
        };
        onSave?.(updatedLabEntry);
        onClose();
      } else {
        alert(`Ошибка при обновлении: ${data.error}`);
      }
    }
  } catch (err) {
    alert(`Ошибка: ${err}`);
  }
};



  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{mode === 'edit' ? 'Редактировать данные лаборатории' : 'Добавить данные лаборатории'}</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            mt: 1,
          }}
        >
          <TextField
            label="Сухое вещество (%)"
            name="dry_matter"
            type="number"
            value={formData.dry_matter}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Протеин (%)"
            name="protein"
            type="number"
            value={formData.protein}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Крахмал (%)"
            name="starch"
            type="number"
            value={formData.starch}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Сырой жир (%)"
            name="raw_fat"
            type="number"
            value={formData.raw_fat}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="КДК"
            name="adf"
            type="number"
            value={formData.adf}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="НДК"
            name="ndf"
            type="number"
            value={formData.ndf}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Зола"
            name="ash"
            type="number"
            value={formData.ash}
            onChange={handleChange}
            fullWidth
          />
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

export default LabModal;
