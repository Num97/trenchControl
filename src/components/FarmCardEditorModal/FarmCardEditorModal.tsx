import React, { useState, useEffect } from 'react';
import type { Farms, Trenches } from '../../types/form';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface FarmCardEditorModalProps {
  open: boolean;
  onClose: () => void;
  selectedFarmId: number | null;
  farms: Farms[];
  trenches: Trenches[];
  onUpdateFarm: (updatedFarm: Farms) => void;
  onAddTrench: (newTrench: Trenches) => void;
  onUpdateTrench: (updatedTrench: Trenches) => void;
  onDeleteTrench: (id: number) => void;
}

interface AddTrenchResponse {
  id: number;
  message?: string;
}

const FarmCardEditorModal: React.FC<FarmCardEditorModalProps> = ({
  open,
  onClose,
  selectedFarmId,
  farms,
  trenches,
  onUpdateFarm,
  onAddTrench,
  onUpdateTrench,
  onDeleteTrench,
}) => {
  const [tab, setTab] = useState(0);
  const selectedFarm = farms.find((f) => f.id === selectedFarmId);
  const [farmName, setFarmName] = useState('');
  const [newTrenchName, setNewTrenchName] = useState('');
  const [editingTrenchId, setEditingTrenchId] = useState<number | null>(null);
  const [editingTrenchName, setEditingTrenchName] = useState('');

  useEffect(() => {
    if (selectedFarm) {
      setFarmName(selectedFarm.name);
    }
  }, [selectedFarm]);

  const filteredTrenches = selectedFarmId !== null
    ? trenches.filter((t) => t.farm_id === selectedFarmId)
    : [];

    const handleSaveFarm = async () => {
    if (selectedFarmId === null) return;
    try {
        await axios.put(`/api/v1/trench/farms/${selectedFarmId}`, { name: farmName });
        onUpdateFarm({ id: selectedFarmId, name: farmName });
    } catch (error: any) {
        const message = error?.response?.data?.error;
        if (message?.includes('trenches_farm_uniq')) {
        alert('Такое хозяйство уже существует');
        } else {
        alert('Ошибка при обновлении хозяйства');
        }
        console.error(error);
    }
    };

    const handleAddTrench = async () => {
    if (!newTrenchName.trim() || selectedFarmId === null) return;
    try {
        const response = await axios.post<AddTrenchResponse>('/api/v1/trench/trenches/', {
        name: newTrenchName,
        farm_id: selectedFarmId
        });
        const newId = response.data.id;
        onAddTrench({ id: newId, name: newTrenchName, farm_id: selectedFarmId });
        setNewTrenchName('');
    } catch (error: any) {
        const message = error?.response?.data?.error;
        if (message?.includes('trenches_trenches_uniq')) {
        alert('Такая траншея в хозяйстве уже существует');
        } else {
        alert('Ошибка при добавлении траншеи');
        }
        console.error(error);
    }
    };

    const handleUpdateTrench = async () => {
    if (editingTrenchId === null || !editingTrenchName.trim() || selectedFarmId === null) return;
    try {
        await axios.put(`/api/v1/trench/trenches/${editingTrenchId}`, {
        name: editingTrenchName,
        farm_id: selectedFarmId
        });
        onUpdateTrench({ id: editingTrenchId, name: editingTrenchName, farm_id: selectedFarmId });
        setEditingTrenchId(null);
        setEditingTrenchName('');
    } catch (error: any) {
        const message = error?.response?.data?.error;
        if (message?.includes('trenches_trenches_uniq')) {
        alert('Такая траншея в хозяйстве уже существует');
        } else {
        alert('Ошибка при обновлении траншеи');
        }
        console.error(error);
    }
    };

  const handleDeleteTrench = async (id: number) => {
    if (!window.confirm('Удалить траншею?')) return;
    try {
      await axios.delete(`/api/v1/trench/trenches/${id}`);
      onDeleteTrench(id);
      alert('Траншея удалена');
    } catch (error) {
      alert('Ошибка при удалении траншеи');
      console.error(error);
    }
  };

  if (!selectedFarmId || !selectedFarm) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Редактирование хозяйства</DialogTitle>
      <DialogContent>
        <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)}>
          <Tab label="Хозяйство" />
          <Tab label="Траншеи" />
        </Tabs>

        {tab === 0 && (
          <TextField
            fullWidth
            label="Название хозяйства"
            value={farmName}
            onChange={(e) => setFarmName(e.target.value)}
            margin="normal"
          />
        )}

        {tab === 1 && (
          <>
            <TextField
              fullWidth
              label="Название новой траншеи"
              value={newTrenchName}
              onChange={(e) => setNewTrenchName(e.target.value)}
              margin="normal"
            />
            <Button variant="contained" sx={{ mb: 2 }} onClick={handleAddTrench}>
              Добавить траншею
            </Button>

            <List>
              {filteredTrenches.map((trench) => (
                <ListItem key={trench.id}>
                  {editingTrenchId === trench.id ? (
                    <TextField
                      fullWidth
                      value={editingTrenchName}
                      onChange={(e) => setEditingTrenchName(e.target.value)}
                    />
                  ) : (
                    <ListItemText primary={trench.name} />
                  )}
                  <ListItemSecondaryAction>
                    {editingTrenchId === trench.id ? (
                      <Button onClick={handleUpdateTrench}>Сохранить</Button>
                    ) : (
                      <IconButton onClick={() => {
                        setEditingTrenchId(trench.id);
                        setEditingTrenchName(trench.name);
                      }}>
                        <EditIcon />
                      </IconButton>
                    )}
                    <IconButton onClick={() => handleDeleteTrench(trench.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </>
        )}
      </DialogContent>
      <DialogActions>
        {tab === 0 && <Button onClick={handleSaveFarm}>Сохранить хозяйство</Button>}
        <Button onClick={onClose}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FarmCardEditorModal;
