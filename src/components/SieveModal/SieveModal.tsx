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
import type { Sieve } from '../../types/form';

interface SieveModalProps {
  open: boolean;
  onClose: () => void;
  selectedTrenchControlId: number | null;
  onAddSieveData: (newItem: Sieve) => void;
  mode: 'create' | 'edit';
  existingSieveData?: Sieve | null;
  onUpdateSieveData?: (updatedItem: Sieve) => void;
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

const SieveModal: React.FC<SieveModalProps> = ({
  open,
  onClose,
  selectedTrenchControlId,
  onAddSieveData,
  mode,
  existingSieveData = null,
  onUpdateSieveData,
}) => {
  const [formData, setFormData] = useState({
    date_time: getLocalDateTime(),
    high: '',
    middle: '',
    low: '',
    pallet: '',
  });

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && existingSieveData) {
        setFormData({
          date_time: getLocalDateTime(new Date(existingSieveData.date_time)),
          high: existingSieveData.high?.toString() ?? '',
          middle: existingSieveData.middle?.toString() ?? '',
          low: existingSieveData.low?.toString() ?? '',
          pallet: existingSieveData.pallet?.toString() ?? '',
        });
      } else {
        setFormData({
          date_time: getLocalDateTime(),
          high: '',
          middle: '',
          low: '',
          pallet: '',
        });
      }
    }
  }, [open, mode, existingSieveData]);

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
      high: formData.high ? parseFloat(formData.high) : null,
      middle: formData.middle ? parseFloat(formData.middle) : null,
      low: formData.low ? parseFloat(formData.low) : null,
      pallet: formData.pallet ? parseFloat(formData.pallet) : null,
    };

    try {
      let response, data;
      if (mode === 'create') {
        response = await fetch('/api/v1/trench/sieve/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        data = await response.json();

        if (response.ok) {
          alert('Sieve-запись успешно добавлена');
          onAddSieveData({ id: data.id, ...payload, date_time: new Date(payload.date_time) });
          onClose();
        } else {
          alert(`Ошибка: ${data.error}`);
        }
      } else if (mode === 'edit' && existingSieveData) {
        response = await fetch(`/api/v1/trench/sieve/${existingSieveData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        data = await response.json();

        if (response.ok) {
          alert('Sieve-запись успешно обновлена');
          onUpdateSieveData?.({ id: existingSieveData.id, ...payload, date_time: new Date(payload.date_time) });
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
      <DialogTitle>{mode === 'edit' ? 'Редактировать Sieve-запись' : 'Добавить Sieve-запись'}</DialogTitle>
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
          <TextField label="Верхнее" name="high" type="number" value={formData.high} onChange={handleChange} fullWidth />
          <TextField label="Среднее" name="middle" type="number" value={formData.middle} onChange={handleChange} fullWidth />
          <TextField label="Нижнее" name="low" type="number" value={formData.low} onChange={handleChange} fullWidth />
          <TextField label="Поддон" name="pallet" type="number" value={formData.pallet} onChange={handleChange} fullWidth />
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

export default SieveModal;
