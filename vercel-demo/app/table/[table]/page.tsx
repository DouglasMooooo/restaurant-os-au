'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import menuData from '../../menu-data.json';
import { readDemoState, writeDemoState, type DemoOrder } from '../../demo-state';

type MenuItem = (typeof menuData)[number];
type CartLine = { item: MenuItem; quantity: number };
type Language = 'en' | 'zh';
const categories = ['TOP SELLERS', 'SPECIAL OFFER', 'BBQ MENU', 'CLAYPOT RICE', 'NOODLES', 'CHEF\'S PICK', 'SOUP', 'DRINKS'];
const categoryZh: Record<string, string> = { 'TOP SELLERS': '热门推荐', 'SPECIAL OFFER': '优惠套餐', 'BBQ MENU': '阳光烧腊', 'CLAYPOT RICE': '煲仔饭', NOODLES: '面类', 'CHEF\'S PICK': '厨师推荐', SOUP: '养生炖汤', DRINKS: '饮料' };
const t = { en: { subtitle: 'Hong Kong comfort food, made with care', scan: 'TABLE ORDER', table: 'Table', menu: 'Our menu', hint: 'Fresh from the Sunshine Restaurant kitchen', search: 'Search the menu', add: 'Add to order', popular: 'CUSTOMER FAVOURITES', note: 'Kitchen note (optional)', placeholder: 'Allergies or requests? Please tell our team too.', send: 'Send order', sent: 'Order received', history: 'Orders for this table', call: 'Call a team member', bill: 'Request the bill', sample: 'Demo ordering', sampleText: 'This preview saves orders in this browser only.', dietary: 'Please tell our team about allergies before ordering.', items: 'items', added: 'Added to order', kitchen: 'Order sent to the kitchen' }, zh: { subtitle: '港式风味，用心制作', scan: '扫码点单', table: '桌号', menu: '餐厅菜单', hint: '阳光餐厅厨房新鲜出品', search: '搜索菜单', add: '加入订单', popular: '人气推荐', note: '给厨房留言（选填）', placeholder: '过敏或特别要求？也请告知服务人员。', send: '确认下单', sent: '下单成功', history: '本桌订单', call: '呼叫服务员', bill: '请求结账', sample: '演示点单', sampleText: '此演示仅在当前浏览器保存订单。', dietary: '如有食物过敏，请下单前告知服务人员。', items: '件', added: '已加入订单', kitchen: '订单已送至厨房' } };
const money = (n: number) => new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(n);

