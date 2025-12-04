// Reusable Input component
import { forwardRef } from 'react';

const Input = forwardRef(({
    label,
    error,
    icon: Icon,
    className = '',
    containerClassName = '',
    ...props
}, ref) => {
    return (
        <div className={`space-y-1 ${containerClassName}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Icon className="w-5 h-5" />
                    </div>
                )}
                <input
                    ref={ref}
                    className={`input-field ${Icon ? 'pl-10' : ''} ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
