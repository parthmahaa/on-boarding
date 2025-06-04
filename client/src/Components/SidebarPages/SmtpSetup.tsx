import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import img1 from '../../assets/images/google.webp'
const PROVIDERS = [
  {
    name: 'Google',
    logo: (
      <img src={img1} className='w-full h-full object-contain' alt="Google logo" />
    ),  
    smtp: 'smtp.gmail.com',
    port: '587',
  },
  {
    name: 'AWS Mumbai',
    logo: (
      <img src={img1} className='w-full h-full object-contain' alt="AWS Mumbai logo" />
    ),
    smtp: 'email-smtp.ap-south-1.amazonaws.com',
    port: '587',
  },
  {
    name: 'AWS US-EAST-1',
    logo: (
      <img src={img1} className='w-full h-full object-contain' alt="AWS US-EAST-1 logo" />
    ),
    smtp: 'email-smtp.us-east-1.amazonaws.com',
    port: '587',
  },
  {
    name: 'Outlook',
    logo: (
      <img src={img1} className='w-full h-full object-contain' alt="Outlook logo" />
    ),
    smtp: 'smtp.office365.com',
    port: '587',
  },
  {
    name: 'IONOS',
    logo: (
      <img src={img1} className='w-full h-full object-contain' alt="IONOS logo" />
    ),
    smtp: 'smtp.ionos.com',
    port: '587',
  },
  {
    name: 'Aol.',
    logo: (
      <img src={img1} className='w-full h-full object-contain' alt="AOL logo" />
    ),
    smtp: 'smtp.aol.com',
    port: '587',
  },
  {
    name: 'Zoho',
    logo: (
      <img src={img1} className='w-full h-full object-contain' alt="Zoho logo" />
    ),
    smtp: 'smtp.zoho.com',
    port: '587',
  },
  {
    name: 'G Suite',
    logo: (
      <img src={img1} className='w-full h-full object-contain' alt="G Suite logo" />
    ),
    smtp: 'smtp.gmail.com',
    port: '587',
  },
  {
    name: 'SendGrid',
    logo: (
      <img src={img1} className='w-full h-full object-contain' alt="SendGrid logo" />
    ),
    smtp: 'smtp.sendgrid.net',
    port: '587',
  },
  {
    name: 'Other Provider',
    logo: (
      <span className="text-sm sm:text-base font-semibold text-gray-600">Other Provider</span>
    ),
    smtp: '',
    port: '',
  },
];

