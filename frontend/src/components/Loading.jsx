function Loading({ message = "Curio is thinking..." }) {
  return (
    <div className="loading-container">
      <div className="loading-orbit">
        <div className="loading-dot" />
      </div>

      <h3>{message}</h3>

      <p>
        Curio is analyzing your explanation.
      </p>
    </div>
  );
}

export default Loading;
