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
import type { SieveNorms } from '../../../types/form';

interface SieveNormsModalProps {
  open: boolean;
  onClose: () => void;
  cropId: number | null;
  onAddSieveNorms: (newSieveNorms: SieveNorms) => void;
  mode: 'create' | 'edit';
  existingSieveNorms?: SieveNorms | null;
  onUpdateSieveNorms?: (updatedSieveNorms: SieveNorms) => void;
  cropName: string;
}

const SieveNormsModal: React.FC<SieveNormsModalProps> = ({
  open,
  onClose,
  cropId,
  onAddSieveNorms,
  mode,
  existingSieveNorms = null,
  onUpdateSieveNorms,
}) => {
  const [formData, setFormData] = useState<SieveNorms>({
    crop_id: cropId || 0,
    high_lower_limit: null,
    high_upper_limit: null,
    middle_lower_limit: null,
    middle_upper_limit: null,
    low_lower_limit: null,
    low_upper_limit: null,
    pallet_lower_limit: null,
    pallet_upper_limit: null,
  });

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && existingSieveNorms) {
        setFormData(existingSieveNorms);
      } else {
        setFormData({
          crop_id: cropId || 0,
          high_lower_limit: null,
          high_upper_limit: null,
          middle_lower_limit: null,
          middle_upper_limit: null,
          low_lower_limit: null,
          low_upper_limit: null,
          pallet_lower_limit: null,
          pallet_upper_limit: null,
        });
      }
    }
  }, [open, mode, existingSieveNorms, cropId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? null : parseFloat(value),
    }));
  };

  const handleSubmit = async () => {
    if (!cropId) {
      alert('Ошибка: не указан ID культуры.');
      return;
    }

    const payload: SieveNorms = {
      ...formData,
      crop_id: cropId,
    };

    try {
      let response, data;
      if (mode === 'create') {
        response = await fetch('/api/v1/trench/sieve_norms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        data = await response.json();
        if (response.ok) {
          alert('Норма сито успешно добавлена');
        onAddSieveNorms({ id: data.id, ...payload });
          onClose();
        } else {
          alert(`Ошибка: ${data.error}`);
        }
      } else if (mode === 'edit' && existingSieveNorms) {
        response = await fetch(`/api/v1/trench/sieve_norms/${existingSieveNorms.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        data = await response.json();
        if (response.ok) {
          alert('Норма сито успешно обновлена');
        onUpdateSieveNorms?.({ id: existingSieveNorms.id, ...payload });
          onClose();
        } else {
          alert(`Ошибка обновления: ${data.error}`);
        }
      }
    } catch (error) {
      alert(`Ошибка отправки: ${error}`);
    }
  };

    const labels = {
        high: "Верхняя фракция",
        middle: "Средняя фракция",
        low: "Мелкая фракция",
        pallet: "Поддон",
    };


  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{mode === 'edit' ? 'Редактировать норму сито' : 'Добавить норму сито'}</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            mt: 1,
          }}
        >
            {(['high', 'middle', 'low', 'pallet'] as const).map(key => (
            <React.Fragment key={key}>
                <TextField
                fullWidth
                label={`${labels[key]} (мин.)`}
                name={`${key}_lower_limit`}
                type="number"
                value={formData[`${key}_lower_limit`] ?? ''}
                onChange={handleChange}
                />
                <TextField
                fullWidth
                label={`${labels[key]} (макс.)`}
                name={`${key}_upper_limit`}
                type="number"
                value={formData[`${key}_upper_limit`] ?? ''}
                onChange={handleChange}
                />
            </React.Fragment>
            ))}
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

export default SieveNormsModal;
