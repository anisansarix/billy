import { create } from 'zustand';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'cancel' | 'destructive' | 'default';
}

interface AlertState {
  visible: boolean;
  title: string;
  message: string;
  type: AlertType;
  buttons: AlertButton[];
  showAlert: (options: { title: string; message: string; type?: AlertType; buttons?: AlertButton[] }) => void;
  hideAlert: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  visible: false,
  title: '',
  message: '',
  type: 'info',
  buttons: [],
  showAlert: (options) => set({
    visible: true,
    title: options.title,
    message: options.message,
    type: options.type || 'info',
    buttons: options.buttons || [{ text: 'OK' }]
  }),
  hideAlert: () => set({ visible: false })
}));
