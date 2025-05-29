import React from 'react';

interface CollectEmployeePopupProps {
  url: string;
  onClose: () => void;
}

const CollectEmployeePopup: React.FC<CollectEmployeePopupProps> = ({ url, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-30" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-sm z-10">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold mb-2">Public Employee Collection Link</h2>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={url}
            readOnly
            className="flex-1 border rounded px-2 py-1 text-sm bg-gray-100"
          />
          <button
            onClick={handleCopy}
            className={`bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center justify-center min-w-[48px]`}
            disabled={copied}
          >
            {copied ? (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            ) : (
              'Copy'
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500">Share this link to collect employee details.</p>
      </div>
    </div>
  );
};

export default CollectEmployeePopup;
