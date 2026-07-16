export default function VideoSection() {
  return (
    <section className="bb-video">
      <p className="bb-video__label">Kuidas see käib?</p>
      <h2 className="bb-video__title">Vaata, kui lihtne on<br />hambakristallide paigaldamine.</h2>
      <div className="bb-video__frame">
        <div className="bb-video__placeholder">
          <div className="bb-video__play">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <p className="bb-video__placeholder-text">Video tuleb varsti</p>
        </div>
      </div>
    </section>
  );
}
