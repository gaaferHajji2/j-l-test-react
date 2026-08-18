import { useTranslation } from 'react-i18next';

const ROLE_STYLES = {
  admin: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
  vendor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  venue_owner: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400 border-teal-200 dark:border-teal-800',
  customer: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
};

const ROLE_GRADIENTS = {
  admin: 'from-red-500 to-orange-600',
  vendor: 'from-purple-500 to-pink-600',
  venue_owner: 'from-teal-500 to-emerald-600',
  customer: 'from-blue-500 to-indigo-600',
};

const UserCard = ({ user }) => {
  const { t } = useTranslation();

  const roleStyle = ROLE_STYLES[user.role] || ROLE_STYLES.customer;
  const roleGradient = ROLE_GRADIENTS[user.role] || ROLE_GRADIENTS.customer;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
      {/* Header with Avatar */}
      <div className="p-5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
              />
            ) : (
              <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${roleGradient} flex items-center justify-center text-white font-bold text-lg`}>
                {user.initials}
              </div>
            )}
            {/* Verified Badge */}
            {user.isEmailVerified && (
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>

          {/* Name & Email */}
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">{user.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{user.email}</p>
          </div>

          {/* Role Badge */}
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold border uppercase tracking-wide flex-shrink-0 ${roleStyle}`}>
            {user.role.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-3 flex-1">
        {/* Phone */}
        {user.phone && (
          <div className="flex items-center gap-2 text-sm">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="text-gray-700 dark:text-gray-300 text-xs">{user.phone}</span>
          </div>
        )}

        {/* Email Verification Status */}
        <div className="flex items-center gap-2 text-sm">
          <svg className={`w-4 h-4 flex-shrink-0 ${user.isEmailVerified ? 'text-green-500' : 'text-amber-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={user.isEmailVerified ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" : "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"} />
          </svg>
          <span className={`text-xs ${user.isEmailVerified ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
            {user.isEmailVerified ? t('users.emailVerified') : t('users.emailNotVerified')}
          </span>
        </div>

        {/* Joined Date */}
        <div className="flex items-center gap-2 text-sm">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-gray-600 dark:text-gray-400 text-xs">
            {t('users.joinedAt')}: {user.formattedCreatedAt}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserCard;