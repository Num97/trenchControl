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

import type { Harvest } from '../../types/form';

interface HarvestModalProps {
  open: boolean;
  onClose: () => void;
  trenchId: number;
  harvests: Harvest[];
  onAddHarvest: (newHarvest: Harvest) => void;
  onDeleteHarvest: (id: number) => void;
  onUpdateHarvest: (updatedHarvest: Harvest) => void;
}

const HarvestModal: React.FC<HarvestModalProps> = ({
  open,
  onClose,
  trenchId,
  harvests,
  onAddHarvest,
  onDeleteHarvest,
  onUpdateHarvest,
}) => {
  const [newHarvestNumber, setNewHarvestNumber] = useState('');

  const filteredHarvests = harvests.filter((h) => h.trench_id === trenchId);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedHarvesting, setEditedHarvesting] = useState('');


    const handleAddHarvest = async () => {
    const number = parseInt(newHarvestNumber);
    if (isNaN(number)) return;

    const newHarvest: Partial<Harvest> = {
        harvesting: number,
        trench_id: trenchId,
        season: 2025,
    };

    try {
        const response = await fetch('/api/v1/trench/harvest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHarvest),
        });

        if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Ошибка при добавлении укоса';
        throw new Error(errorMessage);
        }

        const result = await response.json();

        const addedHarvest: Harvest = {
        ...newHarvest,
        id: result.id,
        season: newHarvest.season!,
        } as Harvest;

        onAddHarvest(addedHarvest);
        setNewHarvestNumber('');
    } catch (error: any) {
        if (error.message.includes('trenches_harvest_uniq')) {
        alert('Укос с таким номером уже существует в этой траншее и сезоне.');
        } else {
        alert('Ошибка при добавлении укоса: ' + error.message);
        }
        console.error('Ошибка при добавлении укоса:', error);
    }
    };

//   const handleEditHarvest = (harvest: Harvest) => {
//     console.log(`Редактировать укос id=${harvest.id}, harvesting=${harvest.harvesting}`);
//   };

    const handleEditHarvest = (harvest: Harvest) => {
        setEditingId(harvest.id);
        setEditedHarvesting(String(harvest.harvesting));
        };

    const handleSaveEdit = async (harvest: Harvest) => {
        const number = parseInt(editedHarvesting);
        if (isNaN(number)) return;

        const updated: Partial<Harvest> = {
            ...harvest,
            harvesting: number,
            season: harvest.season,
            trench_id: harvest.trench_id,
        };

        try {
            const response = await fetch(`/api/v1/trench/harvest/${harvest.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated),
            });

            if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Ошибка при обновлении укоса');
            }

            onUpdateHarvest({ ...harvest, harvesting: number }); // обновляем родителя
            setEditingId(null);
            setEditedHarvesting('');
        } catch (error: any) {
            if (error.message.includes('trenches_harvest_uniq')) {
            alert('Укос с таким номером уже существует.');
            } else {
            alert('Ошибка при обновлении укоса: ' + error.message);
            }
            console.error('Ошибка при обновлении укоса:', error);
        }
        };



    const handleDeleteHarvest = async (harvest: Harvest) => {
    if (!window.confirm(`Удалить укос №${harvest.harvesting}?`)) return;

    try {
        const response = await fetch(`/api/v1/trench/harvest/${harvest.id}`, {
        method: 'DELETE',
        });

        if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Ошибка при удалении укоса';
        throw new Error(errorMessage);
        }

        onDeleteHarvest(harvest.id);
    } catch (error: any) {
        alert(`Ошибка при удалении укоса: ${error.message}`);
        console.error('Ошибка при удалении укоса:', error);
    }
    };

    const sortedHarvests = filteredHarvests.slice().sort((a, b) => a.harvesting - b.harvesting);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Укосы траншеи</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Номер нового укоса"
          value={newHarvestNumber}
          onChange={(e) => setNewHarvestNumber(e.target.value)}
          margin="normal"
          type="number"
        />
        <Button variant="contained" sx={{ mb: 2 }} onClick={handleAddHarvest}>
          Добавить укос
        </Button>

        <List>
          {sortedHarvests.map((harvest) => (
            <ListItem key={harvest.id}>
              {/* <ListItemText primary={`Укос №${harvest.harvesting}`} /> */}
              {editingId === harvest.id ? (
                    <>
                        <TextField
                        type="number"
                        size="small"
                        value={editedHarvesting}
                        onChange={(e) => setEditedHarvesting(e.target.value)}
                        sx={{ width: 100, mr: 1 }}
                        />
                        <Button onClick={() => handleSaveEdit(harvest)} size="small">
                        Сохранить
                        </Button>
                        <Button onClick={() => setEditingId(null)} size="small">
                        Отмена
                        </Button>
                    </>
                    ) : (
                    <ListItemText primary={`Укос №${harvest.harvesting}`} />
                    )}
                {/* конец */}
              <ListItemSecondaryAction>
                <IconButton onClick={() => handleEditHarvest(harvest)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteHarvest(harvest)}>
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

export default HarvestModal;
