function ReportSection({
  title,
  items = [],
  type = "orange",
  icon,
}) {
  return (
    <div className={`report-section ${type}`}>
      <div className="report-section-header">
        <div className="report-section-icon">
          {icon}
        </div>

        <h3>{title}</h3>

        <span className="item-count">
          {items.length}
        </span>
      </div>

      {items.length > 0 ? (
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              <span className="bullet">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-report">
          Nothing specific found here.
        </div>
      )}
    </div>
  );
}

export default ReportSection;
