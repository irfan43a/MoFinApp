import React, { useState } from 'react';
import { X, Key, Globe, CheckCircle2, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { 
  getApiKey, setApiKey, DEFAULT_API_KEY, 
  getLanguage, setLanguage, checkApiKeyValidity 
} from '../services/tmdb';

export default function SettingsModal({
  isOpen,
  onClose,
  onSettingsSaved,
}) {
  const [apiKeyInput, setApiKeyInput] = useState(getApiKey());
  const [languageInput, setLanguageInput] = useState(getLanguage());
  const [testStatus, setTestStatus] = useState(null); // 'testing' | 'success' | 'error'
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTestStatus('testing');
    setStatusMessage('Menguji koneksi ke TMDb API secara langsung...');
    
    const isValid = await checkApiKeyValidity(apiKeyInput);
    if (isValid) {
      setTestStatus('success');
      setStatusMessage('Koneksi Real-time Berhasil! API Key aktif dan berfungsi.');
    } else {
      setTestStatus('error');
      setStatusMessage('Koneksi gagal. Periksa kembali API Key Anda.');
    }
  };

  const handleSave = () => {
    setApiKey(apiKeyInput);
    setLanguage(languageInput);
    onSettingsSaved();
    onClose();
  };

  const handleResetToDefault = () => {
    setApiKeyInput(DEFAULT_API_KEY);
    setTestStatus(null);
    setStatusMessage('');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-slate-950 rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-500 flex items-center justify-center border border-rose-500/30">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Pengaturan API & Bahasa</h3>
              <p className="text-xs text-slate-400">Konfigurasi sumber data real-time</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* TMDb API Key Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <label className="text-slate-300">TMDb API Key (v3)</label>
            <button
              onClick={handleResetToDefault}
              className="text-rose-400 hover:text-rose-300 text-[11px] transition-colors"
            >
              Gunakan Kunci Default
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              value={apiKeyInput}
              onChange={(e) => {
                setApiKeyInput(e.target.value);
                setTestStatus(null);
              }}
              placeholder="Masukkan TMDb API Key Anda..."
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
            />
          </div>
          <p className="text-[11px] text-slate-500">
            Aplikasi sudah dilengkapi dengan API key real-time default aktif, siap digunakan tanpa registrasi.
          </p>
        </div>

        {/* Language Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-rose-400" />
            Bahasa Data (Sinopsis & Metadata)
          </label>
          <select
            value={languageInput}
            onChange={(e) => setLanguageInput(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
          >
            <option value="id-ID">Bahasa Indonesia (id-ID)</option>
            <option value="en-US">English (en-US)</option>
            <option value="ja-JP">Japanese (ja-JP)</option>
            <option value="ko-KR">Korean (ko-KR)</option>
          </select>
        </div>

        {/* Test Connection Button & Status */}
        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-300">Status Server API:</span>
            <button
              onClick={handleTestConnection}
              disabled={testStatus === 'testing'}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3 h-3 ${testStatus === 'testing' ? 'animate-spin' : ''}`} />
              Tes Koneksi
            </button>
          </div>

          {testStatus && (
            <div
              className={`flex items-start gap-2 p-2.5 rounded-xl text-xs ${
                testStatus === 'success'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : testStatus === 'error'
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {testStatus === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />}
              {testStatus === 'error' && <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
              <span>{statusMessage}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/30 transition-all"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}
