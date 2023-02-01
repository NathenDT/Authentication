import React, { ReactElement } from 'react'

type Props = {
  children: ReactElement
}

export default function Footer({ children }: Props) {
  return (
    <div style={{ paddingBottom: '50px' }}>
      {children}
      <div
        style={{
          position: 'fixed',
          left: 0,
          bottom: 0,
          width: '100%',
          fontFamily:
            '"Haas Grot Text R Web", "Helvetica Neue", Helvetica, Arial, sans-serif',
          backgroundColor: '#f1f1f1',
          textAlign: 'center',
          padding: '5px',
          margin: 0,
        }}
      >
        <Button />
      </div>
    </div>
  )
}

const Button = () => {
  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#24a0ed',
    borderRadius: '8px',
    borderStyle: 'none',
    boxSizing: 'border-box',
    color: '#FFFFFF',
    cursor: 'pointer',
    display: 'inline-block',
    fontFamily:
      '"Haas Grot Text R Web", "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontSize: '14px',
    fontWeight: '500',
    height: '40px',
    lineHeight: '20px',
    listStyle: 'none',
    margin: 0,
    outline: 'none',
    padding: '10px 16px',
    position: 'relative',
    textAlign: 'center',
    textDecoration: 'none',
    transition: 'background-color 100ms',
    verticalAlign: 'baseline',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    touchAction: 'manipulation',
  }

  const buttonHover: React.CSSProperties = {
    backgroundColor: '#5594bc',
  }

  const [hover, setHover] = React.useState(false)

  return (
    <button
      style={hover ? { ...buttonStyle, ...buttonHover } : buttonStyle}
      onClick={() =>
        window.open(
          'https://github.com/NathenDT/Authentication',
          '_blank',
          'noreferrer'
        )
      }
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      role="button"
    >
      See the code
    </button>
  )
}
