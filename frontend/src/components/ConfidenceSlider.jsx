export default function ConfidenceSlider({
  value,
  setValue
}) {

  return (
    <div className="confidence-box">

      <div className="confidence-header">

        <div>
          <h3>How confident are you?</h3>

          <p>
            Before teaching, rate how well you think
            you understand this topic.
          </p>
        </div>

        <div className="confidence-number">
          {value}
        </div>

      </div>

      <input
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={(e) =>
          setValue(Number(e.target.value))
        }
      />

      <div className="confidence-scale">
        <span>Not confident</span>
        <span>Very confident</span>
      </div>

    </div>
  );
}
