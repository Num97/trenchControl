import React, { useState, useEffect } from 'react';
import type { TrenchControl } from '../../types/form';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';

interface Props {
  open: boolean;
  mode: 'create' | 'edit';
  onClose: () => void;
  selectedSeason: number;
  selectedTrenchId: number | null;
  selectedTrenchControlId: number | null;
  initialData?: TrenchControl;
  onAddTrenchControl: (newItem: TrenchControl) => void;
  onUpdateTrenchControl: (updatedItem: TrenchControl) => void;
}

const TrenchControlModal: React.FC<Props> = ({
  open,
  mode,
  onClose,
  selectedSeason,
  selectedTrenchId,
  selectedTrenchControlId,
  initialData,
  onAddTrenchControl,
  onUpdateTrenchControl,
}) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    crop: '',
    weather: '',
    temp_trench: '',
    left_edge_temp: '',
    middle_temp: '',
    right_edge_temp: '',
    weight: '',
  });

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData) {
        setFormData({
          date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          crop: initialData.crop ?? '',
          weather: initialData.weather ?? '',
          temp_trench: initialData.temp_trench?.toString() ?? '',
          left_edge_temp: initialData.left_edge_temp?.toString() ?? '',
          middle_temp: initialData.middle_temp?.toString() ?? '',
          right_edge_temp: initialData.right_edge_temp?.toString() ?? '',
          weight: initialData.weight?.toString() ?? '',
        });
      } else {
        setFormData({
          date: new Date().toISOString().split('T')[0],
          crop: '',
          weather: '',
          temp_trench: '',
          left_edge_temp: '',
          middle_temp: '',
          right_edge_temp: '',
          weight: '',
        });
      }
    }
  }, [open, mode, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.date) {
      alert('Поле "Дата" обязательно');
      return;
    }

    const payload = {
      date: formData.date,
      crop: formData.crop || null,
      weather: formData.weather || null,
      temp_trench: formData.temp_trench ? parseFloat(formData.temp_trench) : null,
      left_edge_temp: formData.left_edge_temp ? parseFloat(formData.left_edge_temp) : null,
      middle_temp: formData.middle_temp ? parseFloat(formData.middle_temp) : null,
      right_edge_temp: formData.right_edge_temp ? parseFloat(formData.right_edge_temp) : null,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      season: selectedSeason,
      trench_id: selectedTrenchId,
    };

    try {
      if (mode === 'create') {
        const response = await fetch('/api/v1/trench/trench_control', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (response.ok) {
          alert('Запись успешно добавлена');
          onAddTrenchControl({
            id: data.id,
            ...payload,
            date: new Date(payload.date),
            trench_id: selectedTrenchId as number,
          });
          onClose();
        } else {
          alert(`Ошибка: ${data.error}`);
        }
      } else if (mode === 'edit' && selectedTrenchControlId !== null) {
        const response = await fetch(`/api/v1/trench/trench_control/${selectedTrenchControlId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (response.ok) {
          alert('Запись успешно обновлена');
          onUpdateTrenchControl({
            id: selectedTrenchControlId,
            ...payload,
            date: new Date(payload.date),
            trench_id: selectedTrenchId as number,
          });
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
        {mode === 'edit' ? 'Редактировать запись заготовки' : 'Добавить запись заготовки'}
      </DialogTitle>
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
            label="Дата"
            name="date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.date}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Культура"
            name="crop"
            value={formData.crop}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Погода"
            name="weather"
            value={formData.weather}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Темп. в траншее"
            name="temp_trench"
            type="number"
            value={formData.temp_trench}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Левый край"
            name="left_edge_temp"
            type="number"
            value={formData.left_edge_temp}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Центр"
            name="middle_temp"
            type="number"
            value={formData.middle_temp}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Правый край"
            name="right_edge_temp"
            type="number"
            value={formData.right_edge_temp}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Вес"
            name="weight"
            type="number"
            value={formData.weight}
            onChange={handleChange}
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

export default TrenchControlModal;
