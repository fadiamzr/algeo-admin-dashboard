const statusConfig = {
  delivered: { label: 'Delivered', bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  pending: { label: 'Pending', bg: 'bg-amber-500/15', text: 'text-amber-400', dot: 'bg-amber-400' },
  in_transit: { label: 'In Transit', bg: 'bg-blue-500/15', text: 'text-blue-400', dot: 'bg-blue-400' },
  failed: { label: 'Failed', bg: 'bg-red-500/15', text: 'text-red-400', dot: 'bg-red-400' },
  success: { label: 'Success', bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  address_not_found: { label: 'Not Found', bg: 'bg-red-500/15', text: 'text-red-400', dot: 'bg-red-400' },
  wrong_address: { label: 'Wrong Address', bg: 'bg-orange-500/15', text: 'text-orange-400', dot: 'bg-orange-400' },
  active: { label: 'Active', bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  inactive: { label: 'Inactive', bg: 'bg-dark-500/15', text: 'text-dark-400', dot: 'bg-dark-400' },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || {
    label: status,
    bg: 'bg-dark-500/15',
    text: 'text-dark-400',
    dot: 'bg-dark-400',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
