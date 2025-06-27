
'use client'

import { useState } from "react"
import jsPDF from "jspdf"
import {
  File,
  MoreHorizontal,
  PlusCircle,
  Truck,
  CheckCircle,
  Package,
  Hourglass,
  X,
  Printer,
  Search,
  Calendar as CalendarIcon,
  Filter,
} from "lucide-react"
import { format } from "date-fns"
import { type DateRange } from "react-day-picker"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DashboardLayout } from "@/components/dashboard-layout"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { 
  initialOrders, 
  type Order, 
  type OrderStatus, 
  type OrderItem,
  initialCustomers,
  type Customer,
  initialProducts,
  type Product,
} from "@/lib/data"
import { cn } from "@/lib/utils"


const statusConfig: Record<OrderStatus, { variant: 'outline' | 'secondary' | 'default', icon: React.ElementType, color: string }> = {
  'Confirmado': { variant: 'outline', icon: CheckCircle, color: 'text-blue-500' },
  'Em Andamento': { variant: 'outline', icon: Hourglass, color: 'text-yellow-500' },
  'Saiu para Entrega': { variant: 'outline', icon: Truck, color: 'text-orange-500' },
  'Finalizado': { variant: 'secondary', icon: Package, color: 'text-green-500' },
};

export default function PedidosPage() {
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [customers] = useState<Customer[]>(initialCustomers);
  const [products] = useState<Product[]>(initialProducts.filter(p => p.status === "Ativo"));
  
  const [activeTab, setActiveTab] = useState("todos")
  const [isAddDialogOpen, setAddDialogOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null)
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null)
  
  const [newOrderCustomerId, setNewOrderCustomerId] = useState<string | undefined>(undefined);
  const [newOrderItems, setNewOrderItems] = useState<OrderItem[]>([]);
  const [productToAddId, setProductToAddId] = useState<string | undefined>(undefined);
  const [productToAddQuantity, setProductToAddQuantity] = useState(1);

  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
  });

  const handleGeneratePdf = () => {
    if (!viewingOrder) {
      toast({ variant: "destructive", title: "Erro!", description: "Nenhum pedido selecionado." });
      return;
    }

    const customer = customers.find(c => c.id === viewingOrder.customerId);
    if (!customer) {
        toast({ variant: "destructive", title: "Erro!", description: "Cliente do pedido não encontrado." });
        return;
    }

    toast({ title: "Gerando PDF...", description: "Por favor, aguarde um momento." });

    try {
      const doc = new jsPDF();
      let y = 20;

      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text("Levo Já", 20, y);
      y += 8;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Pedido: #${viewingOrder.id}`, 20, y);
      doc.text(`Data: ${new Date(viewingOrder.orderDate).toLocaleDateString('pt-BR')}`, 140, y, { align: 'left' });
      y += 10;
      
      doc.setLineWidth(0.5);
      doc.line(20, y, 190, y);
      y += 10;

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text("Cliente", 20, y);
      y += 7;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(customer.name, 20, y);
      y += 5;
      doc.text(customer.phone, 20, y);
      y += 5;
      const address = customer.address;
      const fullAddress = `${address.street}, ${address.number}${address.complement ? `, ${address.complement}` : ''} - ${address.city}, ${address.state}`;
      doc.text(fullAddress, 20, y);
      y += 15;
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text("Itens do Pedido", 20, y);
      y += 7;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text("Produto", 20, y);
      doc.text("Qtd.", 130, y, { align: 'right' });
      doc.text("Preço Unit.", 160, y, { align: 'right' });
      doc.text("Subtotal", 190, y, { align: 'right' });
      y += 3;
      doc.setLineWidth(0.2);
      doc.line(20, y, 190, y);
      y += 5;
      
      doc.setFont('helvetica', 'normal');
      viewingOrder.items.forEach(item => {
        const subtotal = (item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const price = item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        doc.text(item.name, 20, y);
        doc.text(String(item.quantity), 130, y, { align: 'right' });
        doc.text(price, 160, y, { align: 'right' });
        doc.text(subtotal, 190, y, { align: 'right' });
        y += 7;
      });

      y += 5;
      doc.line(130, y, 190, y);
      y += 7;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text("Total:", 130, y, { align: 'left' });
      doc.text(viewingOrder.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 190, y, { align: 'right' });

      doc.save(`Pedido-${viewingOrder.id}.pdf`);

      toast({ title: "Sucesso!", description: "PDF do pedido gerado e baixado." });

    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast({ variant: "destructive", title: "Erro!", description: "Ocorreu um problema ao gerar o PDF." });
    }
  };


  const filteredOrders = orders.filter(order => {
    // Tab filter
    const tabMatch = activeTab === "todos" || order.status.toLowerCase() === activeTab.replace(/-/g, ' ');

    // Search query filter
    const searchMatch = searchQuery === "" ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());

    // Date range filter
    const dateMatch = (() => {
      if (!dateRange?.from) {
        return true;
      }
      const orderDate = new Date(order.orderDate + "T00:00:00"); // Treat as local midnight
      if (dateRange.to) {
        // Create a 'to' date that includes the whole day
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999);
        return orderDate >= dateRange.from && orderDate <= toDate;
      }
      // Single day selection
      const fromDate = dateRange.from;
      return (
        orderDate.getFullYear() === fromDate.getFullYear() &&
        orderDate.getMonth() === fromDate.getMonth() &&
        orderDate.getDate() === fromDate.getDate()
      );
    })();

    return tabMatch && searchMatch && dateMatch;
  });

  const handleExport = () => {
    if (filteredOrders.length === 0) {
      toast({
        variant: "destructive",
        title: "Nenhum pedido para exportar",
        description: "Não há pedidos na lista atual para exportar.",
      });
      return;
    }

    const csvHeader = ["ID do Pedido", "Nome do Cliente", "Email do Cliente", "Status", "Data do Pedido", "Total", "Endereço de Entrega", "Itens"].join(',');
    
    const escapeCsvField = (field: any): string => {
      const str = String(field);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvRows = filteredOrders.map(order => {
      const itemsString = order.items.map(item => `${item.quantity}x ${item.name}`).join('; ');
      return [
        escapeCsvField(order.id),
        escapeCsvField(order.customerName),
        escapeCsvField(order.customerEmail),
        escapeCsvField(order.status),
        escapeCsvField(order.orderDate),
        escapeCsvField(order.total.toFixed(2)),
        escapeCsvField(order.shippingAddress),
        escapeCsvField(itemsString),
      ].join(',');
    });

    const csvContent = [csvHeader, ...csvRows].join('\n');
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "pedidos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Exportação Concluída",
      description: `O arquivo "pedidos.csv" com ${filteredOrders.length} pedidos foi baixado.`,
    });
  }

  const handleAddItem = () => {
    if (!productToAddId) {
      toast({ variant: "destructive", title: "Erro!", description: "Selecione um produto para adicionar." });
      return;
    }
    const product = products.find(p => p.id === productToAddId);
    if (!product) return;

    const existingItemIndex = newOrderItems.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
        const updatedItems = [...newOrderItems];
        updatedItems[existingItemIndex].quantity += productToAddQuantity;
        setNewOrderItems(updatedItems);
    } else {
        const newItem: OrderItem = {
            id: product.id,
            name: product.name,
            quantity: productToAddQuantity,
            price: product.price,
        };
        setNewOrderItems(prev => [...prev, newItem]);
    }
    
    setProductToAddId(undefined);
    setProductToAddQuantity(1);
  };

  const handleRemoveItem = (itemId: string) => {
    setNewOrderItems(prev => prev.filter(item => item.id !== itemId));
  };


  const handleAddOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCustomer = customers.find(c => c.id === newOrderCustomerId);

    if (!selectedCustomer) {
      toast({ variant: "destructive", title: "Erro!", description: "Por favor, selecione um cliente." });
      return;
    }
    if (newOrderItems.length === 0) {
      toast({ variant: "destructive", title: "Erro!", description: "Por favor, adicione pelo menos um produto ao pedido." });
      return;
    }

    const total = newOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const address = selectedCustomer.address;
    const shippingAddress = `${address.street}, ${address.number}${address.complement ? `, ${address.complement}` : ''} - ${address.city}, ${address.state}`;
    
    const orderToAdd: Order = {
      id: `ORD${String(orders.length + 1).padStart(3, '0')}`,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerEmail: selectedCustomer.email,
      status: 'Confirmado',
      orderDate: new Date().toISOString().split('T')[0],
      total: total,
      shippingAddress: shippingAddress,
      items: newOrderItems,
    };

    setOrders(prev => [orderToAdd, ...prev]);
    setAddDialogOpen(false);
    
    setNewOrderCustomerId(undefined);
    setNewOrderItems([]);
    setProductToAddId(undefined);
    setProductToAddQuantity(1);
    toast({ title: "Sucesso!", description: "Pedido adicionado." });
  };


  const handleEditOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOrder) {
      setOrders(orders.map(o => o.id === editingOrder.id ? editingOrder : o));
      setEditingOrder(null);
      toast({ title: "Sucesso!", description: "Pedido atualizado." });
    }
  };

  const handleDeleteOrder = () => {
    if (deletingOrder) {
      setOrders(orders.filter(o => o.id !== deletingOrder.id));
      setDeletingOrder(null);
      toast({ title: "Sucesso!", description: "Pedido deletado." });
    }
  };

  const handleEditChange = (field: keyof Order, value: any) => {
    if (editingOrder) {
      setEditingOrder(prev => prev ? { ...prev, [field]: value } : null);
    }
  };
  
  return (
    <DashboardLayout orders={orders}>
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Pesquisar pedido..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-[150px] bg-background pl-8 lg:w-[250px]"
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "h-8 w-[220px] justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd/MM/y")} -{" "}
                      {format(dateRange.to, "dd/MM/y")}
                    </>
                  ) : (
                    format(dateRange.from, "dd/MM/y")
                  )
                ) : (
                  <span>Filtrar por data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={1}
              />
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Filter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filtrar Status
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filtrar por status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={activeTab} onValueChange={setActiveTab}>
                <DropdownMenuRadioItem value="todos">Todos</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="confirmado">Confirmado</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="em-andamento">Em Andamento</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="saiu-para-entrega">Saiu para Entrega</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="finalizado">Finalizado</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1" onClick={handleExport}>
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Exportar
            </span>
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Adicionar Pedido
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <form onSubmit={handleAddOrder}>
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Pedido</DialogTitle>
                  <DialogDescription>
                    Selecione um cliente e adicione produtos para criar um novo pedido.
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-96 w-full">
                  <div className="grid gap-6 p-4">
                    <div className="grid gap-2">
                      <Label htmlFor="customer">Cliente</Label>
                      <Select value={newOrderCustomerId} onValueChange={setNewOrderCustomerId}>
                        <SelectTrigger id="customer">
                          <SelectValue placeholder="Selecione um cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          {customers.map(customer => (
                            <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2 text-sm">Adicionar Produtos</h4>
                      <div className="flex items-end gap-2">
                        <div className="grid gap-2 flex-1">
                          <Label htmlFor="product">Produto</Label>
                          <Select value={productToAddId} onValueChange={setProductToAddId}>
                            <SelectTrigger id="product">
                              <SelectValue placeholder="Selecione um produto" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map(product => (
                                <SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2 w-24">
                          <Label htmlFor="quantity">Qtd.</Label>
                          <Input 
                            id="quantity" 
                            type="number" 
                            min="1" 
                            value={productToAddQuantity}
                            onChange={e => setProductToAddQuantity(parseInt(e.target.value) || 1)}
                          />
                        </div>
                        <Button type="button" variant="outline" onClick={handleAddItem}>Adicionar</Button>
                      </div>
                    </div>
                    {newOrderItems.length > 0 && (
                      <div>
                        <Separator className="my-4" />
                        <h4 className="font-medium mb-2 text-sm">Itens do Pedido</h4>
                        <div className="space-y-2">
                          {newOrderItems.map(item => (
                            <div key={item.id} className="flex justify-between items-center text-sm p-2 bg-muted rounded-md">
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-muted-foreground">{item.quantity} x {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold">{(item.quantity * item.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                                <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveItem(item.id)}>
                                  <X className="h-4 w-4 text-destructive"/>
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Separator className="my-4" />
                        <div className="flex justify-end font-bold text-lg">
                            <p>Total: {newOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancelar</Button>
                  </DialogClose>
                  <Button type="submit">Salvar Pedido</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Pedidos</CardTitle>
          <CardDescription>
            Gerencie seus pedidos e visualize o desempenho das vendas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">
                  Data do Pedido
                </TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map(order => {
                const Icon = statusConfig[order.status].icon;
                return (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="font-medium">{order.customerName}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        {order.customerEmail}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[order.status].variant} className="capitalize">
                        <Icon className={`mr-2 h-3.5 w-3.5 ${statusConfig[order.status].color}`} />
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(order.orderDate + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right">{order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem onSelect={() => setViewingOrder(order)}>Ver Detalhes</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => setEditingOrder(order)}>Editar</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onSelect={() => setDeletingOrder(order)}>
                            Deletar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Mostrando <strong>{filteredOrders.length}</strong> de <strong>{orders.length}</strong> pedidos
          </div>
        </CardFooter>
      </Card>
      
      <Dialog open={!!editingOrder} onOpenChange={(isOpen) => !isOpen && setEditingOrder(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <form onSubmit={handleEditOrder}>
            <DialogHeader>
              <DialogTitle>Editar Pedido #{editingOrder?.id}</DialogTitle>
              <DialogDescription>
                Atualize o status e outras informações do pedido.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-96 w-full">
              <div className="grid gap-4 p-4">
                <div className="grid gap-2">
                  <Label htmlFor="customerName-edit">Nome do Cliente</Label>
                  <Input id="customerName-edit" value={editingOrder?.customerName || ''} onChange={e => handleEditChange('customerName', e.target.value)} />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="total-edit">Total do Pedido</Label>
                    <Input id="total-edit" type="number" step="0.01" value={editingOrder?.total || ''} onChange={e => handleEditChange('total', parseFloat(e.target.value) || 0)} />
                  </div>
                   <div className="grid gap-2">
                    <Label htmlFor="status-edit">Status</Label>
                     <Select value={editingOrder?.status} onValueChange={(value: OrderStatus) => handleEditChange('status', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(statusConfig).map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                   </div>
                 </div>
                 <div className="grid gap-2">
                    <Label htmlFor="shippingAddress-edit">Endereço de Entrega</Label>
                    <Textarea id="shippingAddress-edit" value={editingOrder?.shippingAddress || ''} onChange={e => handleEditChange('shippingAddress', e.target.value)} />
                 </div>
              </div>
            </ScrollArea>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingOrder(null)}>Cancelar</Button>
              <Button type="submit">Salvar Alterações</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!deletingOrder} onOpenChange={(isOpen) => !isOpen && setDeletingOrder(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso irá deletar permanentemente o pedido.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingOrder(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteOrder}>Deletar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!viewingOrder} onOpenChange={(isOpen) => !isOpen && setViewingOrder(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido #{viewingOrder?.id}</DialogTitle>
             <DialogDescription>
              Informações completas do pedido selecionado.
            </DialogDescription>
          </DialogHeader>
          {viewingOrder && (() => {
            const Icon = statusConfig[viewingOrder.status].icon;
            return (
              <ScrollArea className="h-96 w-full">
                <div className="grid gap-6 p-4">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div className="col-span-2">
                      <Label className="text-xs text-muted-foreground">Cliente</Label>
                      <p className="font-medium">{viewingOrder.customerName}</p>
                      <p className="text-sm text-muted-foreground">{viewingOrder.customerEmail}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Status</Label>
                      <p className="font-medium flex items-center">
                        <Icon className={`mr-2 h-4 w-4 ${statusConfig[viewingOrder.status].color}`} />
                        {viewingOrder.status}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Data do Pedido</Label>
                      <p className="font-medium">{new Date(viewingOrder.orderDate + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs text-muted-foreground">Endereço de Entrega</Label>
                      <p className="font-medium">{viewingOrder.shippingAddress}</p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Itens do Pedido</h4>
                    <div className="space-y-2">
                      {viewingOrder.items.length > 0 ? viewingOrder.items.map(item => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                          <p>{item.quantity}x {item.name}</p>
                          <p>{(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                        </div>
                      )) : (
                        <p className="text-sm text-muted-foreground">Nenhum item neste pedido.</p>
                      )}
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                      <p>Total</p>
                      <p>{viewingOrder.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                  </div>
                </div>
              </ScrollArea>
            );
          })()}
          <DialogFooter className="sm:justify-start gap-2">
            <Button onClick={handleGeneratePdf}>
              <Printer className="mr-2 h-4 w-4" />
              Gerar PDF do Pedido
            </Button>
            <DialogClose asChild>
              <button
                type="button"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "sm:ml-auto"
                )}
              >
                Fechar
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
