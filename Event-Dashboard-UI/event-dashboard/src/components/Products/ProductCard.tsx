import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ProductCard = ({ product, onStatusChange }) => {
  const { t } = useTranslation();
  const [confirmAction, setConfirmAction] = useState(null); // 'activate' | 'reject' | 'deactivate'

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
      active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
      inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
        {t(`productStatus.${status}`)}
      </span>
    );
  };

  const handleAction = async (newStatus) => {
    try {
      await onStatusChange(product.id, newStatus);
      setConfirmAction(null);
    } catch (error) {
      console.error('Error updating product status:', error);
    }
  };

  const renderActions = () => {
    // Confirmation state
    if (confirmAction) {
      const messages = {
        active: product.status === 'pending' ? t('products.confirmActivate') : t('products.confirmActivate'),
        rejected: t('products.confirmReject'),
        inactive: t('products.confirmDeactivate'),
      };
      const isDestructive = confirmAction === 'rejected' || confirmAction === 'inactive';

      return (
        <div className="flex flex-col gap-2 w-full">
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-snug">{messages[confirmAction]}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAction(confirmAction)}
              className={`flex-1 px-3 py-2 text-white text-xs font-medium rounded-lg transition-colors ${
                isDestructive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              Confirm
            </button>
            <button
              onClick={() => setConfirmAction(null)}
              className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 text-xs font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    // Pending → Activate or Reject
    if (product.status === 'pending') {
      return (
        <>
          <button
            onClick={() => setConfirmAction('active')}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            {t('products.activate')}
          </button>
          <button
            onClick={() => setConfirmAction('rejected')}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            {t('products.reject')}
          </button>
        </>
      );
    }

    // Active → Deactivate
    if (product.status === 'active') {
      return (
        <button
          onClick={() => setConfirmAction('inactive')}
          className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
          {t('products.deactivate')}
        </button>
      );
    }

    // Inactive → Activate
    if (product.status === 'inactive') {
      return (
        <button
          onClick={() => setConfirmAction('active')}
          className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {t('products.activate')}
        </button>
      );
    }

    // Rejected → no actions
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
      {/* Product Image */}
      <div className="relative h-44 overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=400&q=80'; }}
        />
        <div className="absolute top-3 right-3">
          {getStatusBadge(product.status)}
        </div>
        <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-lg">
          <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{product.price.toLocaleString()} SAR</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Category Tag */}
        <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
          {product.category}
        </span>

        {/* Product Name */}
        <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-1 mb-2">
          {product.name}
        </h3>

        {/* Vendor */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
            {product.vendorName.charAt(0)}
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-400 truncate">{product.vendorName}</span>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 flex-1">
          {product.description}
        </p>

        {/* Meta Info */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            <span>{t('products.stock')}: {product.stock}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span>{new Date(product.submittedAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
          <div className="flex items-center gap-2">
            {renderActions()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;