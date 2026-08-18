export function ReviewPlaceholder() {
  if (process.env.NODE_ENV !== "development") return null;
  return (
    <section
      className="section section--white"
      data-development-placeholder="reviews"
    >
      <div className="container">
        <div className="review-placeholder">
          <p className="eyebrow">Development placeholder</p>
          <h2>Verified customer feedback</h2>
          <p>
            No approved reviews have been supplied. This section is not included
            in production until authentic feedback is available.
          </p>
        </div>
      </div>
    </section>
  );
}
