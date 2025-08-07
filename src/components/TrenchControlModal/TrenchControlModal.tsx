import React, { useState, useEffect } from 'react';
import type { TrenchControl, Harvest } from '../../types/form';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import {type SelectChangeEvent } from '@mui/material/Select';


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
  harvestOptions: { id: number; harvesting: number | string }[];
  onAddHarvest: (newHarvest: Harvest) => void;
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
  harvestOptions,
  onAddHarvest,
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
    harvest_id: '',
  });

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData) {
        setFormData({
          date: initialData.date
            ? new Date(initialData.date).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
          crop: initialData.crop ?? '',
          weather: initialData.weather ?? '',
          temp_trench: initialData.temp_trench?.toString() ?? '',
          left_edge_temp: initialData.left_edge_temp?.toString() ?? '',
          middle_temp: initialData.middle_temp?.toString() ?? '',
          right_edge_temp: initialData.right_edge_temp?.toString() ?? '',
          weight: initialData.weight?.toString() ?? '',
          harvest_id: initialData.harvest_id?.toString() ?? '',
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
          harvest_id: '',
        });
      }
    }
  }, [open, mode, initialData]);

  useEffect(() => {
  if (open && mode === 'create' && harvestOptions.length > 0) {
    const maxHarvest = harvestOptions.reduce((max, current) => {
      const currentValue = Number(current.harvesting);
      const maxValue = Number(max.harvesting);
      return currentValue > maxValue ? current : max;
    }, harvestOptions[0]);

    setFormData({
      date: new Date().toISOString().split('T')[0],
      crop: '',
      weather: '',
      temp_trench: '',
      left_edge_temp: '',
      middle_temp: '',
      right_edge_temp: '',
      weight: '',
      harvest_id: maxHarvest.id.toString(),
    });
  }
}, [open, mode, harvestOptions]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name!]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value,
  }));
};

const newHarvestingValue = harvestOptions.length > 0
  ? Math.max(...harvestOptions.map(h => Number(h.harvesting))) + 1
  : 1;

  const handleSubmit = async () => {
  if (!formData.date) {
    alert('Поле "Дата" обязательно');
    return;
  }

  try {
    let harvestId = formData.harvest_id ? parseInt(formData.harvest_id) : null;

    // Если создаём и нет выбранного укоса — создаём новый укос
    if (!harvestId || harvestId === 0) {
      const newHarvestingValue = harvestOptions.length > 0
        ? Math.max(...harvestOptions.map(h => Number(h.harvesting))) + 1
        : 1;

      const harvestPayload = {
        harvesting: newHarvestingValue,
        season: selectedSeason,
        trench_id: selectedTrenchId,
      };

      const harvestResponse = await fetch('/api/v1/trench/harvest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(harvestPayload),
      });

      const harvestData = await harvestResponse.json();
      if (!harvestResponse.ok) {
        alert(`Ошибка создания укоса: ${harvestData.error}`);
        return;
      }

      onAddHarvest({
        id: harvestData.id,
        harvesting: newHarvestingValue,
        season: selectedSeason,
        trench_id: selectedTrenchId,
      });

      harvestId = harvestData.id; // получили id нового укоса
    }

    // Собираем payload для записи trench_control
    const payload = {
      date: formData.date,
      crop: formData.crop || null,
      weather: formData.weather || null,
      temp_trench: formData.temp_trench ? parseFloat(formData.temp_trench) : null,
      left_edge_temp: formData.left_edge_temp ? parseFloat(formData.left_edge_temp) : null,
      middle_temp: formData.middle_temp ? parseFloat(formData.middle_temp) : null,
      right_edge_temp: formData.right_edge_temp ? parseFloat(formData.right_edge_temp) : null,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      harvest_id: harvestId,
    };

    // Создаём или редактируем trench_control
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
          <FormControl fullWidth>
            <InputLabel id="harvest-select-label">Укос</InputLabel>
            <Select
              labelId="harvest-select-label"
              name="harvest_id"
              value={formData.harvest_id}
              label="Укос"
              onChange={handleSelectChange}
            >
              {harvestOptions.map(h => (
                <MenuItem key={h.id} value={h.id.toString()}>
                  {`Укос ${h.harvesting}`}
                </MenuItem>
              ))}
              {/* {[...harvestOptions]
                .sort((a, b) => Number(a.harvesting) - Number(b.harvesting))
                .map((h, index) => (
                  <MenuItem key={h.id} value={h.id.toString()}>
                    {`Укос ${index + 1}`}
                  </MenuItem>
              ))} */}


              <MenuItem value="new">{`Укос ${newHarvestingValue}`}</MenuItem>
               {/* <MenuItem value="new">{`Новый укос`}</MenuItem> */}
            </Select>
          </FormControl>

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
