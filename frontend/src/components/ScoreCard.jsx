function ScoreCard({
  title,
  score,
  description,
  icon,
  variant = "orange",
}) {
  const safeScore = Math.min(10, Math.max(0, Number(score) || 0));

  return (
    <div className={`score-card ${variant}`}>
      <div className="score-card-top">
        <div className="score-icon">
          {icon}
        </div>

        <div>
          <h3>{title}</h3>

          <div className="score-value">
            <strong>{safeScore.toFixed(1)}</strong>
            <span>/ 10</span>
          </div>
        </div>
      </div>

      <div className="score-progress">
        <div
          className="score-progress-fill"
          style={{
            width: `${safeScore * 10}%`,
          }}
        />
      </div>

      <p>{description}</p>
    </div>
  );
}

export default ScoreCard;
