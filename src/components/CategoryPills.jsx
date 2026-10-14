export default function CategoryPills({ categories, active, onSelect, counts = {} }) {
  return (
    <div className="pills" role="group" aria-label="Filter courses by category">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={`pill${active === category ? ' is-active' : ''}`}
          aria-pressed={active === category}
          onClick={() => onSelect(category)}
        >
          {category}
          {counts[category] !== undefined && <span className="pill__count">{counts[category]}</span>}
        </button>
      ))}
    </div>
  );
}
