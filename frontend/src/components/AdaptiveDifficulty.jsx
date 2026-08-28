export default function AdaptiveDifficulty({
  level = 2,
  name = "Clarifying",
  onLevelChange
}) {
  return (
    <div className="adaptive-panel">

      <div className="adaptive-header">
        <div>
          <span className="adaptive-label">
            CURIO'S QUESTION LEVEL
          </span>

          <h4>{name}</h4>
        </div>

        <div className="adaptive-number">
          {level}/5
        </div>
      </div>

      <div className="adaptive-track">
        {[1, 2, 3, 4, 5].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onLevelChange && onLevelChange(item)}
            className={
              item <= level
                ? "adaptive-dot active"
                : "adaptive-dot"
            }
            aria-label={`Set question level to ${item}`}
          />
        ))}
      </div>

      <p>
        Curio adjusts the next question based on
        how well your explanation is holding up.
      </p>

    </div>
  );
}
