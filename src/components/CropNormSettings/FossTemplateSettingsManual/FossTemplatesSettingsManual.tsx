import React, { useState } from "react";
import styles from "./FossTemplatesSettingsManual.module.css";
import type { FossTemplate } from "../../../types/form";
import FossTemplateCard from "../FossTemplateCard/FossTemplateCard";
import FossTemplateModal from "../FossTemplateModal/FossTemplateModal";
import { Button } from "@mui/material";

interface FossTemplatesSettingsManualProps {
  fossTemplatesData: FossTemplate[];
  onAddFossTemplate: (newItem: FossTemplate) => void;
  onUpdateFossTemplate?: (updatedItem: FossTemplate) => void;
  onDeleteFossTemplate?: (deletedId: number) => void;
}

const FossTemplatesSettingsManual: React.FC<FossTemplatesSettingsManualProps> = ({
  fossTemplatesData,
  onAddFossTemplate,
  onUpdateFossTemplate,
  onDeleteFossTemplate,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedTemplate, setSelectedTemplate] = useState<FossTemplate | null>(null);

  const handleOpenCreate = () => {
    setSelectedTemplate(null);
    setModalMode("create");
    setModalOpen(true);
  };

  const handleOpenEdit = (template: FossTemplate) => {
    setSelectedTemplate(template);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  return (
      <>
      <div className={styles.header}>
        <Button variant="outlined"
           sx={{
              color: '#4caf50',           
              borderColor: '#358126ff',
              borderWidth: 1.5,
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: 'rgba(48, 110, 50, 0.08)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                borderColor: '#388e3c',
              },
              '&:active': {
                boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                bgcolor: 'rgba(76, 175, 80, 0.12)',
              },
            }}
         onClick={handleOpenCreate}>
          Добавить шаблон
        </Button>
      </div>

      <div className={styles.container}>

        {fossTemplatesData.length > 0 ? (
          fossTemplatesData.map((template) => (
            <FossTemplateCard
              key={template.id ?? template.name}
              template={template}
              onDeleteFossTemplate={onDeleteFossTemplate}
              onEditTemplate={handleOpenEdit}
            />
          ))
        ) : (
          <p className={styles.empty}>Нет доступных шаблонов</p>
        )}

        <FossTemplateModal
          open={modalOpen}
          onClose={handleClose}
          mode={modalMode}
          existingTemplate={selectedTemplate}
          onAddFossTemplate={onAddFossTemplate}
          onUpdateFossTemplate={onUpdateFossTemplate}
        />
      </div>
    </>
  );
};

export default FossTemplatesSettingsManual;
