import Icon from './Icon.jsx';

export default function EmptyState({ icon = 'search', title, message, children }) {
  return (
    <div className="empty-state" role="status">
      <span className="empty-state__icon"><Icon name={icon} size={28} /></span>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {children && <div className="empty-state__actions">{children}</div>}
    </div>
  );
}