export default function CustomerTablePage() {
  const params = useParams<{ table: string }>();
  const table = Math.max(1, Math.min(30, Number.parseInt(params.table, 10) || 1));
  const [language, setLanguage] = useState<Language>('en');
  const [category, setCategory] = useState(categories[0]);
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState<CartLine[]>([]);
  const [note, setNote] = useState('');
  const [orders, setOrders] = useState<DemoOrder[]>([]);
  const [notice, setNotice] = useState('');
  const [sent, setSent] = useState(false);
  const tx = t[language];
  const total = useMemo(() => cart.reduce((sum, line) => sum + line.item.price * line.quantity, 0), [cart]);
  const count = cart.reduce((sum, line) => sum + line.quantity, 0);
  const visibleMenu = menuData.filter(item => item.category === category && `${item.name} ${item.nameZh}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  const itemName = (item: MenuItem) => language === 'zh' ? item.nameZh : item.name;

  useEffect(() => {
    const refresh = () => setOrders(readDemoState().orders.filter(order => order.table === table));
    refresh();
    window.addEventListener('storage', refresh);
    window.addEventListener('restaurantos-demo-state-change', refresh);
    return () => { window.removeEventListener('storage', refresh); window.removeEventListener('restaurantos-demo-state-change', refresh); };
  }, [table]);
  const showNotice = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(''), 2600); };
  const add = (item: MenuItem) => { setSent(false); setCart(current => { const found = current.find(line => line.item.name === item.name); return found ? current.map(line => line.item.name === item.name ? { ...line, quantity: line.quantity + 1 } : line) : [...current, { item, quantity: 1 }]; }); };
  const changeQty = (item: MenuItem, delta: number) => setCart(current => current.map(line => line.item.name === item.name ? { ...line, quantity: line.quantity + delta } : line).filter(line => line.quantity > 0));
  const request = (type: 'WAITER' | 'BILL') => {
    const current = readDemoState();
    if (!current.requests.some(item => item.table === table && item.type === type)) writeDemoState({ ...current, requests: [...current.requests, { table, type, createdAt: new Date().toISOString() }] });
    showNotice(type === 'BILL' ? tx.bill : tx.call);
  };
  const submit = () => {
    if (!cart.length) return;
    const current = readDemoState();
    const order: DemoOrder = { id: `guest-${Date.now()}`, table, items: cart.flatMap(line => Array.from({ length: line.quantity }, () => ({ name: line.item.name, nameZh: line.item.nameZh, price: line.item.price }))), amount: total, createdAt: new Date().toISOString(), customerNote: note.trim() || undefined, status: 'Submitted' };
    writeDemoState({ ...current, orders: [...current.orders, order] });
    setCart([]); setNote(''); setSent(true); showNotice(tx.kitchen);
  };

  return <main className="sunshine-page" lang={language}>
    <header className="sunshine-hero">
      <nav className="sunshine-top"><a href="/" className="sunshine-logo"><span className="sunshine-sun">☼</span><span><strong>Sunshine Restaurant</strong><small>RIVERWOOD · SYDNEY</small></span></a><div className="sunshine-lang"><button className={language === 'en' ? 'selected' : ''} onClick={() => setLanguage('en')}>EN</button><button className={language === 'zh' ? 'selected' : ''} onClick={() => setLanguage('zh')}>中文</button></div></nav>
      <div className="sunshine-hero-copy"><span className="sunshine-eyebrow">{tx.scan} &nbsp;·&nbsp; {tx.table} {String(table).padStart(2, '0')}</span><h1>{language === 'en' ? 'A little taste of Hong Kong.' : '一口港味，温暖如家。'}</h1><p>{tx.subtitle}</p><span className="sunshine-table-pill">● &nbsp;{tx.table} {String(table).padStart(2, '0')}</span></div>
      <div className="sunshine-photo-credit">54 Thurlow Street · Riverwood NSW</div>
    </header>
    <section className="sunshine-promo"><span>✦</span><div><strong>{tx.sample}</strong><small>{tx.sampleText}</small></div><a href="https://sunshinerestaurant-riverwood.yumbojumbo.com.au/menu" target="_blank" rel="noreferrer">{language === 'en' ? 'View original menu ↗' : '查看餐厅原菜单 ↗'}</a></section>
    <section className="sunshine-menu-wrap"><div className="sunshine-section-title"><div><span className="sunshine-eyebrow">SUNSHINE RESTAURANT · MENU</span><h2>{tx.menu}</h2><p>{tx.hint}</p></div><div className="sunshine-search"><span>⌕</span><input aria-label={tx.search} value={query} onChange={event => setQuery(event.target.value)} placeholder={tx.search}/></div></div>
      <div className="sunshine-category-bar">{categories.map(name => <button key={name} className={category === name ? 'active' : ''} onClick={() => setCategory(name)}>{language === 'zh' ? categoryZh[name] : name}</button>)}</div>
      {category === 'TOP SELLERS' && <div className="sunshine-category-note"><span>✦</span> {tx.popular}</div>}
      {category === 'CLAYPOT RICE' && <div className="sunshine-category-note"><span>♨</span> {language === 'en' ? 'Clay pot rice takes 15–20 minutes to prepare.' : '煲仔饭需要约 15–20 分钟制作，请耐心等候。'}</div>}
      <div className="sunshine-dishes">{visibleMenu.map((item, index) => <article className="sunshine-dish" key={`${item.category}-${item.name}`}><div className={`sunshine-dish-art dish-tone-${index % 6}`}><span>{['煲', '叉', '湯', '茶', '飯', '香'][index % 6]}</span><i>✳</i></div><div className="sunshine-dish-copy"><span className="sunshine-category-label">{language === 'zh' ? categoryZh[item.category] : item.category}</span><h3>{itemName(item)}</h3>{language === 'zh' && <p className="sunshine-secondary-name">{item.name}</p>}{language === 'en' && <p className="sunshine-secondary-name">{item.nameZh}</p>}</div><div className="sunshine-dish-action"><strong>{money(item.price)}</strong><button aria-label={`${tx.add}: ${itemName(item)}`} onClick={() => { add(item); showNotice(tx.add); }}>＋</button></div></article>)}</div>
      <p className="sunshine-allergy">{tx.dietary}</p>
    </section>
    {orders.length > 0 && <section className="sunshine-history"><div className="sunshine-section-title"><div><span className="sunshine-eyebrow">TABLE {String(table).padStart(2, '0')}</span><h2>{tx.history}</h2></div></div>{orders.slice(-3).reverse().map(order => <div className="sunshine-history-row" key={order.id}><span>{order.items.map(item => language === 'zh' ? item.nameZh || item.name : item.name).join('、')}</span><b>{money(order.amount)}</b><small>{order.status === 'Submitted' ? tx.kitchen : (language === 'en' ? 'Paid' : '已付款')}</small></div>)}</section>}
    <footer className="sunshine-footer"><span>SUNSHINE RESTAURANT</span><span>54 Thurlow St · Riverwood NSW 2210</span><div><button onClick={() => request('WAITER')}>♧ &nbsp;{tx.call}</button><button onClick={() => request('BILL')}>▤ &nbsp;{tx.bill}</button></div></footer>
    {cart.length > 0 && <div className="sunshine-cart"><div className="sunshine-cart-inner"><div className="sunshine-cart-head"><div><span>{count} {tx.items}</span><strong>{money(total)}</strong></div><div className="sunshine-cart-lines">{cart.map(line => <div key={line.item.name}><span>{itemName(line.item)}</span><span className="sunshine-qty"><button onClick={() => changeQty(line.item, -1)}>−</button><b>{line.quantity}</b><button onClick={() => changeQty(line.item, 1)}>＋</button></span></div>)}</div></div><textarea aria-label={tx.note} value={note} onChange={event => setNote(event.target.value)} placeholder={tx.placeholder}/><button className="sunshine-submit" onClick={submit}>{tx.send}<span>{money(total)} &nbsp; →</span></button></div></div>}
    {sent && cart.length === 0 && <div className="sunshine-confirm"><span>✓</span><div><strong>{tx.sent}</strong><small>{tx.kitchen}</small></div><button onClick={() => setSent(false)}>×</button></div>}
    {notice && <div className="sunshine-toast">✓ &nbsp;{notice}</div>}
  </main>;
}
