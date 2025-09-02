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

import type { Crops } from '../../types/form';

interface CropsModalProps {
  open: boolean;
  onClose: () => void;
  crops: Crops[];
  onAddCrop: (newCrop: Crops) => void;
  onDeleteCrop: (id: number) => void;
  onUpdateCrop: (updatedCrop: Crops) => void;
}

const CropsModal: React.FC<CropsModalProps> = ({
  open,
  onClose,
  crops,
  onAddCrop,
  onDeleteCrop,
  onUpdateCrop,
}) => {
  const [newCropName, setNewCropName] = useState('');
  const [newCropActive, setNewCropActive] = useState(true);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedName, setEditedName] = useState('');
  const [editedActive, setEditedActive] = useState(true);

  // Показываем только активные записи
  const filteredCrops = crops.filter((c) => c.active);

  const normalizeCropName = (name: string): string => {
    const trimmed = name.trim();
    if (!trimmed) return "";
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
  };

  const handleAddCrop = async () => {
    if (!newCropName.trim()) return;

    const normalizedName = normalizeCropName(newCropName);

    const duplicate = crops.find(
      (c) =>
        c.active &&
        c.name.trim().toLowerCase() === normalizedName.toLowerCase()
    );
    if (duplicate) {
      alert(`Культура "${normalizedName}" уже существует.`);
      return;
    }

    const newCrop: Partial<Crops> = {
      name: normalizedName,
      active: newCropActive,
      template_foss_id: null,
      template_sieve_id: null,
    };

    try {
      const response = await fetch('/api/v1/trench/crops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCrop),
      });

      if (!response.ok) {
        let errorMessage = 'Ошибка при добавлении культуры';
        try {
          const errorData = await response.json();
          if (errorData.error?.includes('uniq')) {
            errorMessage = `Культура "${normalizedName}" уже существует.`;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch {}
        throw new Error(errorMessage);
      }

      const result = await response.json();

      const addedCrop: Crops = {
        ...newCrop,
        id: result.id,
      } as Crops;

      onAddCrop(addedCrop);
      setNewCropName('');
      setNewCropActive(true);
    } catch (error: any) {
      alert('Ошибка при добавлении культуры: ' + error.message);
      console.error(error);
    }
  };

  const handleEditCrop = (crop: Crops) => {
    setEditingId(crop.id!);
    setEditedName(crop.name);
    setEditedActive(crop.active);
  };

  const handleSaveEdit = async (crop: Crops) => {
    if (!editedName.trim()) return;

    const normalizedName = normalizeCropName(editedName);

    const updated: Partial<Crops> = {
      ...crop,
      name: normalizedName,
      active: editedActive,
      template_foss_id: crop.template_foss_id, // оставляем как есть
      template_sieve_id: crop.template_sieve_id, // оставляем как есть
    };

    try {
      const response = await fetch(`/api/v1/trench/crops/${crop.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ошибка при обновлении культуры");
      }

      onUpdateCrop({ ...crop, name: normalizedName, active: editedActive });
      setEditingId(null);
      setEditedName("");
      setEditedActive(true);
    } catch (error: any) {
      if (error.message.includes("crops_name_key")) {
        alert("Такая культура уже существует!");
      } else {
        alert("Ошибка при обновлении культуры: " + error.message);
      }
      console.error(error);
    }
  };

  const handleDeleteCrop = async (crop: Crops) => {
    if (!window.confirm(`Удалить культуру "${crop.name}"?`)) return;

    try {
      const response = await fetch(`/api/v1/trench/crops/${crop.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при удалении культуры');
      }

      onDeleteCrop(crop.id!);
    } catch (error: any) {
      alert(`Ошибка при удалении культуры: ${error.message}`);
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Культуры</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Название новой культуры"
          value={newCropName}
          onChange={(e) => setNewCropName(e.target.value)}
          margin="normal"
        />
        <Button variant="contained" sx={{ mb: 2 }} onClick={handleAddCrop}>
          Добавить
        </Button>

        <List>
          {filteredCrops.map((crop) => (
            <ListItem key={crop.id}>
              {editingId === crop.id ? (
                <>
                  <TextField
                    size="small"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    sx={{ width: 200, mr: 1 }}
                  />
                  <Button onClick={() => handleSaveEdit(crop)} size="small">
                    Сохранить
                  </Button>
                  <Button onClick={() => setEditingId(null)} size="small">
                    Отмена
                  </Button>
                </>
              ) : (
                <ListItemText primary={crop.name} />
              )}
              <ListItemSecondaryAction>
                <IconButton onClick={() => handleEditCrop(crop)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteCrop(crop)}>
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

export default CropsModal;
