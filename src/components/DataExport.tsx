"use client";
import { useState } from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { isFeatureAllowed } from '@/lib/stripe';
import { 
  Download, 
  FileText, 
  Table, 
  Calendar, 
  DollarSign, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import UpgradePrompt from './UpgradePrompt';

interface ExportOptions {
  format: 'csv' | 'pdf';
  dateRange: 'all' | 'last_30' | 'last_90' | 'last_year';
  includeTransactions: boolean;
  includeInsights: boolean;
  includeAnalytics: boolean;
}

interface DataExportProps {
  subscriptions?: any[];
  transactions?: any[];
  inline?: boolean;
}

export default function DataExport({ subscriptions = [], transactions = [], inline = false }: DataExportProps) {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    dateRange: 'all',
    includeTransactions: false,
    includeInsights: false,
    includeAnalytics: false,
  });
  const [isExporting, setIsExporting] = useState(false);
  const [lastExport, setLastExport] = useState<string | null>(null);
  const { plan } = useSubscription();

  const canExportData = isFeatureAllowed(plan?.id || 'free', 'data_export');

  const handleExport = async () => {
    if (!canExportData) return;

    setIsExporting(true);
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...exportOptions,
          subscriptions,
          transactions,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `subscriptions_export_${new Date().toISOString().split('T')[0]}.${exportOptions.format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        setLastExport(new Date().toLocaleString());
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (!canExportData) {
    return (
      <div className="space-y-6">
        {/* Show some basic content even for free users */}
        <div className="bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-xl p-6">
          <div className="text-center py-8">
            <Download className="w-16 h-16 text-muted-light mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground-black mb-2">Data Export</h3>
            <p className="text-muted-light mb-6">
              Export your subscription data as professional CSV or PDF reports.
            </p>
          </div>
        </div>
        
        <UpgradePrompt 
          feature="data export (CSV/PDF)"
          limit="Free plan doesn't include data export capabilities"
          inline={inline}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Download className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground-black">Export Data</h2>
          <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
            <CheckCircle className="w-3 h-3" />
            Pro Feature
          </div>
        </div>
        
        {lastExport && (
          <div className="text-sm text-muted-light">
            Last export: {lastExport}
          </div>
        )}
      </div>

      {/* Export Options */}
      <div className="bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground-black mb-4">Export Options</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground-black mb-3">
              Export Format
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border border-border-light rounded-lg cursor-pointer hover:bg-card-hover-light transition-colors">
                <input
                  type="radio"
                  name="format"
                  value="csv"
                  checked={exportOptions.format === 'csv'}
                  onChange={(e) => setExportOptions({ ...exportOptions, format: e.target.value as 'csv' })}
                  className="w-4 h-4 text-primary focus:ring-primary border-border-light"
                />
                <Table className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium text-foreground-black">CSV (Spreadsheet)</div>
                  <div className="text-sm text-muted-light">Import into Excel, Google Sheets, etc.</div>
                </div>
              </label>
              
              <label className="flex items-center gap-3 p-3 border border-border-light rounded-lg cursor-pointer hover:bg-card-hover-light transition-colors">
                <input
                  type="radio"
                  name="format"
                  value="pdf"
                  checked={exportOptions.format === 'pdf'}
                  onChange={(e) => setExportOptions({ ...exportOptions, format: e.target.value as 'pdf' })}
                  className="w-4 h-4 text-primary focus:ring-primary border-border-light"
                />
                <FileText className="w-5 h-5 text-red-600" />
                <div>
                  <div className="font-medium text-foreground-black">PDF Report</div>
                  <div className="text-sm text-muted-light">Professional formatted report</div>
                </div>
              </label>
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-foreground-black mb-3">
              Date Range
            </label>
            <select
              value={exportOptions.dateRange}
              onChange={(e) => setExportOptions({ ...exportOptions, dateRange: e.target.value as ExportOptions['dateRange'] })}
              className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">All Time</option>
              <option value="last_30">Last 30 Days</option>
              <option value="last_90">Last 90 Days</option>
              <option value="last_year">Last Year</option>
            </select>
          </div>
        </div>

        {/* Include Options */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-foreground-black mb-3">
            Include Additional Data
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={exportOptions.includeTransactions}
                onChange={(e) => setExportOptions({ ...exportOptions, includeTransactions: e.target.checked })}
                className="w-4 h-4 text-primary focus:ring-primary border-border-light rounded"
              />
              <DollarSign className="w-4 h-4 text-blue-600" />
              <span className="text-foreground-black">Transaction Details</span>
              <span className="text-sm text-muted-light">({transactions.length} transactions)</span>
            </label>
            
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={exportOptions.includeInsights}
                onChange={(e) => setExportOptions({ ...exportOptions, includeInsights: e.target.checked })}
                className="w-4 h-4 text-primary focus:ring-primary border-border-light rounded"
                disabled={exportOptions.format === 'csv'}
              />
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span className={`text-foreground-black ${exportOptions.format === 'csv' ? 'opacity-50' : ''}`}>
                AI Insights & Recommendations
              </span>
              {exportOptions.format === 'csv' && (
                <span className="text-xs text-muted-light">(PDF only)</span>
              )}
            </label>
            
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={exportOptions.includeAnalytics}
                onChange={(e) => setExportOptions({ ...exportOptions, includeAnalytics: e.target.checked })}
                className="w-4 h-4 text-primary focus:ring-primary border-border-light rounded"
                disabled={exportOptions.format === 'csv' || plan?.id !== 'business'}
              />
              <Calendar className="w-4 h-4 text-purple-600" />
              <span className={`text-foreground-black ${(exportOptions.format === 'csv' || plan?.id !== 'business') ? 'opacity-50' : ''}`}>
                Advanced Analytics & Trends
              </span>
              {plan?.id !== 'business' && (
                <span className="text-xs text-amber-600">(Business only)</span>
              )}
            </label>
          </div>
        </div>
      </div>

      {/* Export Preview */}
      <div className="bg-background-light-mid/50 border border-border-light rounded-xl p-4">
        <h4 className="font-medium text-foreground-black mb-2">Export Preview</h4>
        <div className="text-sm text-muted-light space-y-1">
          <div>• {subscriptions.length} subscriptions</div>
          {exportOptions.includeTransactions && (
            <div>• {transactions.length} transactions</div>
          )}
          {exportOptions.includeInsights && exportOptions.format === 'pdf' && (
            <div>• AI insights and recommendations</div>
          )}
          {exportOptions.includeAnalytics && exportOptions.format === 'pdf' && plan?.id === 'business' && (
            <div>• Advanced analytics and trends</div>
          )}
          <div className="pt-2 font-medium text-foreground-black">
            Format: {exportOptions.format.toUpperCase()} | Range: {exportOptions.dateRange.replace('_', ' ')}
          </div>
        </div>
      </div>

      {/* Export Button */}
      <button
        onClick={handleExport}
        disabled={isExporting || subscriptions.length === 0}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cta-start to-cta-end text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isExporting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Generating Export...
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Export {exportOptions.format.toUpperCase()}
          </>
        )}
      </button>

      {/* Export History/Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-medium text-blue-800 mb-1">Export Information</div>
            <ul className="text-blue-700 space-y-1">
              <li>• CSV files can be opened in Excel, Google Sheets, or any spreadsheet application</li>
              <li>• PDF reports include charts, insights, and professional formatting</li>
              <li>• All exports include your subscription summary and spending analysis</li>
              <li>• Data is exported based on your current subscription detection results</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
