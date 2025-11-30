import { forwardRef } from 'react';

const TextInput = forwardRef(({ label, error, ...props }, ref) => {
  return (
    <div className={error ? 'mb-8' : 'mb-6'}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input 
          ref={ref}
          {...props} 
          className={`
            w-full px-4 py-3 border rounded-lg transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${error 
              ? 'border-red-300 bg-red-50 focus:ring-red-500' 
              : 'border-gray-300 hover:border-gray-400 focus:ring-blue-500'
            }
            placeholder-gray-400 text-gray-900
          `}
          placeholder={props.placeholder || `Enter your ${label.toLowerCase()}`}
        />
        {error && (
          <div className="absolute -bottom-6 left-0 flex items-center text-red-500 text-xs mt-1">
            <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
});

TextInput.displayName = 'TextInput';

export default TextInput;
