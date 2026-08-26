function ProgressBar({ current, total }) {
  const percentage =
    Math.min(100, (current / total) * 100);

  return (
    <div className="progress-container">

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

    </div>
  );
}

export default ProgressBar;
