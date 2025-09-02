import React, { useState, useEffect } from 'react';
import type { TrenchControl, Harvest, Weather, Crops } from '../../types/form';
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
import { type SelectChangeEvent } from '@mui/material/Select';
import styles from './TrenchControlModal.module.css'

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
  weatherData: Weather[]; // ожидаем массив объектов {id, name, active}
  cropsData: Crops[];     // ожидаем массив объектов {id, name, active, ...}
}

type FormState = {
  date: string;
  crop_id: string;
  weather_id: string;
  // temp_trench: string;
  left_edge_temp: string;
  middle_temp: string;
  right_edge_temp: string;
  weight: string;
  harvest_id: string;
};

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
  weatherData,
  cropsData,
}) => {
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState<FormState>({
    date: today,
    crop_id: '',
    weather_id: '',
    // temp_trench: '',
    left_edge_temp: '',
    middle_temp: '',
    right_edge_temp: '',
    weight: '',
    harvest_id: '',
  });

  const nextHarvestingNumber = harvestOptions.length > 0
    ? Math.max(...harvestOptions.map(h => Number(h.harvesting))) + 1
    : 1;

  useEffect(() => {
    if (!open) return;

    if (mode === 'edit' && initialData) {
      // теперь используем только id-поля
      const cropIdFromInitial = initialData.crop_id != null
        ? String(initialData.crop_id)
        : '';

      const weatherIdFromInitial = initialData.weather_id != null
        ? String(initialData.weather_id)
        : '';

      setFormData({
        date: initialData.date
          ? new Date(initialData.date).toISOString().split('T')[0]
          : today,
        crop_id: cropIdFromInitial,
        weather_id: weatherIdFromInitial,
        // temp_trench: initialData.temp_trench?.toString() ?? '',
        left_edge_temp: initialData.left_edge_temp?.toString() ?? '',
        middle_temp: initialData.middle_temp?.toString() ?? '',
        right_edge_temp: initialData.right_edge_temp?.toString() ?? '',
        weight: initialData.weight?.toString() ?? '',
        harvest_id: initialData.harvest_id?.toString() ?? '',
      });
    } else {
      // create mode defaults
      if (harvestOptions.length > 0) {
        const maxHarvest = harvestOptions.reduce((max, current) => {
          const currentValue = Number(current.harvesting);
          const maxValue = Number(max.harvesting);
          return currentValue > maxValue ? current : max;
        }, harvestOptions[0]);

        setFormData(prev => ({
          ...prev,
          date: today,
          crop_id: '',
          weather_id: '',
          // temp_trench: '',
          left_edge_temp: '',
          middle_temp: '',
          right_edge_temp: '',
          weight: '',
          harvest_id: maxHarvest.id.toString(),
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          date: today,
          crop_id: '',
          weather_id: '',
          // temp_trench: '',
          left_edge_temp: '',
          middle_temp: '',
          right_edge_temp: '',
          weight: '',
          harvest_id: 'new',
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mode, initialData, harvestOptions, cropsData, weatherData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const name = e.target.name as string;
    const value = e.target.value as string;

    // Для crop_id / weather_id просто сохраняем id как строку
    if (name === 'crop_id' || name === 'weather_id' || name === 'harvest_id') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.date) {
      alert('Поле "Дата" обязательно');
      return;
    }

    try {
      let harvestId = formData.harvest_id ? parseInt(formData.harvest_id, 10) : null;
      if (!harvestId || Number.isNaN(harvestId)) {
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
          alert(`Ошибка создания укоса: ${harvestData.error ?? JSON.stringify(harvestData)}`);
          return;
        }

        onAddHarvest({
          id: harvestData.id,
          harvesting: newHarvestingValue,
          season: selectedSeason,
          trench_id: selectedTrenchId,
        });

        harvestId = harvestData.id;
      }

      const payload = {
        date: formData.date,
        // temp_trench: formData.temp_trench ? parseFloat(formData.temp_trench) : null,
        left_edge_temp: formData.left_edge_temp ? parseFloat(formData.left_edge_temp) : null,
        middle_temp: formData.middle_temp ? parseFloat(formData.middle_temp) : null,
        right_edge_temp: formData.right_edge_temp ? parseFloat(formData.right_edge_temp) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        harvest_id: harvestId,
        crop_id: formData.crop_id ? parseInt(formData.crop_id, 10) : null,
        weather_id: formData.weather_id ? parseInt(formData.weather_id, 10) : null,
      };

      if (mode === 'create') {
        const response = await fetch('/api/v1/trench/trench_control', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (response.ok) {
          alert('Запись успешно добавлена');

          const newItem: TrenchControl = {
            id: data.id,
            harvest_id: payload.harvest_id ?? null,
            date: new Date(payload.date),
            // temp_trench: payload.temp_trench ?? null,
            left_edge_temp: payload.left_edge_temp ?? null,
            middle_temp: payload.middle_temp ?? null,
            right_edge_temp: payload.right_edge_temp ?? null,
            weight: payload.weight ?? null,
            crop_id: payload.crop_id ?? null,
            weather_id: payload.weather_id ?? null,
          };

          onAddTrenchControl(newItem);
          onClose();
        } else {
          alert(`Ошибка: ${data.error ?? JSON.stringify(data)}`);
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

          const updatedItem: TrenchControl = {
            id: selectedTrenchControlId,
            harvest_id: payload.harvest_id ?? null,
            date: new Date(payload.date),
            // temp_trench: payload.temp_trench ?? null,
            left_edge_temp: payload.left_edge_temp ?? null,
            middle_temp: payload.middle_temp ?? null,
            right_edge_temp: payload.right_edge_temp ?? null,
            weight: payload.weight ?? null,
            crop_id: payload.crop_id ?? null,
            weather_id: payload.weather_id ?? null,
          };

          onUpdateTrenchControl(updatedItem);
          onClose();
        } else {
          alert(`Ошибка обновления: ${data.error ?? JSON.stringify(data)}`);
        }
      }
    } catch (error) {
      alert(`Ошибка отправки: ${String(error)}`);
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
            inputProps={{
              max: new Date().toISOString().split('T')[0] // устанавливаем сегодня как максимальную дату
            }}
          />

          {/* CULTURE SELECT (только id) */}
          <FormControl fullWidth>
            <InputLabel id="crop-select-label">Культура</InputLabel>
            <Select
              labelId="crop-select-label"
              name="crop_id"
              value={formData.crop_id}
              label="Культура"
              onChange={handleSelectChange}
            >
              <MenuItem value="">
                <em className={styles.nodata}>Не выбрано</em>
              </MenuItem>
              {(cropsData ?? [])
                .filter(c => c.active)
                .map(c => (
                  <MenuItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          {/* WEATHER SELECT (только id) */}
          <FormControl fullWidth>
            <InputLabel id="weather-select-label">Погода</InputLabel>
            <Select
              labelId="weather-select-label"
              name="weather_id"
              value={formData.weather_id}
              label="Погода"
              onChange={handleSelectChange}
            >
              <MenuItem value="">
                <em className={styles.nodata}>Не выбрано</em>
              </MenuItem>
              {(weatherData ?? [])
                .filter(w => w.active)
                .map(w => (
                  <MenuItem key={w.id} value={String(w.id)}>
                    {w.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          {/* HARVEST SELECT */}
          <FormControl fullWidth>
            <InputLabel id="harvest-select-label">Укос</InputLabel>
            <Select
              labelId="harvest-select-label"
              name="harvest_id"
              value={formData.harvest_id}
              label="Укос"
              onChange={handleSelectChange}
            >
              {harvestOptions
                .slice()
                .sort((a, b) => Number(a.harvesting) - Number(b.harvesting))
                .map(h => (
                  <MenuItem key={h.id} value={h.id.toString()}>
                    {`Укос ${h.harvesting}`}
                  </MenuItem>
                ))}
              <MenuItem value="new">{`Укос ${nextHarvestingNumber}`}</MenuItem>
            </Select>
          </FormControl>
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
