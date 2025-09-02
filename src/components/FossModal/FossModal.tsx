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
import type { FossData } from '../../types/form';

interface FossModalProps {
  open: boolean;
  onClose: () => void;
  selectedTrenchControlId: number | null;
  onAddFossData: (newItem: FossData) => void;
  mode: 'create' | 'edit';
  existingFossData?: FossData | null;
  onUpdateFossData?: (updatedItem: FossData) => void;
}

function getLocalDateTime(date?: Date) {
  const now = date ? new Date(date) : new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const FossModal: React.FC<FossModalProps> = ({
  open,
  onClose,
  selectedTrenchControlId,
  onAddFossData,
  mode,
  existingFossData = null,
  onUpdateFossData,
}) => {
  const [formData, setFormData] = useState({
    date_time: getLocalDateTime(),
    dry_matter: '',
    protein: '',
    starch: '',
    raw_fat: '',
    adf: '',
    ndf: '',
    ash: '',
    field: '',
    mw: '',
  });

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && existingFossData) {
        setFormData({
          date_time: getLocalDateTime(new Date(existingFossData.date_time)),
          dry_matter: existingFossData.dry_matter?.toString() ?? '',
          protein: existingFossData.protein?.toString() ?? '',
          starch: existingFossData.starch?.toString() ?? '',
          raw_fat: existingFossData.raw_fat?.toString() ?? '',
          adf: existingFossData.adf?.toString() ?? '',
          ndf: existingFossData.ndf?.toString() ?? '',
          ash: existingFossData.ash?.toString() ?? '',
          field: existingFossData.field ?? '',
          mw: existingFossData.mw?.toString() ?? '',
        });
      } else {
        setFormData({
          date_time: getLocalDateTime(),
          dry_matter: '',
          protein: '',
          starch: '',
          raw_fat: '',
          adf: '',
          ndf: '',
          ash: '',
          field: '',
          mw: '',
        });
      }
    }
  }, [open, mode, existingFossData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedTrenchControlId) {
      alert('Ошибка: не указан ID записи заготовки.');
      return;
    }

    const payload = {
      trench_control_id: selectedTrenchControlId,
      date_time: new Date(formData.date_time).toISOString(),
      dry_matter: formData.dry_matter ? parseFloat(formData.dry_matter) : null,
      protein: formData.protein ? parseFloat(formData.protein) : null,
      starch: formData.starch ? parseFloat(formData.starch) : null,
      raw_fat: formData.raw_fat ? parseFloat(formData.raw_fat) : null,
      adf: formData.adf ? parseFloat(formData.adf) : null,
      ndf: formData.ndf ? parseFloat(formData.ndf) : null,
      ash: formData.ash ? parseFloat(formData.ash) : null,
      field: formData.field || null,
      mw: formData.mw ? parseFloat(formData.mw) : null,
    };

    try {
      let response, data;
      if (mode === 'create') {
        response = await fetch('/api/v1/trench/foss_data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        data = await response.json();

        if (response.ok) {
          alert('FOSS-запись успешно добавлена');
          onAddFossData({ id: data.id, ...payload, date_time: new Date(payload.date_time) });
          onClose();
        } else {
          alert(`Ошибка: ${data.error}`);
        }
      } else if (mode === 'edit' && existingFossData) {
        response = await fetch(`/api/v1/trench/foss_data/${existingFossData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        data = await response.json();

        if (response.ok) {
          alert('FOSS-запись успешно обновлена');
          onUpdateFossData?.({ id: existingFossData.id, ...payload, date_time: new Date(payload.date_time) });
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
      <DialogTitle>{mode === 'edit' ? 'Редактировать FOSS-запись' : 'Добавить FOSS-запись'}</DialogTitle>
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
            fullWidth
            label="Дата и время"
            name="date_time"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            value={formData.date_time}
            onChange={handleChange}
            required
            InputProps={{ readOnly: true }}
          />
          <TextField label="Сухое вещество (%)" name="dry_matter" type="number" value={formData.dry_matter} onChange={handleChange} fullWidth />
          <TextField label="СВЧ" name="mw" type="number" value={formData.mw} onChange={handleChange} fullWidth />
          <TextField label="Белок (%)" name="protein" type="number" value={formData.protein} onChange={handleChange} fullWidth />
          <TextField label="Крахмал (%)" name="starch" type="number" value={formData.starch} onChange={handleChange} fullWidth />
          <TextField label="Сырой жир (%)" name="raw_fat" type="number" value={formData.raw_fat} onChange={handleChange} fullWidth />
          <TextField label="КДК" name="adf" type="number" value={formData.adf} onChange={handleChange} fullWidth />
          <TextField label="НДК" name="ndf" type="number" value={formData.ndf} onChange={handleChange} fullWidth />
          <TextField label="Зола" name="ash" type="number" value={formData.ash} onChange={handleChange} fullWidth />
          <TextField label="Поле" name="field" value={formData.field} onChange={handleChange} fullWidth />
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

export default FossModal;
