import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHealthStatus } from '../store/slices/healthSlice';
import { Activity, RefreshCw } from 'lucide-react';

const ApiHealthIndicator = () => {
  const dispatch = useDispatch();
  const { data, status, lastChecked } = useSelector((state) => state.health);

  const checkHealth = () => {
    dispatch(fetchHealthStatus());
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const isConnected = status === 'succeeded' && data?.status === 'healthy';
  const isConnecting = status === 'loading';

  return (
    <div className="flex items-center space-x-3 px-3 py-1.5 bg-slate-800 rounded-lg text-xs border border-slate-700">
      <div className="flex items-center space-x-2">
        <span className="relative flex h-2.5 w-2.5">
          {isConnected && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          )}
          <span
            className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
              isConnected
                ? 'bg-emerald-500'
                : isConnecting
                ? 'bg-amber-500 animate-pulse'
                : 'bg-rose-500'
            }`}
          ></span>
        </span>
        <span className="font-medium text-slate-200">
          {isConnected ? (
            <span className="text-emerald-400">Connected to API (DB: {data?.database?.status})</span>
          ) : isConnecting ? (
            <span className="text-amber-400">Checking API...</span>
          ) : (
            <span className="text-rose-400">API Disconnected</span>
          )}
        </span>
      </div>

      <button
        onClick={checkHealth}
        disabled={isConnecting}
        title="Refresh API Connection"
        className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${isConnecting ? 'animate-spin text-amber-400' : ''}`} />
      </button>
    </div>
  );
};

export default ApiHealthIndicator;
