'use client';

import { useEffect, useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowRight, BarChart3, Bell, BookOpen, Boxes, Check, ChefHat, CircleAlert, CircleDollarSign, Clock3, LayoutDashboard, Minus, Package, Plus, QrCode, Receipt, RefreshCw, Search, Sparkles, Store, Users, X } from 'lucide-react';
import { clearDemoState, readDemoState, writeDemoState, type DemoOrder } from './demo-state';
import { readLanguage, subscribeToLanguageChange, writeLanguage, type Language } from './language';
import { copy } from './copy';
import menuData from './menu-data.json';

type MenuItem = (typeof menuData)[number];
const menu: MenuItem[] = menuData;
const categories = ['TOP SELLERS', 'SPECIAL OFFER', 'BBQ MENU', 'CLAYPOT RICE', 'NOODLES', "CHEF'S PICK", 'SOUP', 'DRINKS'];
const categoryZh: Record<string, string> = { 'TOP SELLERS': '热门推荐', 'SPECIAL OFFER': '优惠套餐', 'BBQ MENU': '阳光烧腊', 'CLAYPOT RICE': '煲仔饭', NOODLES: '面类', "CHEF'S PICK": '厨师推荐', SOUP: '养生炖汤', DRINKS: '饮料' };
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
  const [category, setCategory] = useState(categories[0]);
  const [language, setLanguage] = useState<Language>('zh');
  const [search, setSearch] = useState('');
  const [menuSearch, setMenuSearch] = useState('');
  const [menuCategory, setMenuCategory] = useState('ALL');
  const [allOrders, setAllOrders] = useState<DemoOrder[]>([]);
  const [requests, setRequests] = useState<import('./demo-state').DemoRequest[]>([]);
  const [inventory, setInventory] = useState([
    { name: 'Chicken thigh', nameZh: '鸡腿肉', stock: 18, unit: 'kg', reorder: 8 },
    { name: 'Jasmine rice', nameZh: '香米', stock: 26, unit: 'kg', reorder: 10 },
    { name: 'Canola oil', nameZh: '菜籽油', stock: 14, unit: 'L', reorder: 5 },
    { name: 'Baby spinach', nameZh: '嫩菠菜', stock: 2, unit: 'kg', reorder: 4 },
    { name: 'Barramundi fillet', nameZh: '盲曹鱼片', stock: 9, unit: 'kg', reorder: 5 },
    { name: 'Takeaway boxes', nameZh: '外卖餐盒', stock: 48, unit: 'each', reorder: 30 },
  ]);
  const [inventoryReady, setInventoryReady] = useState(false);
  const tx = copy[language];
  useEffect(() => {
    const refresh = () => {
      const demo = readDemoState();
      setAllOrders(demo.orders);
      setRequests(demo.requests);
      setDemoOrders(demo.orders.filter(order => order.table === table && order.status === 'Submitted'));
      setTables(initialTables.map(t => {
        const cleared = demo.clearedTables.includes(t.n);
        const base = cleared ? { ...t, state: 'Available', guests: 0, total: 0 } : t;
        const activeOrders = demo.orders.filter(o => o.table === t.n && o.status === 'Submitted');
        const addedTotal = activeOrders.reduce((sum, order) => sum + order.amount, 0);
        const billRequested = demo.requests.some(r => r.table === t.n && r.type === 'BILL');
        return {
          ...base,
          state: billRequested ? 'Bill' : addedTotal > 0 && base.state === 'Available' ? 'Seated' : base.state,
          guests: addedTotal > 0 ? Math.max(base.guests, 2) : base.guests,
          total: base.total + addedTotal,
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
  useEffect(() => {
    const sync = () => setLanguage(readLanguage());
    sync();
    return subscribeToLanguageChange(sync);
  }, []);
  useEffect(() => { document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en-AU'; }, [language]);
  useEffect(() => {
    try {
      const saved = localStorage.getItem('restaurantos-demo-inventory');
      if (saved) setInventory(JSON.parse(saved));
    } catch { /* keep sample inventory */ }
    setInventoryReady(true);
  }, []);
  useEffect(() => { if (inventoryReady) localStorage.setItem('restaurantos-demo-inventory', JSON.stringify(inventory)); }, [inventory, inventoryReady]);
  const total = useMemo(() => cart.reduce((n, x) => n + x.price, 0), [cart]);
  const notify = (text: string) => { setToast(text); window.setTimeout(() => setToast(''), 2600); };
  const filteredMenu = menu.filter(x => x.category === category && `${x.name} ${x.nameZh}`.toLowerCase().includes(search.toLowerCase()));
  const catalogMenu = menu.filter(x => (menuCategory === 'ALL' || x.category === menuCategory) && `${x.name} ${x.nameZh}`.toLowerCase().includes(menuSearch.toLowerCase()));
  const add = (item: MenuItem) => setCart(old => [...old, item]);
  const send = () => {
    if (!cart.length) return;
    const demo = readDemoState();
    writeDemoState({
      ...demo,
      clearedTables: demo.clearedTables.filter(n => n !== table),
      orders: [...demo.orders, {
        id: `staff-${Date.now()}`,
        table,
        items: cart.map(item => ({ name: item.name, nameZh: item.nameZh, price: item.price })),
        amount: total,
        createdAt: new Date().toISOString(),
        status: 'Submitted',
      }],
    });
    setCart([]); notify(tx.orderSent);
  };
  const pay = (tableToClear = table) => {
    const demo = readDemoState();
    writeDemoState({
      ...demo,
      orders: demo.orders.map(order => order.table === tableToClear ? { ...order, status: 'Paid' } : order),
      requests: demo.requests.filter(request => request.table !== tableToClear),
      clearedTables: [...new Set([...demo.clearedTables, tableToClear])],
    });
    setCart([]); notify(tx.paid);
  };
  const startOrder = () => {
    const next = tables.find(t => t.state === 'Available')?.n ?? table;
    setView('Floor'); setTable(next); setCart([]); setCategory(categories[0]); setSearch('');
    notify(`${tx.table} ${String(next).padStart(2, '0')}`);
  };
  const chooseTable = (next: number) => { setTable(next); setCart([]); setCategory(categories[0]); setSearch(''); };
  const handleRequest = (request: import('./demo-state').DemoRequest) => {
    if (request.type === 'BILL') { pay(request.table); return; }
    const demo = readDemoState();
    writeDemoState({ ...demo, requests: demo.requests.filter(item => !(item.table === request.table && item.type === request.type)) });
    notify(tx.handled);
  };
  const changeStock = (index: number, delta: number) => setInventory(items => items.map((item, i) => i === index ? { ...item, stock: Math.max(0, Math.round((item.stock + delta) * 10) / 10) } : item));
  const seated = tables.filter(t => t.state !== 'Available').length;
  const activeOrderCount = allOrders.filter(order => order.status === 'Submitted').length;
  const sampleSales = 4286 + allOrders.filter(order => order.status === 'Paid').reduce((sum, order) => sum + order.amount, 0);
  const nav = [
    { id: 'Floor', label: tx.floor, Icon: LayoutDashboard },
    { id: 'Menu', label: tx.menu, Icon: BookOpen },
    { id: 'Inventory', label: tx.inventory, Icon: Boxes },
    { id: 'Reports', label: tx.reports, Icon: BarChart3 },
  ];
  const tableState = (state: string) => state === 'Available' ? tx.available : state === 'Bill' ? tx.bill : tx.seated;
  const categoryLabel = (name: string) => language === 'zh' ? categoryZh[name] : ({ 'TOP SELLERS':'Top sellers', 'SPECIAL OFFER':'Special offers', 'BBQ MENU':'BBQ', 'CLAYPOT RICE':'Clay pot rice', NOODLES:'Noodles', "CHEF'S PICK":'Chef’s picks', SOUP:'Soup', DRINKS:'Drinks' } as Record<string,string>)[name] ?? name;
  const title = view === 'Floor' ? tx.greeting : view === 'Menu' ? tx.menuTitle : view === 'Inventory' ? tx.stockTitle : tx.reportsTitle;

  return <main className="shell">
    <aside className="rail polished-rail"><a className="brand" href="/" aria-label="RestaurantOS"><span className="brand-mark"><Store size={18}/></span><span>RestaurantOS<small>ORDERING DEMO</small></span></a>
      <div className="rail-label">{tx.workspace}</div>{nav.map(({id,label,Icon}) => <button key={id} className={`nav-item ${view === id ? 'active' : ''}`} onClick={() => setView(id)}><Icon size={17}/><span>{label}</span></button>)}
      <div className="rail-bottom"><div className="demo-pill"><span className="pulse"/> {tx.demo}</div><div className="profile"><div className="avatar">A</div><div><strong>Alex Morgan</strong><small>{tx.manager}</small></div></div></div>
    </aside>
    <section className="main polished-main"><header className="topbar polished-topbar"><div><span className="crumb">{tx.workspace}</span><span className="slash">/</span><strong>{nav.find(item=>item.id===view)?.label}</strong></div><div className="top-right"><span className="live"><i/>{tx.demoData}</span><button className="language-switch" onClick={() => writeLanguage(language === 'en' ? 'zh' : 'en')}>{tx.language}</button></div></header>
      <div className="content polished-content"><div className="heading-row polished-heading"><div><div className="eyebrow">{tx.region}</div><h1>{title}<span className="wave">✳</span></h1><p>{view === 'Floor' ? tx.overview : view === 'Menu' ? tx.menuNote : view === 'Inventory' ? tx.stockHint : tx.sampleAUD}</p></div><button className="primary" onClick={startOrder}><Plus size={16}/><span>{tx.newOrder}</span></button></div>
        <div className="metrics polished-metrics"><Metric label={tx.sales} value={fmt(sampleSales)} hint={tx.sample} icon={CircleDollarSign} color="coral"/><Metric label={tx.orders} value={String(86 + allOrders.length)} hint={`${allOrders.length} ${tx.browserOrders}`} icon={Receipt} color="blue"/><Metric label={tx.tables} value={`${seated} / 30`} hint={tx.occupied} icon={Users} color="green"/><Metric label={tx.calls} value={String(requests.length)} hint={tx.waiting} icon={Bell} color="amber"/></div>
        {requests.length > 0 && <section className="panel requests-panel"><div className="panel-head"><div><span className="section-kicker"><Bell size={14}/>{tx.requests}</span><p>{requests.length} {language === 'zh' ? '个待处理' : 'open'}</p></div><span className="request-pulse"><CircleAlert size={15}/>{language === 'zh' ? '需要处理' : 'Needs attention'}</span></div><div className="request-list">{requests.map(request => <div className="request-row" key={`${request.table}-${request.type}`}><span className="request-icon">{request.type === 'BILL' ? <Receipt size={17}/> : <Bell size={17}/>}</span><div className="request-copy"><strong>{tx.table} {String(request.table).padStart(2, '0')} · {request.type === 'BILL' ? tx.billRequest : tx.call}</strong><small><Clock3 size={12}/>{new Intl.DateTimeFormat(language === 'zh' ? 'zh-AU' : 'en-AU', { hour:'2-digit', minute:'2-digit' }).format(new Date(request.createdAt))}</small></div><button className="request-action" onClick={() => request.type === 'BILL' ? pay(request.table) : handleRequest(request)}>{request.type === 'BILL' ? tx.payBill : tx.handle}<ArrowRight size={14}/></button></div>)}</div></section>}
        {view === 'Floor' && <div className="workspace-grid"><section className="panel floor-panel"><div className="panel-head"><div><span className="section-kicker"><LayoutDashboard size={14}/>{tx.floorPlan}</span><p>{tx.service}<span className="tiny-dot"/>{tx.updates}</p></div><div className="floor-tools"><button className="soft-button" onClick={() => notify(tx.floorPlan)}><Store size={14}/> <span>{tx.allTables}</span></button><button className="square-button" onClick={() => notify(tx.demoData)}><RefreshCw size={14}/></button></div></div><div className="legend"><span><i className="legend-free"/> {tx.available} <b>{tables.filter(t=>t.state==='Available').length}</b></span><span><i className="legend-busy"/> {tx.seated} <b>{tables.filter(t=>t.state==='Seated').length}</b></span><span><i className="legend-bill"/> {tx.bill} <b>{tables.filter(t=>t.state==='Bill').length}</b></span></div><div className="table-grid">{tables.map(t=><button key={t.n} onClick={()=>chooseTable(t.n)} className={`table-card ${t.state==='Seated'?'busy':t.state==='Bill'?'bill':''} ${table===t.n?'selected':''}`}><span className="table-top"><span className="table-n">{String(t.n).padStart(2,'0')}</span><span className="table-state">{tableState(t.state)}</span></span><span className="table-bottom"><span>{t.guests ? <><Users size={12}/> {t.guests} {tx.guests}</> : tx.seats}</span><b>{t.total ? fmt(t.total) : '—'}</b></span></button>)}</div><div className="floor-foot"><span>{tx.allTables} · {language==='zh'?'选择桌台后即可录入订单':'Choose a table to start an order'}</span><span className="floor-foot-state"><span className="pulse"/>{tx.demoData}</span></div></section>
          <section className="panel order-panel"><div className="panel-head order-head"><div><span className="section-kicker"><ChefHat size={14}/>{tx.currentTable}</span><h2>{tx.table} {String(table).padStart(2,'0')} <span className="status-chip">{tableState(tables[table-1].state)}</span></h2><p><Users size={12}/>{tables[table-1].guests || 2} {tx.guests}</p></div><div className="qr-actions"><button className="soft-button qr-trigger" onClick={()=>setQrOpen(true)}><QrCode size={15}/><span>{tx.qr}</span></button><button className="square-button" onClick={()=>notify('Table actions are simulated')}>···</button></div></div><div className="order-scroll"><div className="order-tabs">{categories.map(x=><button className={category===x?'chosen':''} onClick={()=>setCategory(x)} key={x}>{categoryLabel(x)}</button>)}</div><input className="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder={tx.searchDish}/><div className="dish-list">{filteredMenu.map((x,i)=><button className="dish" key={x.name} onClick={()=>add(x)}><img className="dish-thumbnail" src={x.image} alt=""/><span className="dish-info"><strong>{language==='zh'?x.nameZh:x.name}</strong><small>{language==='zh'?x.name:x.nameZh}</small></span><b>{fmt(x.price)}</b><span className="add">＋</span></button>)}</div><div className="ticket-head"><span>{tx.ticket}</span><span>{demoOrders.reduce((n,o)=>n+o.items.length,0)+cart.length} {tx.items} <b>·</b> {fmt(tables[table-1].total+total)}</span></div>{demoOrders.map(order=><div className="guest-ticket" key={order.id}><div>{order.items.map((item,i)=><div className="ticket-item" key={`${item.name}-${i}`}><span>{language==='zh'?(item.nameZh||item.name):item.name}<small className="ticket-note">{language==='zh'?'扫码订单':'QR table order'}{order.customerNote?` · ${order.customerNote}`:''}</small></span><b>{fmt(item.price)}</b></div>)}</div></div>)}{cart.map((x,i)=><div className="ticket-item" key={`${x.name}-${i}`}><span>{language==='zh'?x.nameZh:x.name}</span><b>{fmt(x.price)}</b></div>)}{cart.length===0&&demoOrders.length===0&&<div className="empty-ticket">{tx.addHint}</div>}</div><div className="order-actions"><button className="secondary" onClick={()=>pay()} disabled={!tables[table-1].total&&!cart.length}>{tx.pay}</button><button className="primary send" onClick={send} disabled={!cart.length}>{tx.send}<ArrowRight size={15}/></button></div><p className="safe-note">ⓘ {tx.localOnly}</p></section></div>}
        {view === 'Menu' && <section className="panel table-view polished-view"><div className="panel-head"><div><span className="section-kicker"><BookOpen size={14}/>{tx.menuTitle}</span><p>{menu.length} {tx.itemCount} · {tx.menuNote}</p></div><span className="catalog-total"><span className="pulse"/>{language==='zh'?'菜单快照':'Menu snapshot'}</span></div><div className="catalog-tools"><label className="search polished-search"><Search size={15}/><input value={menuSearch} onChange={e=>setMenuSearch(e.target.value)} placeholder={tx.menuSearch}/></label><select value={menuCategory} onChange={e=>setMenuCategory(e.target.value)} aria-label={tx.category}><option value="ALL">{tx.allCategories}</option>{categories.map(name=><option key={name} value={name}>{categoryLabel(name)}</option>)}</select></div><div className="table-scroll"><table className="catalog-table"><thead><tr><th>{tx.dish}</th><th>{tx.category}</th><th>{tx.price}</th><th>{tx.status}</th></tr></thead><tbody>{catalogMenu.map(item=><tr key={item.name}><td><span className="catalog-dish"><img src={item.image} alt=""/><span><strong>{language==='zh'?item.nameZh:item.name}</strong><small>{language==='zh'?item.name:item.nameZh}</small></span></span></td><td>{language==='zh'?categoryZh[item.category]:categoryLabel(item.category)}</td><td><strong>{fmt(item.price)}</strong></td><td><span className="available-chip"><Check size={12}/>{tx.inStock}</span></td></tr>)}</tbody></table>{catalogMenu.length===0&&<div className="empty-catalog">{tx.noMatch}</div>}</div></section>}
        {view === 'Inventory' && <section className="panel table-view polished-view"><div className="panel-head"><div><span className="section-kicker"><Package size={14}/>{tx.stock}</span><p>{tx.stockHint}</p></div><span className="catalog-total"><span className="pulse"/>{language==='zh'?'本地演示数据':'Local demo data'}</span></div><div className="table-scroll"><table className="catalog-table inventory-table"><thead><tr><th>{tx.ingredient}</th><th>{tx.onHand}</th><th>{tx.reorderAt}</th><th>{tx.status}</th><th>{language==='zh'?'调整':'ADJUST'}</th></tr></thead><tbody>{inventory.map((item,index)=>{const low=item.stock<=item.reorder;return <tr key={item.name}><td><span className="ingredient-name"><span className="ingredient-icon"><Package size={15}/></span><span><strong>{language==='zh'?item.nameZh:item.name}</strong><small>{language==='zh'?item.name:item.nameZh}</small></span></span></td><td><strong>{item.stock} {item.unit}</strong></td><td>{item.reorder} {item.unit}</td><td><span className={low?'reorder-chip':'available-chip'}>{low?<CircleAlert size={12}/>:<Check size={12}/>} {low?tx.reorder:tx.healthy}</span></td><td><div className="stock-controls"><button onClick={()=>{changeStock(index,-1);notify(tx.stockSaved)}} aria-label={tx.less}><Minus size={14}/></button><button onClick={()=>{changeStock(index,1);notify(tx.stockSaved)}} aria-label={tx.more}><Plus size={14}/></button></div></td></tr>})}</tbody></table></div></section>}
        {view === 'Reports' && <div className="report-grid polished-reports"><section className="panel report-card polished-report-card"><div className="panel-head"><div><span className="section-kicker"><BarChart3 size={14}/>{tx.sampleWeek}</span><p>{tx.sampleAUD}</p></div><span className="available-chip"><Sparkles size={12}/>{tx.sample}</span></div><div className="big-number">$24,680 <small>{tx.thisWeek}</small></div><div className="chart">{[42,55,49,74,63,87,72].map((height,i)=><div key={i} className="bar-wrap"><div className={`bar ${i===5?'today':''}`} style={{height:`${height}%`}}/><small>{language==='zh'?['一','二','三','四','五','六','日'][i]:['M','T','W','T','F','S','S'][i]}</small></div>)}</div></section><section className="panel report-card polished-report-card"><div className="panel-head"><div><span className="section-kicker"><ChefHat size={14}/>{tx.popular}</span><p>{tx.menuNote}</p></div></div>{menu.slice(0,5).map((item,i)=><div className="popular-row" key={item.name}><span className="rank">0{i+1}</span><span>{language==='zh'?item.nameZh:item.name}</span><b>{fmt(item.price)}</b></div>)}<div className="disclaimer">{tx.reportNote}</div></section><section className="panel report-summary"><div><Receipt size={18}/><span>{tx.orders}</span><strong>{activeOrderCount}</strong><small>{allOrders.length} {tx.browserOrders}</small></div><div><Bell size={18}/><span>{tx.requests}</span><strong>{requests.length}</strong><small>{tx.waiting}</small></div></section></div>}
        <div className="demo-banner polished-demo-banner"><span className="demo-icon"><Sparkles size={16}/></span><span><strong>{tx.interactive}</strong><small>{tx.demoDescription}</small></span><button className="reset-demo" onClick={()=>{clearDemoState();setCart([]);setInventory([{name:'Chicken thigh',nameZh:'鸡腿肉',stock:18,unit:'kg',reorder:8},{name:'Jasmine rice',nameZh:'香米',stock:26,unit:'kg',reorder:10},{name:'Canola oil',nameZh:'菜籽油',stock:14,unit:'L',reorder:5},{name:'Baby spinach',nameZh:'嫩菠菜',stock:2,unit:'kg',reorder:4},{name:'Barramundi fillet',nameZh:'盲曹鱼片',stock:9,unit:'kg',reorder:5},{name:'Takeaway boxes',nameZh:'外卖餐盒',stock:48,unit:'each',reorder:30}]);notify(tx.resetDone)}}><RefreshCw size={13}/>{tx.reset}</button></div>
        <footer>RESTAURANTOS <span>·</span> {language === 'zh' ? '互动演示' : 'INTERACTIVE DEMO'} <span className="footer-right">{tx.footer}</span></footer>
      </div>
    </section>{qrOpen&&<div className="modal-backdrop" onClick={()=>setQrOpen(false)}><section className="qr-modal polished-modal" role="dialog" aria-modal="true" aria-labelledby="qr-title" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setQrOpen(false)} aria-label={tx.close}><X size={18}/></button><div className="qr-modal-icon"><QrCode size={19}/></div><div className="eyebrow">{tx.table.toUpperCase()} {String(table).padStart(2,'0')}</div><h2 id="qr-title">{tx.qr}</h2><p className="qr-intro">{tx.qrHelp}</p><div className="qr-box"><QRCodeSVG value={`https://vercel-demo-peach-six.vercel.app/table/${String(table).padStart(2,'0')}`} size={220} level="H" includeMargin fgColor="#173b30" /></div><a className="guest-link" href={`/table/${String(table).padStart(2,'0')}`} target="_blank" rel="noreferrer">{tx.openOrder}<ArrowRight size={14}/></a><button className="copy-link" onClick={async()=>{await navigator.clipboard.writeText(`https://vercel-demo-peach-six.vercel.app/table/${String(table).padStart(2,'0')}`);notify(tx.copied)}}>{tx.copyLink}</button><div className="qr-caveat">{tx.localOnly}</div></section></div>}{toast&&<div className="toast">✓ &nbsp;{toast}</div>}
  </main>;
}

function Metric({label,value,hint,icon:Icon,color}:{label:string;value:string;hint:string;icon:React.ComponentType<{size?:number}>;color:string}){return <div className="metric polished-metric"><div className="metric-top"><span>{label}</span><span className={`metric-icon ${color}`}><Icon size={17}/></span></div><div className="metric-value">{value}</div><div className="metric-foot"><span>{hint}</span></div></div>}

