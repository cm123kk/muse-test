import { useState, useCallback } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

/**
 * useSnackbar custom hook
 *
 * A reusable hook that manages snackbar notification state.
 * Easily display various notifications such as success, error, and info.
 *
 * How it works:
 * 1. Show the snackbar when notify() is called
 * 2. Automatically closes after 3 seconds
 * 3. Render SnackbarComponent to display it in the UI
 *
 * Example usage:
 * const { notify, SnackbarComponent } = useSnackbar();
 *
 * // Show a notification
 * notify('Upload complete!', 'success');
 * notify('An error occurred', 'error');
 *
 * // Render
 * return (
 *   <>
 *     <Content />
 *     <SnackbarComponent />
 *   </>
 * );
 *
 * @param {object} options - options
 * @param {number} options.autoHideDuration - auto-close time (ms) [default: 3000]
 * @param {object} options.anchorOrigin - position [default: { vertical: 'bottom', horizontal: 'center' }]
 * @returns {object} { notify, close, SnackbarComponent }
 */
export function useSnackbar(options = {}) {
  const {
    autoHideDuration = 3000,
    anchorOrigin = { vertical: 'bottom', horizontal: 'center' },
  } = options;

  const [state, setState] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  /**
   * Show a snackbar notification
   * @param {string} message - the message to display
   * @param {string} severity - notification type ('success' | 'error' | 'warning' | 'info')
   */
  const notify = useCallback((message, severity = 'success') => {
    setState({
      open: true,
      message,
      severity,
    });
  }, []);

  /**
   * Close the snackbar
   */
  const close = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  /**
   * Snackbar component
   * Rendered at the bottom of the page
   */
  const SnackbarComponent = useCallback(
    () => (
      <Snackbar
        open={state.open}
        autoHideDuration={autoHideDuration}
        onClose={close}
        anchorOrigin={anchorOrigin}
      >
        <Alert
          severity={state.severity}
          variant="filled"
          onClose={close}
        >
          {state.message}
        </Alert>
      </Snackbar>
    ),
    [state.open, state.message, state.severity, autoHideDuration, anchorOrigin, close]
  );

  return {
    notify,
    close,
    SnackbarComponent,
    isOpen: state.open,
  };
}

export default useSnackbar;
