export default function VideoSection() {
  return (
    <section className="bb-video">
      <p className="bb-video__label">How does it work?</p>
      <h2 className="bb-video__title">See how simple it is<br />to apply tooth gems.</h2>
      <div className="bb-video__frame">
        <div className="bb-video__placeholder">
          <div className="bb-video__play">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <p className="bb-video__placeholder-text">Video coming soon</p>
        </div>
      </div>
    </section>
  );
}
