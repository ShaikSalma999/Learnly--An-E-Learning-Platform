import Icon from './Icon.jsx';
import { formatCount } from '../utils/format.js';

export default function Rating({ value, count }) {
  return (
    <span className="rating" aria-label={`Rated ${value} out of 5${count ? ` from ${count} reviews` : ''}`}>
      <Icon name="star" size={15} filled className="rating__star" />
      <strong>{value.toFixed(1)}</strong>
      {count ? <span className="rating__count">({formatCount(count)})</span> : null}
    </span>
  );
}
