interface ToolBtnProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  primary?: boolean;
  bordered?: boolean;
}

export default function ToolBtn({ children, onClick, disabled, primary, bordered }: ToolBtnProps) {
  let bg     = 'transparent';
  let border = 'none';
  let color  = 'var(--color-text-normal)';

  if (primary) {
    bg    = disabled ? 'var(--color-bg-elevate)'    : 'var(--color-primary-normal)';
    color = disabled ? 'var(--color-text-disabled)' : 'var(--color-static-white)';
  } else if (bordered) {
    bg     = 'var(--color-bg-normal)';
    border = '1px solid var(--color-border-strong)';
    color  = 'var(--color-text-normal)';
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '6px 8px',
        gap: 4,
        height: 34,
        borderRadius: 8,
        background: bg,
        border,
        color,
        fontFamily: 'Pretendard',
        fontWeight: 500,
        fontSize: 13,
        lineHeight: '18px',
        letterSpacing: '-0.005em',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {children}
    </button>
  );
}
