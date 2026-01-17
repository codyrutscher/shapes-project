interface HomePageProps {
  onStart: () => void;
}

export function HomePage({ onStart }: HomePageProps) {
  return (
    <div className="home-page">
      <div className="home-content">
        <div className="home-hero">
          <h1>Process Flow Designer</h1>
          <p className="tagline">Create beautiful diagrams and flowcharts with ease</p>
          <button className="start-btn" onClick={onStart}>
            Start Creating
          </button>
        </div>

        <div className="features">
          <div className="feature">
            <span className="feature-icon">🔷</span>
            <h3>Multiple Shapes</h3>
            <p>Rectangles, circles, triangles, diamonds, and hexagons</p>
          </div>
          <div className="feature">
            <span className="feature-icon">🔗</span>
            <h3>Smart Connectors</h3>
            <p>Arrows, lines, dashed, and dotted connectors</p>
          </div>
          <div className="feature">
            <span className="feature-icon">🎨</span>
            <h3>Full Customization</h3>
            <p>Colors, fonts, sizes, and text styling</p>
          </div>
          <div className="feature">
            <span className="feature-icon">💾</span>
            <h3>Auto Save</h3>
            <p>Your work is saved locally in your browser</p>
          </div>
          <div className="feature">
            <span className="feature-icon">📄</span>
            <h3>PDF Export</h3>
            <p>Export your diagrams as PDF documents</p>
          </div>
          <div className="feature">
            <span className="feature-icon">↩️</span>
            <h3>Undo & Redo</h3>
            <p>Full history support with keyboard shortcuts</p>
          </div>
        </div>

        <div className="home-footer">
          <p>No account required • Works offline • Free to use</p>
        </div>
      </div>
    </div>
  );
}
