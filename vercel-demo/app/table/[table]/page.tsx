'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { readDemoState, writeDemoState, type DemoOrder } from '../../demo-state';

type MenuItem = { name: string; category: string; price: number; note: string };
const menu: MenuItem[] = [
  { name: 'Chargrilled barramundi', category: 'Mains', price: 32, note: 'Lemon myrtle · greens' },
  { name: 'Roast pumpkin salad', category: 'Mains', price: 24, note: 'Wattle seed · macadamia' },
  { name: 'Chicken schnitzel', category: 'Mains', price: 29, note: 'Herb crumb · slaw' },
  { name: 'Steamed jasmine rice', category: 'Sides', price: 5, note: 'Regular bowl' },
  { name: 'Crispy potatoes', category: 'Sides', price: 9, note: 'Native pepper salt' },
  { name: 'Lemon lime bitters', category: 'Drinks', price: 7, note: 'House made' },
];
const money = (n: number) => new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(n);

export default function CustomerTablePage() {
  const params = useParams<{ table: string }>();
  const table = Math.max(1, Math.min(30, Number.parseInt(params.table, 10) || 1));
  const [category, setCategory] = useState('Mains');
  const [cart, setCart] = useState<MenuItem[]>([]);
  const [note, setNote] = useState('');
  const [orders, setOrders] = useState<DemoOrder[]>([]);
  const [notice, setNotice] = useState('');
  const [sent, setSent] = useState(false);
  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price, 0), [cart]);

  useEffect(() => {
    const refresh = () => setOrders(readDemoState().orders.filter(order => order.table === table));
    refresh();
    window.addEventListener('storage', refresh);
    window.addEventListener('restaurantos-demo-state-change', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('restaurantos-demo-state-change', refresh);
    };
  }, [table]);

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2800);
  };
  const request = (type: 'WAITER' | 'BILL') => {
    const current = readDemoState();
    if (!current.requests.some(item => item.table === table && item.type === type)) {
      writeDemoState({
        ...current,
        requests: [...current.requests, { table, type, createdAt: new Date().toISOString() }],
      });
    }
    showNotice(type === 'BILL' ? 'Bill requested · a team member will help' : 'Service requested · a team member will help');
  };
  const submit = () => {
    if (!cart.length) return;
    const current = readDemoState();
    const order: DemoOrder = {
      id: `guest-${Date.now()}`,
      table,
      items: cart.map(item => ({ name: item.name, price: item.price, note: item.note })),
      amount: total,
      createdAt: new Date().toISOString(),
      customerNote: note.trim() || undefined,
      status: 'Submitted',
    };
    writeDemoState({ ...current, orders: [...current.orders, order] });
    setCart([]);
    setNote('');
    setSent(true);
    showNotice('Order sent to the kitchen');
  };

  return <main className="guest-shell">
    <header className="guest-header"><a href="/" className="guest-brand"><span className="guest-mark">R</span><span>RestaurantOS <b>AU</b></span></a><span className="guest-demo">DEMO</span></header>
    <div className="guest-main"><div className="guest-context"><span>SYDNEY · AUSTRALIA</span><span>TABLE {String(table).padStart(2, '0')}</span></div>
      <section className="guest-welcome"><div><p className="guest-kicker">WELCOME</p><h1>Order at your table</h1><p>Take your time. Add to your order whenever you’re ready.</p></div><span className="guest-table-badge">⌖ &nbsp; Table {String(table).padStart(2, '0')}</span></section>
      <div className="guest-notice"><span>✳</span><p><strong>Sample menu</strong><small>This demo order is saved only in this browser.</small></p></div>
      <div className="guest-tabs">{['Mains', 'Sides', 'Drinks'].map(name => <button key={name} className={category === name ? 'active' : ''} onClick={() => setCategory(name)}>{name}</button>)}</div>
      <div className="guest-menu">{menu.filter(item => item.category === category).map((item, i) => <article className="guest-dish" key={item.name}><div className={`guest-art guest-art-${i % 4}`}>{['✳', '◉', '✦', '◌'][i % 4]}</div><div className="guest-dish-copy"><h2>{item.name}</h2><p>{item.note}</p></div><div className="guest-price">{money(item.price)}<button aria-label={`Add ${item.name}`} onClick={() => {setCart(current => [...current, item]);setSent(false)}}>＋</button></div></article>)}</div>
      {orders.length > 0 && <section className="guest-history"><div className="guest-history-head"><h2>Your table orders</h2><span>{orders.filter(order => order.status === 'Submitted').length} sent</span></div>{orders.slice(-3).reverse().map(order => <div className="guest-history-row" key={order.id}><span>{order.items.map(item => item.name).join(', ')}</span><b>{money(order.amount)}</b><em>{order.status === 'Submitted' ? 'Sent to kitchen' : 'Paid'}</em></div>)}</section>}
      <div className="guest-requests"><button onClick={() => request('WAITER')}>♧ &nbsp; Call a team member</button><button onClick={() => request('BILL')}>▤ &nbsp; Request the bill</button></div>
      <div className="guest-footer">Prices are sample AUD values. Confirm allergen and dietary needs with staff.<br/>RestaurantOS AU · Interactive demonstration</div>
    </div>
    {cart.length > 0 && <div className="guest-cart"><div className="guest-cart-inner"><div className="guest-cart-summary"><strong>{cart.length} {cart.length === 1 ? 'item' : 'items'}</strong><span>{money(total)}</span></div><textarea aria-label="Order note" value={note} onChange={event => setNote(event.target.value)} placeholder="Add a note for the kitchen (optional)"/><button className="guest-submit" onClick={submit}>Send order <span>{money(total)} &nbsp; →</span></button></div></div>}
    {sent && cart.length === 0 && <div className="guest-confirm"><span>✓</span><div><strong>Order sent</strong><small>Your team can see this demo order in the floor view on this browser.</small></div><button onClick={() => setSent(false)}>×</button></div>}
    {notice && <div className="guest-toast">✓ &nbsp;{notice}</div>}
  </main>;
}
