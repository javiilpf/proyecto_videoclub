import { createContext, useContext } from 'react';
import { toast } from 'sonner';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const showSuccessToast = (message) => {
    toast.success(message, {
      style: {
        background: 'yellow',
        color: 'black',
        border: "1px solid black",
      },
      icon: "✅",
    });
  };

  const showErrorToast = (message) => {
    toast.error(message, {
      style: {
        background: 'red',
        color: 'white',
        border: "1px solid black",
      },
      icon: "❌",
    });
  };

  const showFavoriteAddedToast = () => {
    toast.success("Película añadida a favoritos", {
      style: {
        background: 'yellow',
        color: 'black',
        border: "1px solid black",
      },
      icon: "♥️",
    });
  };

  const showFavoriteRemovedToast = () => {
    toast.success("Película añadida a favoritos correctamente", {
      style: {
        background: 'green',
        color: 'white',
        border: "1px solid black",
      },
      icon: "💔",
    });
  };
  const toastLogOut = () => {
    toast.success("Sesión cerrada correctamente", {
      style: {
        background: 'green',
        color: 'white',
        border: "1px solid black",
      },
      icon: "🔑",
    });
  };


  const toastReviewMessage = () => {
    toast.success("Comentario publicado correctamente",{
        style: {
            background: 'green',
            color: 'white',
            border: "1px solid black",
        },
        icon: "💬",
    });
  }

  const showAuthSuccessToast = (message) => {
    toast.success(message, {
      style: {
        background: 'green',
        color: 'white',
        border: "1px solid black",
      },
      icon: "🔑",
    });
  };

  const showAuthErrorToast = (message) => {
    toast.error(message, {
      style: {
        background: 'red',
        color: 'white',
        border: "1px solid black",
      },
      icon: "🚫",
    });
  };

  return (
    <ToastContext.Provider value={{
      showSuccessToast,
      showErrorToast,
      showFavoriteAddedToast,
      showFavoriteRemovedToast,
      toastLogOut,
      toastReviewMessage,
      showAuthSuccessToast,
      showAuthErrorToast
    }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe ser usado dentro de un ToastProvider');
  }
  return context;
}; 