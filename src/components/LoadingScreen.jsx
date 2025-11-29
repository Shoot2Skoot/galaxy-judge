import './LoadingScreen.css';

export default function LoadingScreen({ message = 'LOADING CASE DATA' }) {
  return (
    <div className="loading-screen">
      <div className="loading-box">
        <div className="loading-header">SYSTEM STATUS</div>
        <div className="loading-content">
          <div className="loading-spinner">
            <span className="spinner-char">[</span>
            <span className="spinner-dots">...</span>
            <span className="spinner-char">]</span>
          </div>
          <div className="loading-message">{message}</div>
        </div>
      </div>
    </div>
  );
}
