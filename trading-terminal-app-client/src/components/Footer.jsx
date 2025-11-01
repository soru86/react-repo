const footerStyle = {
    background: 'var(--card-bg)',
    borderTop: `1px solid var(--border)`,
    minHeight: 'clamp(10px, 6vh, 20px)',
    padding: 'clamp(0.2rem, 2vw, 0.4rem)',
    position: 'sticky',
    bottom: 0,
    textAlign: 'center',
    fontSize: 'clamp(10px, 1vw, 12px)',
    lineHeight: '1.4286',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const Footer = () => {
    return (
        <footer style={footerStyle}>
            © 2025 Algo Yatra. All rights reserved.
        </footer>
    )
}

export default Footer