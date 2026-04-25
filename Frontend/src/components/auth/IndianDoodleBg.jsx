import React, { useEffect, useState } from 'react';

const IndianDoodleBg = () => {
    const [isDark, setIsDark] = useState(
        () => document.documentElement.getAttribute('data-theme') === 'dark' || document.body.classList.contains('dark')
    );

    useEffect(() => {
        const obs = new MutationObserver(() =>
            setIsDark(
                document.documentElement.getAttribute('data-theme') === 'dark' ||
                document.body.classList.contains('dark')
            )
        );
        obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        return () => obs.disconnect();
    }, []);

    const c = isDark ? 'rgba(255,255,255,0.17)' : 'rgba(0,0,0,0.10)';
    const q = { stroke: c, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '1.5' };

    // ── Doodle shapes ── each drawn in a ~40x40 native box, scaled up via slot
    const shapes = {
        chai:       <g {...q}><path d="M4 5 Q4 1 8 1 L26 1 Q30 1 30 5 L28 27 Q28 29 26 29 L8 29 Q6 29 6 27Z"/><path d="M30 10 Q37 10 37 17 Q37 24 30 24"/><path d="M10 1 Q12 -4 17 -4 Q22 -4 24 1" strokeDasharray="2 2"/><path d="M12 8 Q17 13 22 8"/></g>,
        auto:       <g {...q}><rect x="0" y="9" width="52" height="21" rx="4"/><path d="M0 13 L11 3 L41 3 L52 13"/><circle cx="11" cy="32" r="6"/><circle cx="41" cy="32" r="6"/><rect x="13" y="11" width="11" height="9" rx="2"/><rect x="27" y="11" width="11" height="9" rx="2"/><line x1="52" y1="15" x2="59" y2="15"/><line x1="59" y1="10" x2="59" y2="23"/></g>,
        tajmahal:   <g {...q}><path d="M28 42 L28 21 Q28 4 19 4 Q10 4 10 21 L10 42"/><path d="M19 4 L19 0"/><circle cx="19" cy="-1" r="2"/><rect x="1" y="21" width="6" height="21" rx="1"/><path d="M4 21 L4 15"/><circle cx="4" cy="13" r="1.5"/><rect x="31" y="21" width="6" height="21" rx="1"/><path d="M34 21 L34 15"/><circle cx="34" cy="13" r="1.5"/><rect x="1" y="40" width="36" height="4" rx="1"/><path d="M13 42 Q19 35 25 42"/><path d="M3 42 Q6 38 9 42"/><path d="M29 42 Q32 38 35 42"/></g>,
        fort:       <g {...q}><rect x="0" y="16" width="64" height="20" rx="2"/><rect x="2" y="9" width="8" height="9" rx="1"/><rect x="14" y="9" width="8" height="9" rx="1"/><rect x="28" y="9" width="8" height="9" rx="1"/><rect x="42" y="9" width="8" height="9" rx="1"/><rect x="54" y="9" width="8" height="9" rx="1"/><path d="M23 36 L23 27 Q32 20 41 27 L41 36"/><path d="M5 24 Q9 20 13 24"/><path d="M49 24 Q53 20 57 24"/><line x1="0" y1="36" x2="64" y2="36"/></g>,
        peacock:    <g {...q}><ellipse cx="13" cy="26" rx="6" ry="10"/><path d="M13 16 Q13 7 17 3"/><circle cx="18" cy="2" r="2.5"/><path d="M18 0 Q20 -3 18 -5"/><path d="M18 0 Q22 -2 21 -5"/><path d="M19 24 Q29 13 37 17"/><path d="M19 28 Q31 22 39 24"/><path d="M19 32 Q29 32 37 34"/><circle cx="37" cy="17" r="2"/><circle cx="39" cy="24" r="2"/><circle cx="37" cy="34" r="2"/><line x1="9" y1="36" x2="7" y2="46"/><line x1="17" y1="36" x2="19" y2="46"/></g>,
        elephant:   <g {...q}><ellipse cx="28" cy="28" rx="20" ry="16"/><circle cx="11" cy="19" r="12"/><path d="M2 24 Q-5 32 -3 41 Q-1 47 4 45"/><path d="M3 11 Q-5 7 -7 18 Q-5 26 3 24"/><circle cx="7" cy="15" r="1.5" fill={c} stroke="none"/><path d="M2 26 Q-3 30 -1 36"/><rect x="13" y="41" width="7" height="12" rx="3"/><rect x="24" y="41" width="7" height="12" rx="3"/><rect x="35" y="41" width="7" height="12" rx="3"/><path d="M48 26 Q55 24 55 31"/></g>,
        kite:       <g {...q}><path d="M17 0 L34 19 L17 40 L0 19Z"/><line x1="17" y1="0" x2="17" y2="40"/><line x1="0" y1="19" x2="34" y2="19"/><path d="M17 40 Q21 49 19 58 Q23 64 21 72" strokeDasharray="3 3"/><path d="M13 49 Q17 47 21 49"/></g>,
        rangoli:    <g {...q} strokeWidth="1.3"><circle cx="19" cy="19" r="17"/><circle cx="19" cy="19" r="10"/><circle cx="19" cy="19" r="4"/>{[0,45,90,135,180,225,270,315].map((d,i)=>{const r=d*Math.PI/180;return<line key={i} x1={19+10*Math.cos(r)} y1={19+10*Math.sin(r)} x2={19+17*Math.cos(r)} y2={19+17*Math.sin(r)}/>})}{[22.5,67.5,112.5,157.5,202.5,247.5,292.5,337.5].map((d,i)=>{const r=d*Math.PI/180;return<circle key={i} cx={19+13*Math.cos(r)} cy={19+13*Math.sin(r)} r="1.8"/>})}</g>,
        bicycle:    <g {...q}><circle cx="13" cy="22" r="12"/><circle cx="49" cy="22" r="12"/><path d="M13 22 L26 7 L49 22"/><path d="M26 7 L30 22"/><line x1="20" y1="7" x2="30" y2="7"/><path d="M30 7 Q36 3 40 7"/></g>,
        coconut:    <g {...q}><path d="M17 55 Q15 36 13 17 Q11 7 17 0"/><path d="M17 17 Q6 11 0 17 Q6 13 17 17"/><path d="M17 17 Q28 11 36 17 Q28 13 17 17"/><path d="M17 25 Q7 15 2 21 Q7 17 17 25"/><path d="M17 25 Q27 15 32 21 Q27 17 17 25"/><circle cx="15" cy="19" r="2.5"/><circle cx="19" cy="21" r="2.5"/></g>,
        diya:       <g {...q}><path d="M0 15 Q0 6 12 6 Q18 6 22 11 Q26 6 36 6 Q48 6 48 15 Q48 24 22 26 Q0 24 0 15Z"/><path d="M22 6 Q22 0 24 -4 Q22 -8 20 -4 Q22 0 22 6"/><ellipse cx="22" cy="2" rx="2.5" ry="3.5"/></g>,
        tabla:      <g {...q}><ellipse cx="17" cy="7" rx="15" ry="5.5"/><ellipse cx="17" cy="7" rx="9" ry="3.5"/><line x1="2" y1="7" x2="2" y2="34"/><line x1="32" y1="7" x2="32" y2="34"/><path d="M2 34 Q17 40 32 34"/><line x1="5" y1="11" x2="5" y2="30" strokeDasharray="2 3"/><line x1="29" y1="11" x2="29" y2="30" strokeDasharray="2 3"/></g>,
        cricket:    <g {...q}><path d="M5 0 L10 0 L14 28 L10 33 L5 33 L1 28Z"/><rect x="3" y="33" width="9" height="9" rx="2"/><circle cx="28" cy="11" r="7"/><path d="M22 11 Q28 6 34 11"/><path d="M22 11 Q28 16 34 11"/></g>,
        mango:      <g {...q}><path d="M11 28 Q0 19 3 7 Q7 0 17 2 Q27 0 31 7 Q35 19 23 28 Q17 34 11 28Z"/><path d="M17 2 Q17 -4 21 -8"/><path d="M7 11 Q12 15 17 11"/></g>,
        samosa:     <g {...q}><path d="M0 30 L15 0 L30 30Z"/><path d="M5 23 Q15 15 25 23"/><circle cx="15" cy="18" r="2.5"/><circle cx="9" cy="25" r="1.5"/><circle cx="21" cy="25" r="1.5"/></g>,
        lotus:      <g {...q}><ellipse cx="17" cy="19" rx="5" ry="10"/><ellipse cx="17" cy="19" rx="5" ry="10" transform="rotate(45 17 19)"/><ellipse cx="17" cy="19" rx="5" ry="10" transform="rotate(90 17 19)"/><ellipse cx="17" cy="19" rx="5" ry="10" transform="rotate(135 17 19)"/><circle cx="17" cy="19" r="4"/></g>,
        rupee:      <g {...q} strokeWidth="2"><line x1="3" y1="4" x2="22" y2="4"/><line x1="3" y1="11" x2="22" y2="11"/><path d="M3 4 L3 28 L19 11"/></g>,
        om:         <g {...q}><path d="M7 21 Q2 21 2 13 Q2 5 9 5 Q17 5 17 13 Q17 19 11 21 Q17 21 21 17 Q25 13 21 7"/><path d="M21 7 Q27 1 27 9 Q27 17 19 23"/><path d="M19 23 Q15 29 19 33"/><path d="M23 3 Q27 -1 29 3"/><path d="M25 1 L25 -3"/></g>,
        chakra:     <g {...q} strokeWidth="1.3"><circle cx="15" cy="15" r="13"/><circle cx="15" cy="15" r="4"/>{[0,30,60,90,120,150,180,210,240,270,300,330].map((d,i)=>{const r=d*Math.PI/180;return<line key={i} x1={15+4*Math.cos(r)} y1={15+4*Math.sin(r)} x2={15+13*Math.cos(r)} y2={15+13*Math.sin(r)}/>})}</g>,
        turban:     <g {...q}><path d="M3 21 Q3 5 19 3 Q35 5 35 21"/><path d="M3 21 Q19 25 35 21"/><path d="M7 17 Q19 21 31 17"/><path d="M9 13 Q19 17 29 13"/><path d="M11 9 Q19 13 27 9"/><path d="M35 21 Q39 17 37 11 Q35 7 31 9"/><circle cx="19" cy="3" r="2.5"/></g>,
        phone:      <g {...q}><rect x="0" y="0" width="26" height="46" rx="5"/><line x1="8" y1="4" x2="18" y2="4"/><circle cx="13" cy="42" r="2"/><rect x="3" y="8" width="20" height="29" rx="2"/></g>,
        bullock:    <g {...q}><rect x="13" y="7" width="40" height="18" rx="3"/><circle cx="18" cy="29" r="9"/><circle cx="47" cy="29" r="9"/><line x1="13" y1="14" x2="0" y2="10"/><line x1="13" y1="18" x2="0" y2="22"/><path d="M0 10 Q-7 12 -7 16 Q-7 20 0 22"/></g>,
        flower:     <g {...q} strokeWidth="1.3">{[0,60,120,180,240,300].map((d,i)=>{const r=d*Math.PI/180;return<ellipse key={i} cx={13+7*Math.cos(r)} cy={13+7*Math.sin(r)} rx="3.5" ry="6.5" transform={`rotate(${d} ${13+7*Math.cos(r)} ${13+7*Math.sin(r)})`}/>})}<circle cx="13" cy="13" r="4.5"/></g>,
        star:       <g {...q}><path d="M11 0 L13 8 L21 8 L15 13 L17 21 L11 16 L5 21 L7 13 L1 8 L9 8Z"/></g>,
        bag:        <g {...q}><rect x="3" y="13" width="34" height="28" rx="4"/><path d="M11 13 Q11 3 20 3 Q29 3 29 13"/><line x1="13" y1="22" x2="27" y2="22"/></g>,
        birds:      <g {...q} strokeWidth="1.2"><path d="M0 5 Q5 0 10 5 Q15 0 20 5"/><path d="M23 3 Q27 -1 31 3 Q35 -1 39 3"/><path d="M42 6 Q45 2 48 6"/></g>,
        envelope:   <g {...q}><rect x="0" y="0" width="42" height="28" rx="3"/><path d="M0 0 L21 17 L42 0"/><path d="M0 28 L15 15"/><path d="M42 28 L27 15"/></g>,
        star4:      <g {...q} strokeWidth="1.4"><path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8Z"/></g>,
        paisley:    <g {...q}><path d="M9 28 Q-2 19 2 7 Q6 0 13 3 Q21 7 19 17 Q17 25 9 28Z"/><path d="M9 28 Q15 26 17 20 Q19 14 13 10"/><circle cx="11" cy="9" r="2"/></g>,
        umbrella:   <g {...q}><path d="M19 3 Q2 3 2 19 Q2 34 19 34 Q36 34 36 19 Q36 3 19 3Z"/><path d="M2 19 Q19 13 36 19"/><line x1="19" y1="34" x2="19" y2="49"/><path d="M19 49 Q13 49 13 43"/></g>,
        firecracker:<g {...q}><rect x="5" y="9" width="11" height="20" rx="3"/><path d="M10 9 L10 3"/><path d="M10 3 Q14 -1 12 -4"/><circle cx="10" cy="3" r="1.5"/><line x1="0" y1="18" x2="5" y2="18"/><line x1="16" y1="18" x2="21" y2="18"/></g>,
        veena:      <g {...q}><ellipse cx="9" cy="34" rx="8" ry="9"/><path d="M9 25 Q11 9 17 0"/><path d="M17 0 L26 3"/><line x1="9" y1="9" x2="24" y2="5" strokeDasharray="2 2"/><line x1="9" y1="15" x2="24" y2="11" strokeDasharray="2 2"/></g>,
        kolam:      <g {...q} strokeWidth="1.2"><circle cx="15" cy="15" r="13"/><circle cx="15" cy="15" r="7"/><path d="M15 2 Q20 8 15 15 Q10 8 15 2"/><path d="M28 15 Q22 20 15 15 Q22 10 28 15"/><path d="M15 28 Q10 22 15 15 Q20 22 15 28"/><path d="M2 15 Q8 10 15 15 Q8 20 2 15"/></g>,
    };

    const keys = Object.keys(shapes);

    // ── Slot-based honeycomb layout ──────────────────────────────────────────
    // Cell size: 130x120. Each even row offset by 65px.
    // Tile: 780x720 (6 cols × 6 rows = 36 slots per tile)
    // Each doodle drawn in ~40x40 native space → scale 2.6 → ~104px rendered
    // Leaving ~26px gap on each side = no overlap guaranteed.

    const COLS = 6;
    const ROWS = 6;
    const CW = 130;   // cell width
    const CH = 120;   // cell height
    const TW = COLS * CW;   // 780
    const TH = ROWS * CH;   // 720
    const SC = 2.6;          // scale — renders doodle at ~104px in a 130px cell

    // Deterministic sequence — cycle through all doodle types
    const seq = [
        'tajmahal','auto','peacock','rangoli','elephant','kite',
        'fort','bicycle','coconut','diya','tabla','cricket',
        'mango','samosa','lotus','rupee','om','chakra',
        'turban','phone','bullock','flower','star','bag',
        'birds','envelope','star4','paisley','umbrella','firecracker',
        'veena','kolam','chai','mango','samosa','lotus',
    ];

    const slots = [];
    let idx = 0;
    for (let row = 0; row < ROWS; row++) {
        const xOffset = (row % 2 === 1) ? CW / 2 : 0; // honeycomb offset
        for (let col = 0; col < COLS; col++) {
            const cx = col * CW + xOffset + CW / 2;  // center x of cell
            const cy = row * CH + CH / 2;              // center y of cell
            const key = seq[idx % seq.length];
            // translate so doodle center (~20,20 in native) lands on cell center
            const tx = cx - 20 * SC;
            const ty = cy - 20 * SC;
            slots.push({ key, tx, ty });
            idx++;
        }
    }

    return (
        <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
            <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
                <defs>
                    <pattern id="doodle-tile" x="0" y="0" width={TW} height={TH} patternUnits="userSpaceOnUse">
                        {slots.map(({ key, tx, ty }, i) => (
                            <g key={i} transform={`translate(${tx},${ty}) scale(${SC})`}>
                                {shapes[key]}
                            </g>
                        ))}
                        {/* packaging-style corner folds */}
                        <path d={`M${TW-28} ${TH} L${TW} ${TH} L${TW} ${TH-28}`} stroke={c} fill="none" strokeWidth="1" strokeDasharray="4 3"/>
                        <path d={`M0 28 L0 0 L28 0`} stroke={c} fill="none" strokeWidth="1" strokeDasharray="4 3"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#doodle-tile)"/>
            </svg>
        </div>
    );
};

export default IndianDoodleBg;
