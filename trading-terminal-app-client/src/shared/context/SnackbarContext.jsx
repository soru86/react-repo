import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import Snackbar from '../../components/Snackbar';
import { SNACKBAR_DEFAULT_DURATION } from '../../data/constants';
import { useMemo } from 'react';

const SnackbarContext = createContext({
    showSnackbar: () => { }
});

export const SnackbarProvider = ({ children }) => {
    const [queue, setQueue] = useState([]);

    const removeSnackbar = useCallback((id) => {
        setQueue((q) => q.filter((sn) => sn.id !== id));
    }, [setQueue]);

    const showSnackbar = useCallback((opts) => {
        const id = Date.now().toString();
        setQueue((q) => [...q, { ...opts, id }]);
    }, [setQueue]);

    useEffect(() => {
        // auto-dismiss
        const timerId = setTimeout(() => setQueue(() => queue.slice(1)), SNACKBAR_DEFAULT_DURATION);
        return () => {
            clearTimeout(timerId);
        }
    });

    const value = useMemo(() => ({ showSnackbar }), [showSnackbar]);

    return (
        <SnackbarContext.Provider value={value}>
            {children}
            <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
                {queue.map((sn) => (
                    <Snackbar key={sn.id} {...sn} onClose={() => removeSnackbar(sn.id)} />
                ))}
            </div>
        </SnackbarContext.Provider>
    );
};

export const useSnackbar = () => {
    const ctx = useContext(SnackbarContext);
    if (!ctx) throw new Error('useSnackbar must be used inside SnackbarProvider');
    return ctx;
};
