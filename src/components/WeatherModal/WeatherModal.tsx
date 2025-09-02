import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import type { Weather } from '../../types/form';

interface WeatherModalProps {
  open: boolean;
  onClose: () => void;
  weathers: Weather[];
  onAddWeather: (newWeather: Weather) => void;
  onDeleteWeather: (id: number) => void;
  onUpdateWeather: (updatedWeather: Weather) => void;
}

const WeatherModal: React.FC<WeatherModalProps> = ({
  open,
  onClose,
  weathers,
  onAddWeather,
  onDeleteWeather,
  onUpdateWeather,
}) => {
  const [newWeatherName, setNewWeatherName] = useState('');
  const [newWeatherActive, setNewWeatherActive] = useState(true);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedName, setEditedName] = useState('');
  const [editedActive, setEditedActive] = useState(true);

  // Показываем только активные записи
  const filteredWeathers = weathers.filter((w) => w.active);

  const normalizeWeatherName = (name: string): string => {
    const trimmed = name.trim();
    if (!trimmed) return "";
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
  };

  const handleAddWeather = async () => {
    if (!newWeatherName.trim()) return;

    const normalizedName = normalizeWeatherName(newWeatherName);

    // Локальная проверка: уже есть активное состояние с таким именем
    const duplicate = weathers.find(
      (w) => 
        w.active &&
        w.name.trim().toLowerCase() === normalizedName.toLowerCase()
    );
    if (duplicate) {
      alert(`Погодное состояни "${normalizedName}" уже существует.`);
      return;
    }

    const newWeather: Partial<Weather> = {
      name: normalizedName,
      active: newWeatherActive,
    };

    try {
      const response = await fetch('/api/v1/trench/weather', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWeather),
      });

      if (!response.ok) {
        let errorMessage = 'Ошибка при добавлении погодного состояния';
        try {
          const errorData = await response.json();
          if (errorData.error?.includes('uniq')) {
            errorMessage = `Погодное состояние "${normalizedName}" уже существует.`;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch {
          // если ответ не JSON
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();

      const addedWeather: Weather = {
        ...newWeather,
        id: result.id,
      } as Weather;

      onAddWeather(addedWeather);
      setNewWeatherName('');
      setNewWeatherActive(true);
    } catch (error: any) {
      alert('Ошибка при добавлении погодного состояния: ' + error.message);
      console.error(error);
    }
  };


  const handleEditWeather = (weather: Weather) => {
    setEditingId(weather.id!);
    setEditedName(weather.name);
    setEditedActive(weather.active);
  };

  const handleSaveEdit = async (weather: Weather) => {
    if (!editedName.trim()) return;

    // нормализуем перед сохранением
    const normalizedName = normalizeWeatherName(editedName);

    const updated: Partial<Weather> = {
      ...weather,
      name: normalizedName,
      active: editedActive,
    };

    try {
      const response = await fetch(`/api/v1/trench/weather/${weather.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ошибка при обновлении погодного состояния");
      }

      onUpdateWeather({ ...weather, name: normalizedName, active: editedActive });
      setEditingId(null);
      setEditedName("");
      setEditedActive(true);
    } catch (error: any) {
      if (error.message.includes("weather_name_key")) {
        alert("Такое название погодного состояния уже существует!");
      } else {
        alert("Ошибка при обновлении погодного состояния: " + error.message);
      }
      console.error(error);
    }
  };

  const handleDeleteWeather = async (weather: Weather) => {
    if (!window.confirm(`Удалить погодное состояние "${weather.name}"?`)) return;

    try {
      const response = await fetch(`/api/v1/trench/weather/${weather.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при удалении погодного состояния');
      }

      onDeleteWeather(weather.id!);
    } catch (error: any) {
      alert(`Ошибка при удалении погодного состояния: ${error.message}`);
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Погодные состояния</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Название нового состояния"
          value={newWeatherName}
          onChange={(e) => setNewWeatherName(e.target.value)}
          margin="normal"
        />
        <Button variant="contained" sx={{ mb: 2 }} onClick={handleAddWeather}>
          Добавить
        </Button>

        <List>
          {filteredWeathers.map((weather) => (
            <ListItem key={weather.id}>
              {editingId === weather.id ? (
                <>
                  <TextField
                    size="small"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    sx={{ width: 200, mr: 1 }}
                  />
                  <Button onClick={() => handleSaveEdit(weather)} size="small">
                    Сохранить
                  </Button>
                  <Button onClick={() => setEditingId(null)} size="small">
                    Отмена
                  </Button>
                </>
              ) : (
                <ListItemText primary={weather.name} />
              )}
              <ListItemSecondaryAction>
                <IconButton onClick={() => handleEditWeather(weather)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteWeather(weather)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
};

export default WeatherModal;
