import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';

interface FarmSettingsModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (id: number, name: string) => void;
}

const FarmSettingsModal: React.FC<FarmSettingsModalProps> = ({ open, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('Название хозяйства не может быть пустым');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/v1/trench/farms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await response.json();

      if (response.ok) {
        onSuccess?.(data.id, name);
        setName('');
        onClose();
      } else {
        alert(`Ошибка: ${data.error}`);
      }
    } catch (error) {
      alert(`Ошибка сети: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Добавить хозяйство</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          autoFocus
          label="Название хозяйства"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Отмена</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FarmSettingsModal;
