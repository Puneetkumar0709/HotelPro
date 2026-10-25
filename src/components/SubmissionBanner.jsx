import { ExternalLink, CheckCircle2, Copy, Sparkles, ShieldCheck, Key, GitBranch } from 'lucide-react';

export const SubmissionBanner = ({ onOpenJwtModal, onOpenDemoInfo }) => {
  const [copied, setCopied] = useState(false);

  const githubUrl = 'https://github.com/PuneetKumar0729/hotelpro-management-system';
  const demoUrl = window.location.origin;

  const copySubmissionText = () => {
    const text = `Hospitality Project Evaluation - HotelPro
Repository: ${githubUrl}
Live Demo: ${demoUrl}
Stack: React JSX, Node.js & Express.js, MongoDB/Mongoose, JWT Authentication, Bootstrap & Modern CSS.
Demo Credentials:
- Admin (General Manager): admin@hotelpro.com / adminPassword123
- Front Desk: frontdesk@hotelpro.com / frontdeskPassword123
- Guest: guest@hotelpro.com / guestPassword123`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div
      style={{
        background: 'linear-gradient(90deg, rgba(13,21,39,0.95) 0%, rgba(20,32,60,0.95) 50%, rgba(13,21,39,0.95) 100%)',
        borderBottom: '1px solid rgba(212,175,55,0.3)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      }}
      className="py-2 px-3 text-white"
    >
      <div className="container-fluid d-flex flex-wrap align-items-center justify-content-between gap-2">
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-warning text-dark font-cinzel fw-bold px-2 py-1">
            <Sparkles size={13} className="me-1 inline" /> NASSCOM EVALUATION
          </span>
          <span className="small text-light d-none d-md-inline">
            <strong className="text-warning">HotelPro:</strong> Hospitality Individual Project Ready for Mentor Review
          </span>
        </div>

        <div className="d-flex align-items-center flex-wrap gap-2">
          {/* GitHub Link */}
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm text-light d-inline-flex align-items-center gap-1"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.2)',
              fontSize: '0.8rem',
            }}
            title="Open GitHub Repository"
          >
            <GitBranch size={14} className="text-warning" />
            <span className="d-none d-sm-inline">GitHub Repo</span>
            <ExternalLink size={12} className="opacity-75" />
          </a>

          {/* Copy Submission Links Button */}
          <button
            onClick={copySubmissionText}
            className="btn btn-sm d-inline-flex align-items-center gap-1 fw-semibold"
            style={{
              background: copied ? 'rgba(16,185,129,0.2)' : 'rgba(212,175,55,0.2)',
              border: copied ? '1px solid #10B981' : '1px solid rgba(212,175,55,0.5)',
              color: copied ? '#34D399' : '#F3E5AB',
              fontSize: '0.8rem',
            }}
          >
            {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
            {copied ? 'Copied to Clipboard!' : 'Copy Demo & GitHub Links'}
          </button>

          {/* JWT Token Inspector Button */}
          <button
            onClick={onOpenJwtModal}
            className="btn btn-sm text-light d-inline-flex align-items-center gap-1"
            style={{
              background: 'rgba(6,182,212,0.15)',
              border: '1px solid rgba(6,182,212,0.4)',
              color: '#38BDF8',
              fontSize: '0.8rem',
            }}
            title="Inspect Live JWT Token & Payload"
          >
            <Key size={13} />
            <span className="d-none d-sm-inline">Inspect JWT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