export default function EmailProviderForm() {
  // Form states
  const [hrUsername, setHrUsername] = useState('emgagehrms5@gmail.com');
  const [hrPassword, setHrPassword] = useState('');
  const [showHrPassword, setShowHrPassword] = useState(false);
  const [fromEmailHR, setFromEmailHR] = useState('');
  const [fromEmailSameAsHr, setFromEmailSameAsHr] = useState(false);

  const [offerUsername, setOfferUsername] = useState('emgagehrms5@gmail.com');
  const [offerPassword, setOfferPassword] = useState('');
  const [showOfferPassword, setShowOfferPassword] = useState(false);
  const [fromEmailOffer, setFromEmailOffer] = useState('');
  const [fromEmailSameAsOffer, setFromEmailSameAsOffer] = useState(false);

  const [selectedProvider, setSelectedProvider] = useState(PROVIDERS[0].name);
  const [customSmtp, setCustomSmtp] = useState('');
  const [customPort, setCustomPort] = useState('587');

  const [search, setSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [resultMsg, setResultMsg] = useState('');

  // Computed fields for SMTP/Port
  const provider = PROVIDERS.find(p => p.name === selectedProvider);
  const smtpServer = provider?.name === 'Other Provider' ? customSmtp : provider?.smtp;
  const smtpPort = provider?.name === 'Other Provider' ? customPort : provider?.port;

  // Handlers
  const handleProviderSelect = (name: string) => {
    setSelectedProvider(name);
    if (name !== 'Other Provider') {
      setCustomSmtp('');
      setCustomPort('587');
    }
  };

  const handleReset = () => {
    setHrUsername('emgagehrms5@gmail.com');
    setHrPassword('');
    setShowHrPassword(false);
    setFromEmailHR('');
    setFromEmailSameAsHr(false);
    setOfferUsername('emgagehrms5@gmail.com');
    setOfferPassword('');
    setShowOfferPassword(false);
    setFromEmailOffer('');
    setFromEmailSameAsOffer(false);
    setSelectedProvider(PROVIDERS[0].name);
    setCustomSmtp('');
    setCustomPort('587');
    setResultMsg('');
  };

  const handleTestEmail = async () => {
    setIsTesting(true);
    setResultMsg('');
    // dummy request
    setTimeout(() => {
      setIsTesting(false);
      setResultMsg('Test email sent (mock)!');
    }, 800);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResultMsg('');
    // Simulate POST
    try {
      const response = await fetch('/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hrUsername, hrPassword, fromEmailHR, offerUsername, offerPassword, fromEmailOffer,
          selectedProvider, smtpServer, smtpPort,
        }),
      });
      if (response.ok) {
        setResultMsg('Configuration submitted (mock)!');
      } else {
        setResultMsg('Submission failed.');
      }
    } catch {
      setResultMsg('Submission failed.');
    }
    setIsSubmitting(false);
  };

  // Side effects for "same as..."
  React.useEffect(() => {
    if (fromEmailSameAsHr) setFromEmailHR(hrUsername);
  }, [fromEmailSameAsHr, hrUsername]);
  React.useEffect(() => {
    if (fromEmailSameAsOffer) setFromEmailOffer(offerUsername);
  }, [fromEmailSameAsOffer, offerUsername]);

  // Provider search
  const filteredProviders = PROVIDERS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <form className="max-w-full mx-auto bg-gray-50 py-8 flex flex-col gap-6" onSubmit={handleSubmit}>
      {/* Main form box */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* HR block */}
          <div className="flex flex-col gap-4">
            <label className="text-gray-700 font-medium">HR Username</label>
            <input
              type="email"
              value={hrUsername}
              onChange={e => setHrUsername(e.target.value)}
              className="bg-white border border-gray-200 rounded-md px-4 h-11 text-gray-900 text-[15px] placeholder:text-gray-400 focus:border-blue-600 focus:ring-0 w-100"
            />
          </div>
          <div className="flex flex-col gap-4 relative">
            <label className="text-gray-700 font-medium">HR Email Password</label>
            <div className="relative">
              <input
                type={showHrPassword ? 'text' : 'password'}
                value={hrPassword}
                onChange={e => setHrPassword(e.target.value)}
                className="bg-white border border-gray-200 rounded-md px-4 h-11 text-gray-900 text-[15px] placeholder:text-gray-400 focus:border-blue-600 focus:ring-0 w-100  pr-5"
              />
              <button type="button" onClick={() => setShowHrPassword(v => !v)}
                className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400">
                {showHrPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* HR From Email */}
          <div className="flex flex-col gap-3">
            <label className="text-gray-700 font-medium flex items-center gap-1">
              From Email (HR) <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                value={fromEmailHR}
                onChange={e => setFromEmailHR(e.target.value)}
                placeholder="Enter From Email"
                className="bg-white border border-gray-200 rounded-md px-4 h-11 text-gray-900 text-[15px] placeholder:text-gray-400 focus:border-blue-600 focus:ring-0 w-100"
                disabled={fromEmailSameAsHr}
              />
              <div className="flex items-center gap-2">
                <input type="checkbox" id="sameAsHr" checked={fromEmailSameAsHr} onChange={e => setFromEmailSameAsHr(e.target.checked)} />
                <label htmlFor="sameAsHr" className="text-xs text-gray-600">same as HR username</label>
              </div>
            </div>
          </div>

          {/* Offer block */}
          <div className="flex flex-col gap-4">
            <label className="text-gray-700 font-medium">Offer Username</label>
            <input
              type="email"
              value={offerUsername}
              onChange={e => setOfferUsername(e.target.value)}
              className="bg-white border border-gray-200 rounded-md px-4 h-11 text-gray-900 text-[15px] placeholder:text-gray-400 focus:border-blue-600 focus:ring-0 w-100"
            />
          </div>
          <div className="flex flex-col gap-4 relative">
            <label className="text-gray-700 font-medium">Offer Email Password</label>
            <div className="relative">
              <input
                type={showOfferPassword ? 'text' : 'password'}
                value={offerPassword}
                onChange={e => setOfferPassword(e.target.value)}
                className="bg-white border border-gray-200 rounded-md px-4 h-11 text-gray-900 text-[15px] placeholder:text-gray-400 focus:border-blue-600 focus:ring-0 w-100 pr-5"
              />
              <button type="button" onClick={() => setShowOfferPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showOfferPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Offer From Email */}
          <div className="flex flex-col gap-3">
            <label className="text-gray-700 font-medium flex items-center gap-1">
              From Email (Offer) <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                value={fromEmailOffer}
                onChange={e => setFromEmailOffer(e.target.value)}
                placeholder="Enter From Email"
                className="bg-white border border-gray-200 rounded-md px-4 h-11 text-gray-900 text-[15px] placeholder:text-gray-400 focus:border-blue-600 focus:ring-0 w-100"
                disabled={fromEmailSameAsOffer}
              />
              <div className="flex items-center gap-2">
                <input type="checkbox" id="sameAsOffer" checked={fromEmailSameAsOffer} onChange={e => setFromEmailSameAsOffer(e.target.checked)} />
                <label htmlFor="sameAsOffer" className="text-xs text-gray-600">same as offer username</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Provider grid */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col gap-4">
        <div className="flex justify-between items-center mb-2">
          <label className="text-gray-700 font-medium">Select Your Provider</label>
          <input
            type="search"
            className="bg-white border border-gray-200 rounded-md px-4 h-11 text-gray-900 text-[15px] placeholder:text-gray-400 focus:border-blue-600 focus:ring-0 min-w-[190px]"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {filteredProviders.map(p => (
            <button type="button" key={p.name}
              className={`flex items-center justify-center w-full h-24 rounded border text-lg bg-white shadow-sm transition
                ${selectedProvider === p.name
                  ? 'border-blue-500 ring-2 ring-blue-200' 
                  : 'border-gray-200 hover:border-blue-400'} `}
              onClick={() => handleProviderSelect(p.name)}>
                <div className="w-full h-full flex items-center justify-center">{p.logo}</div>
            </button>
          ))}
        </div>
      </div>

      {/* SMTP Row */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* SMTP Server */}
          <div className="flex flex-col gap-3">
            <label className="text-gray-700 font-medium">SMTP Server</label>
            <input
              type="text"
              className="bg-white border border-gray-200 rounded-md px-4 h-11 text-gray-900 text-[15px] placeholder:text-gray-400 focus:border-blue-600 focus:ring-0 w-full"
              value={smtpServer}
              onChange={e => setCustomSmtp(e.target.value)}
              placeholder="SMTP Server"
              readOnly={provider?.name !== 'Other Provider'}
            />
          </div>
          {/* SMTP Port */}
          <div className="flex flex-col gap-3">
            <label className="text-gray-700 font-medium">SMTP Port</label>
            <input
              type="text"
              className="bg-white border border-gray-200 rounded-md px-4 h-11 text-gray-900 text-[15px] placeholder:text-gray-400 focus:border-blue-600 focus:ring-0 w-full"
              value={smtpPort}
              onChange={e => setCustomPort(e.target.value)}
              placeholder="SMTP Port"
              readOnly={provider?.name !== 'Other Provider'}
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-4 justify-end items-center mt-2">
        <button type="button"
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded shadow"
          onClick={handleReset} disabled={isSubmitting}>Reset</button>
        <button type="button"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded shadow"
          onClick={handleTestEmail} disabled={isTesting}>{isTesting ? 'Testing...' : 'Test Email'}</button>
        <button type="submit"
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded shadow"
          disabled={isSubmitting}>Submit</button>
      </div>
      {resultMsg && <div className="text-center text-blue-700 font-medium pt-2">{resultMsg}</div>}
    </form>
  );
}
