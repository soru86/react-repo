import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
};

const Snackbar = ({
    message,
    variant = 'info',
    onClose,
}) => {
    return (
        <div
            className={`
        max-w-xs w-full flex items-center gap-2 p-3 rounded shadow
        bg-white dark:bg-gray-800 border
        border-${variant === 'success' ? 'green' : variant === 'error' ? 'red' : variant === 'warning' ? 'yellow' : 'blue'}-300
        text-${variant === 'success' ? 'green' : variant === 'error' ? 'red' : variant === 'warning' ? 'yellow' : 'blue'}-800
        animate-slide-in
      `}
        >
            {icons[variant]}
            <span className="flex-1">{message}</span>
            <button onClick={onClose} aria-label="dismiss">
                <X className="w-4 h-4 text-gray-400 hover:text-white" />
            </button>
        </div>
    );
}

export default Snackbar;
