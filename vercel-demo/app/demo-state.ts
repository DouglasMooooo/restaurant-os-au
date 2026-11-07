export type DemoOrder = {
  id: string;
  table: number;
  items: Array<{ name: string; nameZh?: string; price: number; note?: string }>;
  amount: number;
  createdAt: string;
  customerNote?: string;
  status: 'Submitted' | 'Paid';
};

export type DemoRequest = { table: number; type: 'WAITER' | 'BILL'; createdAt: string };
export type DemoState = { orders: DemoOrder[]; requests: DemoRequest[] };

const KEY = 'restaurantos-au-demo-state-v1';

export function readDemoState(): DemoState {
  try {
    const value = window.localStorage.getItem(KEY);
    if (!value) return { orders: [], requests: [] };
    const data = JSON.parse(value) as Partial<DemoState>;
    return {
      orders: Array.isArray(data.orders) ? data.orders : [],
      requests: Array.isArray(data.requests) ? data.requests : [],
    };
  } catch {
    return { orders: [], requests: [] };
  }
}

export function writeDemoState(data: DemoState) {
  window.localStorage.setItem(KEY, JSON.stringify(data));
  window.dispatchEvent(new Event('restaurantos-demo-state-change'));
}

export function clearDemoState() {
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event('restaurantos-demo-state-change'));
}
