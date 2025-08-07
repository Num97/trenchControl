import React, { useEffect, useState } from 'react';
import styles from './AverageHarvestingLabDataComparison.module.css';
import LabModal from '../LabModal/LabModal';
import type { LabData } from '../../types/form';

interface HarvestLabData {
  harvestId: number;
  weightedAverages: Record<string, number>;
  totalTrenchWeight: number;
}

interface LabEntry {
  id: number;
  harvest_id: number;
  adf: number;
  ash: number;
  dry_matter: number;
  ndf: number;
  protein: number;
  raw_fat: number;
  starch: number;
}

type LabFieldKey = Exclude<keyof LabEntry, 'id' | 'harvest_id'>;

interface Props {
  data: HarvestLabData;
}

const metricLabels: Record<LabFieldKey, string> = {
  adf: 'КДК',
  ash: 'Зола',
  dry_matter: 'Сухое вещество',
  ndf: 'НДК',
  protein: 'Протеин',
  raw_fat: 'Сырой жир',
  starch: 'Крахмал',
};

const orderedKeys: LabFieldKey[] = [
  'dry_matter',
  'protein',
  'starch',
  'adf',
  'ndf',
  'ash',
  'raw_fat',
];

export const AverageHarvestingLabDataComparison: React.FC<Props> = ({ data }) => {

const [modalOpen, setModalOpen] = useState(false);
const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

const [labDataList, setLabDataList] = useState<LabEntry[]>([]);
const [refreshFlag, setRefreshFlag] = useState(0);

useEffect(() => {
  fetch('/api/v1/trench/lab_data')
    .then(res => res.json())
    .then((allLabData: LabEntry[]) => {
      setLabDataList(allLabData);
    })
    .catch(console.error);
}, [refreshFlag]);

const labData = labDataList.find((entry) => entry.harvest_id === data.harvestId) || null;

const handleSave = (data: LabData) => {
  if (typeof data.id !== 'number') {
    console.warn('Невалидный id у labData:', data);
    return;
  }

  const newItem: LabEntry = {
    id: data.id,
    harvest_id: data.harvest_id ?? 0,
    dry_matter: parseFloat(data.dry_matter),
    protein: parseFloat(data.protein),
    starch: parseFloat(data.starch),
    raw_fat: parseFloat(data.raw_fat),
    adf: parseFloat(data.adf),
    ndf: parseFloat(data.ndf),
    ash: parseFloat(data.ash),
  };

  setLabDataList(prev => [...prev, newItem]);
  setRefreshFlag(prev => prev + 1);
};

const handleDeleteClick = async () => {
  if (!labData?.id) {
    alert('Нет ID для удаления');
    return;
  }

  const confirmDelete = window.confirm('Вы уверены, что хотите удалить данные по лаборатории этого укоса?');

  if (!confirmDelete) return;

  try {
    const response = await fetch(`/api/v1/trench/lab_data/${labData.id}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (response.ok) {
      alert('Запись успешно удалена');
      setRefreshFlag(prev => prev + 1);
    } else {
      alert(`Ошибка при удалении: ${result.error}`);
    }
  } catch (err) {
    alert(`Ошибка сети: ${err}`);
  }
};


  const formatPercent = (percent: number | null) => {
    if (percent === null) return '—';
    return `${percent > 0 ? '+' : ''}${percent.toFixed(1)}%`;
  };

  const openModal = () => {
    setModalMode(labData ? 'edit' : 'create');
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  return (
    <div className={styles.card}>
      <p className={styles.weight}>Общий вес: {data.totalTrenchWeight.toLocaleString()} кг</p>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Показатель</th>
            <th>Средневзвешенное</th>

            <th className={styles.thContent}>
                <img
                    src={
                    labData
                        ? '/static/img/trench/penEditButton.svg'
                        : '/static/img/trench/addButton.svg'
                    }
                    onClick={openModal} style={{ cursor: 'pointer' }}
                    alt={labData ? 'Edit' : 'Add'}
                    className={`${styles.icon} ${labData ? styles.iconEdit : styles.iconAdd}`}
                />

                По лаборатории

                {labData && ( <img
                    src="/static/img/trench/trashButton.svg"
                    alt="Delete"
                    className={styles.iconDelete}
                    onClick={handleDeleteClick}
                />)}
            </th>

            <th>Отклонение (%)</th>
          </tr>
        </thead>
        <tbody>
          {orderedKeys.map((key) => {
            const weighted = data.weightedAverages[key];
            const labValue = labData?.[key] ?? null;

            const deviation =
              labValue && labValue !== 0
                ? ((weighted - labValue) / labValue) * 100
                : null;
            
            const isHighlighted = deviation !== null && Math.abs(deviation) > 10;

            return (
              <tr key={key}>
                <td className={isHighlighted ? styles.highlight : undefined}>{metricLabels[key]}</td>
                <td>{weighted?.toFixed(2) ?? '—'}</td>
                <td>{labValue?.toFixed(2) ?? '—'}</td>
                <td className={isHighlighted ? styles.highlight : undefined}>
                    {formatPercent(deviation)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
        <LabModal
            open={modalOpen}
            onClose={closeModal}
            mode={modalMode}
            existingData={
            modalMode === 'edit' && labData
                  ? {
                      id: labData.id,
                      harvest_id: labData.harvest_id,
                      dry_matter: labData.dry_matter != null ? labData.dry_matter.toString() : '',
                      protein: labData.protein != null ? labData.protein.toString() : '',
                      starch: labData.starch != null ? labData.starch.toString() : '',
                      raw_fat: labData.raw_fat != null ? labData.raw_fat.toString() : '',
                      adf: labData.adf != null ? labData.adf.toString() : '',
                      ndf: labData.ndf != null ? labData.ndf.toString() : '',
                      ash: labData.ash != null ? labData.ash.toString() : '',
                    }
                : null
            }
            harvestId={data.harvestId}
            onSave={handleSave as (data: LabData) => void}
        />
    </div>
  );
};
