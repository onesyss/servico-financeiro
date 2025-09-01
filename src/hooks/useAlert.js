import { useState, useCallback } from 'react';

const useAlert = () => {
  const [alert, setAlert] = useState({
    show: false,
    type: 'info',
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null,
    showCheckbox: false,
    checkboxLabel: '',
    checkboxChecked: false,
    onCheckboxChange: null
  });

  const showAlert = useCallback((config) => {
    setAlert({
      show: true,
      type: config.type || 'info',
      title: config.title || '',
      message: config.message || '',
      onConfirm: config.onConfirm || null,
      onCancel: config.onCancel || null,
      showCheckbox: config.showCheckbox || false,
      checkboxLabel: config.checkboxLabel || '',
      checkboxChecked: config.checkboxChecked || false,
      onCheckboxChange: config.onCheckboxChange || null
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlert(prev => ({ ...prev, show: false }));
  }, []);

  const showConfirmDialog = useCallback((config) => {
    showAlert({
      type: 'warning',
      title: config.title || 'Confirmar ação',
      message: config.message || 'Tem certeza que deseja realizar esta ação?',
      onConfirm: () => {
        if (config.onConfirm) {
          config.onConfirm();
        }
        hideAlert();
      },
      onCancel: () => {
        if (config.onCancel) {
          config.onCancel();
        }
        hideAlert();
      }
    });
  }, [showAlert, hideAlert]);

  const showDeleteConfirm = useCallback((itemName, onDelete) => {
    showConfirmDialog({
      title: 'Confirmar exclusão',
      message: `Tem certeza que deseja excluir "${itemName}"? Esta ação não pode ser desfeita.`,
      onConfirm: onDelete
    });
  }, [showConfirmDialog]);

  const showEditConfirm = useCallback((itemName, onEdit) => {
    showConfirmDialog({
      title: 'Confirmar edição',
      message: `Tem certeza que deseja editar "${itemName}"?`,
      onConfirm: onEdit
    });
  }, [showConfirmDialog]);

  const showSuccess = useCallback((message, title = 'Sucesso') => {
    showAlert({
      type: 'success',
      title,
      message,
      onConfirm: hideAlert
    });
  }, [showAlert, hideAlert]);

  const showError = useCallback((message, title = 'Erro') => {
    showAlert({
      type: 'error',
      title,
      message,
      onConfirm: hideAlert
    });
  }, [showAlert, hideAlert]);

  const showInfo = useCallback((message, title = 'Informação') => {
    showAlert({
      type: 'info',
      title,
      message,
      onConfirm: hideAlert
    });
  }, [showAlert, hideAlert]);

  const showWarning = useCallback((message, title = 'Atenção') => {
    showAlert({
      type: 'warning',
      title,
      message,
      onConfirm: hideAlert
    });
  }, [showAlert, hideAlert]);

  const showLogoutConfirm = useCallback((onLogout) => {
    showAlert({
      type: 'warning',
      title: 'Confirmar saída',
      message: 'Tem certeza que deseja sair do sistema?',
      onConfirm: () => {
        onLogout();
        hideAlert();
      },
      onCancel: hideAlert
    });
  }, [showAlert, hideAlert]);

  return {
    alert,
    showAlert,
    hideAlert,
    showConfirmDialog,
    showDeleteConfirm,
    showEditConfirm,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showLogoutConfirm
  };
};

export default useAlert;
