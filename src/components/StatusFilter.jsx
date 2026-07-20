import { ChevronDown } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'PLACED', label: 'Placed' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'READY_TO_SHIP', label: 'Ready to Ship' },
];

const PAYMENT_OPTIONS = [
  { value: '', label: 'All Payments' },
  { value: 'PAID', label: 'Paid' },
  { value: 'UNPAID', label: 'Unpaid' },
];

const StatusFilter = ({ status, paymentStatus, onStatusChange, onPaymentChange }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <select
          id="status-filter"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="select-field pr-8 appearance-none min-w-[150px]"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
          <ChevronDown className="w-4 h-4 text-surface-400" />
        </div>
      </div>

      <div className="relative">
        <select
          id="payment-filter"
          value={paymentStatus}
          onChange={(e) => onPaymentChange(e.target.value)}
          className="select-field pr-8 appearance-none min-w-[140px]"
        >
          {PAYMENT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
          <ChevronDown className="w-4 h-4 text-surface-400" />
        </div>
      </div>
    </div>
  );
};

export default StatusFilter;
