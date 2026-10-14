export default function ProgressBar({ value, label = 'Course progress', tone = 'primary' }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className={`progress progress--${tone}`}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
    >
      <div className="progress__fill" style={{ width: `${clamped}%` }} />
    </div>
  );
}
