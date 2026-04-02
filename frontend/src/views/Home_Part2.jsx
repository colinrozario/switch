{/* How It Works Section */ }
<Section style={{ background: '#080808', borderTop: '1px solid #222', borderBottom: '1px solid #222', padding: '120px 5%' }}>
    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: '80px' }}>
        <h2 style={{ fontSize: '56px', fontWeight: 'bold', marginBottom: '24px', letterSpacing: '-0.03em' }}>
            The System
        </h2>
        <p style={{ fontSize: '20px', color: '#888', lineHeight: '1.6' }}>
            We replaced "generic career advice" with a deterministic financial engine. Here is how we get you from A to B safely.
        </p>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px' }}>
        {[
            {
                step: "01",
                title: "Input Reality",
                desc: "We start with your hard constraints: current salary, liquid savings, and time availability (e.g. 5hrs/week).",
                color: "#fff"
            },
            {
                step: "02",
                title: "Simulate Risk",
                desc: "Our engine runs 1,000 Monte Carlo simulations to find the highest-ROI path that preserves your financial runway.",
                color: "#d7fe03"
            },
            {
                step: "03",
                title: "Execute Plan",
                desc: "You get a week-by-week roadmap. Every task is vetted for ROI. You don't waste a single minute on fluff.",
                color: "#fff"
            }
        ].map((item, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: item.color, border: `1px solid ${item.color}`, padding: '4px 12px', borderRadius: '100px', width: 'fit-content' }}>
                    STEP {item.step}
                </div>
                <h3 style={{ fontSize: '32px', fontWeight: '600' }}>{item.title}</h3>
                <p style={{ color: '#888', lineHeight: '1.6', fontSize: '18px' }}>{item.desc}</p>
            </div>
        ))}
    </div>
</Section>

{/* Comparison Section */ }
<Section style={{ padding: '120px 5%' }}>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', maxWidth: '1200px', margin: '0 auto' }}>

        {/* The Old Way */}
        <div style={{ padding: '40px', borderRadius: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid #333' }}>
            <h3 style={{ fontSize: '24px', color: '#666', marginBottom: '30px' }}>Generic Career Advice</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <li style={{ display: 'flex', gap: '16px', color: '#888', fontSize: '18px' }}>
                    <span style={{ color: '#ff5f57' }}>✕</span> "Just follow your passion"
                </li>
                <li style={{ display: 'flex', gap: '16px', color: '#888', fontSize: '18px' }}>
                    <span style={{ color: '#ff5f57' }}>✕</span> Ignoring financial runway
                </li>
                <li style={{ display: 'flex', gap: '16px', color: '#888', fontSize: '18px' }}>
                    <span style={{ color: '#ff5f57' }}>✕</span> Applying to 100s of jobs blindly
                </li>
                <li style={{ display: 'flex', gap: '16px', color: '#888', fontSize: '18px' }}>
                    <span style={{ color: '#ff5f57' }}>✕</span> Vague, overwhelming goals
                </li>
            </ul>
        </div>

        {/* The Switch Way */}
        <div style={{ padding: '40px', borderRadius: '24px', background: 'rgba(215, 254, 3, 0.05)', border: '1px solid #d7fe03' }}>
            <h3 style={{ fontSize: '24px', color: '#fff', marginBottom: '30px' }}>The switch. Protocol</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <li style={{ display: 'flex', gap: '16px', color: '#fff', fontSize: '18px' }}>
                    <span style={{ color: '#d7fe03' }}>✓</span> "Follow the market demand"
                </li>
                <li style={{ display: 'flex', gap: '16px', color: '#fff', fontSize: '18px' }}>
                    <span style={{ color: '#d7fe03' }}>✓</span> Safety margin first
                </li>
                <li style={{ display: 'flex', gap: '16px', color: '#fff', fontSize: '18px' }}>
                    <span style={{ color: '#d7fe03' }}>✓</span> Targeted networking & assets
                </li>
                <li style={{ display: 'flex', gap: '16px', color: '#fff', fontSize: '18px' }}>
                    <span style={{ color: '#d7fe03' }}>✓</span> Week-by-week execution plan
                </li>
            </ul>
        </div>
    </div>
</Section>
