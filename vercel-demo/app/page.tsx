'use client';

import { useEffect, useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { readDemoState, writeDemoState, type DemoOrder } from './demo-state';

type MenuItem = { name: string; category: string; price: number; note: string };
const menu: MenuItem[] = [
  { name: 'Chargrilled barramundi', category: 'Mains', price: 32, note: 'Lemon myrtle · greens' },
  { name: 'Roast pumpkin salad', category: 'Mains', price: 24, note: 'Wattle seed · macadamia' },
  { name: 'Chicken schnitzel', category: 'Mains', price: 29, note: 'Herb crumb · slaw' },
  { name: 'Steamed jasmine rice', category: 'Sides', price: 5, note: 'Regular bowl' },
  { name: 'Crispy potatoes', category: 'Sides', price: 9, note: 'Native pepper salt' },
  { name: 'Lemon lime bitters', category: 'Drinks', price: 7, note: 'House made' },
];
const initialTables = Array.from({ length: 30 }, (_, i) => ({
  n: i + 1,
  state: [1, 2, 4, 7, 8, 11, 15, 18, 22, 26].includes(i + 1) ? 'Seated' : [3, 12].includes(i + 1) ? 'Bill' : 'Available',
  guests: [1, 2, 4, 7, 8, 11, 15, 18, 22, 26].includes(i + 1) ? (i % 4) + 2 : 0,
  total: [1, 2, 4, 7, 8, 11, 15, 18, 22, 26].includes(i + 1) ? 36 + ((i * 17) % 106) : 0,
}));
const fmt = (n: number) => new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(n);

export default function Home() {
  const [view, setView] = useState('Floor');
  const [table, setTable] = useState(1);
  const [tables, setTables] = useState(initialTables);
  const [demoOrders, setDemoOrders] = useState<DemoOrder[]>([]);
  const [qrOpen, setQrOpen] = useState(false);
  const [cart, setCart] = useState<MenuItem[]>([]);
  const [toast, setToast] = useState('');
  const [category, setCategory] = useState('Mains');
  const [search, setSearch] = useState('');
  useEffect(() => {
    const refresh = () => {
      const demo = readDemoState();
      setDemoOrders(demo.orders.filter(order => order.table === table && order.status === 'Submitted'));
      setTables(initialTables.map(t => {
        const activeOrders = demo.orders.filter(o => o.table === t.n && o.status === 'Submitted');
        const addedTotal = activeOrders.reduce((sum, order) => sum + order.amount, 0);
        const billRequested = demo.requests.some(r => r.table === t.n && r.type === 'BILL');
        return {
          ...t,
          state: billRequested ? 'Bill' : addedTotal > 0 && t.state === 'Available' ? 'Seated' : t.state,
          guests: addedTotal > 0 ? Math.max(t.guests, 2) : t.guests,
          total: t.total + addedTotal,
        };
      }));
    };
    refresh();
    window.addEventListener('storage', refresh);
    window.addEventListener('restaurantos-demo-state-change', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('restaurantos-demo-state-change', refresh);
    };
  }, [table]);
  const total = useMemo(() => cart.reduce((n, x) => n + x.price, 0), [cart]);
  const notify = (text: string) => { setToast(text); window.setTimeout(() => setToast(''), 2600); };
  const filteredMenu = menu.filter(x => x.category === category && x.name.toLowerCase().includes(search.toLowerCase()));
  const add = (item: MenuItem) => setCart(old => [...old, item]);
  const send = () => {
    if (!cart.length) return;
    const demo = readDemoState();
    writeDemoState({
      ...demo,
      orders: [...demo.orders, {
        id: `staff-${Date.now()}`,
        table,
        items: cart.map(item => ({ name: item.name, price: item.price, note: item.note })),
        amount: total,
        createdAt: new Date().toISOString(),
        status: 'Submitted',
      }],
    });
    setCart([]); notify(`Demo order sent to kitchen · Table ${table}`);
  };
  const pay = () => {
    const demo = readDemoState();
    writeDemoState({
      orders: demo.orders.map(order => order.table === table ? { ...order, status: 'Paid' } : order),
      requests: demo.requests.filter(request => request.table !== table),
    });
    setTables(old => old.map(t => t.n === table ? { ...t, state: 'Available', guests: 0, total: 0 } : t));
    setCart([]); notify(`Demo payment recorded · Table ${table} cleared`);
  };
  const seated = tables.filter(t => t.state !== 'Available').length;
  const nav = ['Floor', 'Menu', 'Inventory', 'Reports'];

  return <main className="shell">
    <aside className="rail"><div className="brand"><span className="brand-mark">R</span><span>Restaurant<span className="brand-light">OS</span><small>AU · SYDNEY</small></span></div>
      <div className="rail-label">WORKSPACE</div>{nav.map((item, i) => <button key={item} className={`nav-item ${view === item ? 'active' : ''}`} onClick={() => setView(item)}><span className="nav-icon">{['▦','☷','◫','▥'][i]}</span>{item}</button>)}
      <div className="rail-bottom"><div className="demo-pill"><span className="pulse"/> DEMO MODE</div><div className="profile"><div className="avatar">A</div><div><strong>Alex Morgan</strong><small>Restaurant manager</small></div><span className="dots">···</span></div></div>
    </aside>
    <section className="main"><header className="topbar"><div><span className="crumb">WORKSPACE</span><span className="slash">/</span><strong>{view}</strong></div><div className="top-right"><span className="live"><i/> Demo data</span><span className="date">Sat, 7 Nov 2026</span><button className="icon-button" aria-label="Notifications">♧<b/></button></div></header>
      <div className="content"><div className="heading-row"><div><div className="eyebrow">SYDNEY · AUSTRALIA</div><h1>{view === 'Floor' ? 'Good evening, Alex' : view === 'Menu' ? 'Menu catalogue' : view === 'Inventory' ? 'Stock overview' : 'Sales snapshot'} <span className="wave">✳</span></h1><p>{view === 'Floor' ? 'Here’s what’s happening across your restaurant tonight.' : 'A live-looking preview with sample restaurant data.'}</p></div><button className="primary" onClick={() => {setView('Floor');setTable(1);notify('New demo order started for Table 1')}}>＋ <span>New order</span></button></div>
        <div className="metrics"><Metric label="TODAY'S SALES" value="$4,286" delta="↑ 12.8%" hint="vs last Saturday" icon="$" color="mint"/><Metric label="ORDERS TODAY" value="86" delta="↑ 8.2%" hint="vs last Saturday" icon="↗" color="blue"/><Metric label="TABLES IN USE" value={`${seated} / 30`} delta="33% occupied" hint="10 tables available" icon="▦" color="violet"/><Metric label="AVG. ORDER VALUE" value="$49.84" delta="↑ 4.1%" hint="vs last Saturday" icon="◎" color="amber"/></div>
        {view === 'Floor' && <div className="workspace-grid"><section className="panel floor-panel"><div className="panel-head"><div><h2>Floor plan</h2><p>Saturday dinner service <span className="tiny-dot"/> Updated just now</p></div><div className="floor-tools"><button className="soft-button" onClick={() => notify('Floor layout is sample data')}>⌗ <span>Floor 1</span>⌄</button><button className="square-button" onClick={() => notify('30 demo tables are shown')}>↻</button></div></div><div className="legend"><span><i className="legend-free"/> Available <b>{30-seated}</b></span><span><i className="legend-busy"/> Seated <b>{seated}</b></span><span><i className="legend-bill"/> Bill requested <b>{tables.filter(t=>t.state==='Bill').length}</b></span></div><div className="table-grid">{tables.map(t=><button key={t.n} onClick={()=>{setTable(t.n);setCart([])}} className={`table-card ${t.state==='Seated'?'busy':t.state==='Bill'?'bill':''} ${table===t.n?'selected':''}`}><span className="table-top"><span className="table-n">{String(t.n).padStart(2,'0')}</span><span className="table-state">{t.state==='Available'?'Open':t.state}</span></span><span className="table-bottom"><span>{t.guests ? `♙ ${t.guests} guests` : 'Seats 4'}</span><b>{t.total ? fmt(t.total) : '—'}</b></span></button>)}</div><div className="floor-foot"><span>Showing all tables · Floor 1</span><button onClick={()=>notify('Floor layout settings are part of the full system')}>Manage floor →</button></div></section>
          <section className="panel order-panel"><div className="panel-head order-head"><div><div className="eyebrow">CURRENT TABLE</div><h2>Table {String(table).padStart(2,'0')} <span className="status-chip">{tables[table-1].state==='Available'?'New order':tables[table-1].state}</span></h2><p>⌖ Floor 1 <span className="slash">·</span> {tables[table-1].guests || 2} guests</p></div><div className="qr-actions"><button className="soft-button qr-trigger" onClick={()=>setQrOpen(true)}>▦ <span>Table QR</span></button><button className="square-button" onClick={()=>notify('Table actions are simulated')}>···</button></div></div><div className="order-scroll"><div className="order-tabs">{['Mains','Sides','Drinks'].map(x=><button className={category===x?'chosen':''} onClick={()=>setCategory(x)} key={x}>{x}</button>)}</div><input className="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="⌕  Find a dish…"/><div className="dish-list">{filteredMenu.map((x,i)=><button className="dish" key={x.name} onClick={()=>add(x)}><span className={`dish-art art-${i%4}`}>{['✳','◉','✦','◌'][i%4]}</span><span className="dish-info"><strong>{x.name}</strong><small>{x.note}</small></span><b>{fmt(x.price)}</b><span className="add">＋</span></button>)}</div><div className="ticket-head"><span>Current ticket</span><span>{demoOrders.reduce((n,o)=>n+o.items.length,0)+cart.length} items <b>·</b> {fmt(tables[table-1].total+total)}</span></div>{demoOrders.map(order=><div className="guest-ticket" key={order.id}><div>{order.items.map((item,i)=><div className="ticket-item" key={`${item.name}-${i}`}><span>{item.name}<small className="ticket-note">Customer QR order{order.customerNote?` · ${order.customerNote}`:''}</small></span><b>{fmt(item.price)}</b></div>)}</div></div>)}{cart.map((x,i)=><div className="ticket-item" key={`${x.name}-${i}`}><span>{x.name}</span><b>{fmt(x.price)}</b></div>)}{cart.length===0&&demoOrders.length===0&&<div className="empty-ticket">Choose a dish or scan this table’s QR code.</div>}</div><div className="order-actions"><button className="secondary" onClick={pay}>Record demo payment</button><button className="primary send" onClick={send}>Send to kitchen <span>→</span></button></div><p className="safe-note">ⓘ Demo orders stay in this browser · no real kitchen receives them</p></section></div>}
        {view === 'Menu' && <div className="panel table-view"><div className="panel-head"><div><h2>Menu items</h2><p>Sample dishes and AUD display prices</p></div><button className="primary" onClick={()=>notify('Menu editing is simulated in this preview')}>＋ Add item</button></div><div className="table-scroll"><table><thead><tr><th>ITEM</th><th>CATEGORY</th><th>PRICE</th><th>AVAILABILITY</th></tr></thead><tbody>{menu.map(x=><tr key={x.name}><td><strong>{x.name}</strong><small>{x.note}</small></td><td>{x.category}</td><td>{fmt(x.price)}</td><td><span className="available-chip">● Available</span></td></tr>)}</tbody></table></div></div>}
        {view === 'Inventory' && <div className="panel table-view"><div className="panel-head"><div><h2>Ingredient stock</h2><p>Illustrative stock levels · units and costs need restaurant confirmation</p></div><button className="soft-button" onClick={()=>notify('Stock adjustments are not saved in demo mode')}>＋ Adjustment</button></div><div className="table-scroll"><table><thead><tr><th>INGREDIENT</th><th>ON HAND</th><th>REORDER AT</th><th>STATUS</th></tr></thead><tbody>{[['Chicken breast','18 kg','8 kg','Healthy'],['Jasmine rice','6 kg','10 kg','Reorder'],['Canola oil','14 L','5 L','Healthy'],['Baby spinach','2 kg','4 kg','Reorder'],['Barramundi fillet','9 kg','5 kg','Healthy'],['Takeaway boxes','48 each','30 each','Healthy']].map(row=><tr key={row[0]}><td><strong>{row[0]}</strong></td><td>{row[1]}</td><td>{row[2]}</td><td><span className={row[3]==='Reorder'?'reorder-chip':'available-chip'}>● {row[3]}</span></td></tr>)}</tbody></table></div></div>}
        {view === 'Reports' && <div className="report-grid"><div className="panel report-card"><div className="panel-head"><div><h2>Revenue overview</h2><p>Demo week · AUD</p></div><span className="available-chip">↑ 9.4%</span></div><div className="big-number">$24,680 <small>this week</small></div><div className="chart">{[42,55,49,74,63,87,72].map((h,i)=><div key={i} className="bar-wrap"><div className={`bar ${i===5?'today':''}`} style={{height:`${h}%`}}/><small>{['M','T','W','T','F','S','S'][i]}</small></div>)}</div></div><div className="panel report-card"><div className="panel-head"><div><h2>Popular dishes</h2><p>Sample items by order count</p></div></div>{[['Chargrilled barramundi','128'],['Chicken schnitzel','96'],['Roast pumpkin salad','74'],['Crispy potatoes','63']].map((x,i)=><div className="popular-row" key={x[0]}><span className="rank">0{i+1}</span><span>{x[0]}</span><b>{x[1]}</b></div>)}<div className="disclaimer">Revenue preview only · does not represent profit or verified accounting data.</div></div></div>}
        <div className="demo-banner"><span className="demo-icon">✳</span><span><strong>Interactive demo</strong><small>Sample data only. QR orders sync across tabs in this browser only.</small></span><button onClick={()=>notify('This is a front-end demo. Connect a backend for real operations.')}>About this demo →</button></div>
        <footer>RESTAURANTOS AU <span>·</span> SYDNEY <span className="footer-right">A demonstration build · AUD · Australia/Sydney</span></footer>
      </div>
    </section>{qrOpen&&<div className="modal-backdrop" onClick={()=>setQrOpen(false)}><section className="qr-modal" role="dialog" aria-modal="true" aria-labelledby="qr-title" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setQrOpen(false)} aria-label="Close QR code">×</button><div className="eyebrow">TABLE {String(table).padStart(2,'0')}</div><h2 id="qr-title">Scan to order</h2><p className="qr-intro">Guests can browse the sample menu and send an order from their phone.</p><div className="qr-box"><QRCodeSVG value={`https://vercel-demo-peach-six.vercel.app/table/${String(table).padStart(2,'0')}`} size={220} level="H" includeMargin fgColor="#173b30" /></div><a className="guest-link" href={`/table/${String(table).padStart(2,'0')}`} target="_blank" rel="noreferrer">Open customer ordering page ↗</a><button className="copy-link" onClick={async()=>{await navigator.clipboard.writeText(`https://vercel-demo-peach-six.vercel.app/table/${String(table).padStart(2,'0')}`);notify('Demo table link copied')}}>Copy table link</button><div className="qr-caveat">Demo QR uses a visible table number. Production QR codes need secure, rotatable tokens and a shared server session.</div></section></div>}{toast&&<div className="toast">✓ &nbsp;{toast}</div>}
  </main>;
}

function Metric({label,value,delta,hint,icon,color}:{label:string;value:string;delta:string;hint:string;icon:string;color:string}){return <div className="metric"><div className="metric-top"><span>{label}</span><span className={`metric-icon ${color}`}>{icon}</span></div><div className="metric-value">{value}</div><div className="metric-foot"><b>{delta}</b><span>{hint}</span></div></div>}
