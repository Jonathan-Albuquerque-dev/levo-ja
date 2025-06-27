
import React from 'react';
import { type Order } from '@/lib/data';
import { Package2 } from 'lucide-react';
import { Separator } from './ui/separator';

interface PrintableOrderProps {
  order: Order;
}

export const PrintableOrder = React.forwardRef<HTMLDivElement, PrintableOrderProps>(({ order }, ref) => {
  return (
    <div ref={ref} className="p-8 font-sans text-gray-800 bg-white">
      <header className="flex justify-between items-center pb-4 border-b">
        <div className="flex items-center gap-2">
            <Package2 className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Levo Já</h1>
        </div>
        <div className="text-right">
            <h2 className="text-xl font-semibold">Pedido #{order.id}</h2>
            <p className="text-sm text-gray-500">Data: {new Date(order.orderDate).toLocaleDateString('pt-BR')}</p>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-8 my-6">
        <div>
            <h3 className="text-lg font-semibold mb-2 border-b pb-1">Cliente</h3>
            <p className="font-medium">{order.customerName}</p>
            <p className="text-sm">{order.customerEmail}</p>
        </div>
        <div>
            <h3 className="text-lg font-semibold mb-2 border-b pb-1">Endereço de Entrega</h3>
            <p className="text-sm">{order.shippingAddress}</p>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">Itens do Pedido</h3>
        <div className="border rounded-lg">
            <table className="w-full text-sm">
                <thead className="bg-gray-50">
                    <tr className="border-b">
                        <th className="p-3 text-left font-semibold">Produto</th>
                        <th className="p-3 text-center font-semibold">Qtd.</th>
                        <th className="p-3 text-right font-semibold">Preço Unit.</th>
                        <th className="p-3 text-right font-semibold">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {order.items.map(item => (
                        <tr key={item.id} className="border-b last:border-none">
                            <td className="p-3">{item.name}</td>
                            <td className="p-3 text-center">{item.quantity}</td>
                            <td className="p-3 text-right">{item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                            <td className="p-3 text-right">{(item.quantity * item.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </section>
      
      <section className="mt-6">
        <div className="flex justify-end">
            <div className="w-full max-w-xs">
                 <div className="flex justify-between items-center py-2">
                    <span className="font-semibold">Subtotal</span>
                    <span>{order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
                 <div className="flex justify-between items-center py-2">
                    <span className="font-semibold">Frete</span>
                    <span>Grátis</span>
                </div>
                <Separator className="my-1 bg-gray-300"/>
                 <div className="flex justify-between items-center py-2 text-lg font-bold text-primary">
                    <span>Total</span>
                    <span>{order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
            </div>
        </div>
      </section>

      <footer className="mt-12 pt-4 border-t text-center text-xs text-gray-500">
        <p>Obrigado por comprar conosco!</p>
        <p>Levo Já - Transformando sua entrega.</p>
      </footer>
    </div>
  );
});

PrintableOrder.displayName = 'PrintableOrder';
