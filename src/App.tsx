import { Toaster } from 'react-hot-toast';
import AppRouter from './router/AppRouter';

function App() {
  return (
    <>
      <AppRouter />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#339A8C',
            color: '#fff',
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#fff',
              secondary: '#339A8C',
            },
          },
          error: {
            style: {
              background: '#ff4444',
            },
          },
        }}
      />
    </>
  );
}

export default App;