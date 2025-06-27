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

interface FossModalProps {
  open: boolean;
  onClose: () => void;
  selectedTrenchControlId: number | null;
  onAddFossData: (newItem: any) => void;
}

function getLocalDateTime() {
  const now = new Date();
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
}) => {
  const [formData, setFormData] = useState({
    // date_time: new Date().toISOString().slice(0, 16), // "yyyy-MM-ddTHH:mm"
    date_time: getLocalDateTime(),
    dry_matter: '',
    protein: '',
    starch: '',
    raw_fat: '',
    adf: '',
    ndf: '',
    ach: '',
    field: '',
  });

  useEffect(() => {
    if (open) {
      setFormData({
        // date_time: new Date().toISOString().slice(0, 16),
        date_time: getLocalDateTime(),
        dry_matter: '',
        protein: '',
        starch: '',
        raw_fat: '',
        adf: '',
        ndf: '',
        ach: '',
        field: '',
      });
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      ach: formData.ach ? parseFloat(formData.ach) : null,
      field: formData.field || null,
    };

    try {
      const response = await fetch('/api/v1/trench/foss_data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        alert('FOSS-запись успешно добавлена');
          onAddFossData({
            id: data.id,
            ...payload,
            trench_control_id: selectedTrenchControlId,
            date_time: new Date(payload.date_time),
        });
        onClose();
      } else {
        alert(`Ошибка: ${data.error}`);
      }
    } catch (error) {
      alert(`Ошибка отправки: ${error}`);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Добавить FOSS-запись</DialogTitle>
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
          />
          <TextField label="Сухое вещество (%)" name="dry_matter" type="number" value={formData.dry_matter} onChange={handleChange} fullWidth />
          <TextField label="Белок (%)" name="protein" type="number" value={formData.protein} onChange={handleChange} fullWidth />
          <TextField label="Крахмал (%)" name="starch" type="number" value={formData.starch} onChange={handleChange} fullWidth />
          <TextField label="Сырой жир (%)" name="raw_fat" type="number" value={formData.raw_fat} onChange={handleChange} fullWidth />
          <TextField label="КДК" name="adf" type="number" value={formData.adf} onChange={handleChange} fullWidth />
          <TextField label="НДК" name="ndf" type="number" value={formData.ndf} onChange={handleChange} fullWidth />
          <TextField label="Зола" name="ach" type="number" value={formData.ach} onChange={handleChange} fullWidth />
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
