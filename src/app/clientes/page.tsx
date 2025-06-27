
'use client'

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import {
  MoreHorizontal,
  PlusCircle,
  Search,
} from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
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
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"


type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    zipCode: string;
    city: string;
    state: string;
  };
  type: "Ativo" | "Novo" | "Inativo";
  signupDate: string;
  totalSpent: number;
  avatar: string;
  avatarFallback: string;
  avatarHint: string;
};

const initialCustomers: Customer[] = [
  {
    id: "1",
    name: "Ana Silva",
    email: "ana.silva@email.com",
    phone: "11987654321",
    cpf: "123.456.789-00",
    address: {
      street: "Rua das Flores",
      number: "123",
      zipCode: "01000-000",
      city: "São Paulo",
      state: "SP",
    },
    type: "Ativo",
    signupDate: "2023-01-15",
    totalSpent: 1250.50,
    avatar: "https://placehold.co/36x36.png",
    avatarFallback: "AS",
    avatarHint: "woman smiling",
  },
  {
    id: "2",
    name: "Bruno Costa",
    email: "bruno.costa@email.com",
    phone: "21912345678",
    cpf: "987.654.321-00",
    address: {
      street: "Avenida Copacabana",
      number: "456",
      zipCode: "22020-001",
      city: "Rio de Janeiro",
      state: "RJ",
    },
    type: "Novo",
    signupDate: "2024-03-20",
    totalSpent: 320.00,
    avatar: "https://placehold.co/36x36.png",
    avatarFallback: "BC",
    avatarHint: "man portrait",
  },
];

const initialNewCustomerState = {
  name: '',
  email: '',
  phone: '',
  cpf: '',
  street: '',
  number: '',
  complement: '',
  zipCode: '',
  city: '',
  state: '',
};

export default function ClientesPage() {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [newCustomer, setNewCustomer] = useState(initialNewCustomerState);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCustomer.name && newCustomer.email && newCustomer.phone && newCustomer.cpf && newCustomer.zipCode && newCustomer.street && newCustomer.number && newCustomer.city && newCustomer.state) {
      const customerToAdd: Customer = {
        id: crypto.randomUUID(),
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone,
        cpf: newCustomer.cpf,
        address: {
          street: newCustomer.street,
          number: newCustomer.number,
          complement: newCustomer.complement,
          zipCode: newCustomer.zipCode,
          city: newCustomer.city,
          state: newCustomer.state,
        },
        type: "Novo",
        signupDate: new Date().toISOString().split('T')[0],
        totalSpent: 0,
        avatar: `https://placehold.co/36x36.png`,
        avatarFallback: newCustomer.name.split(' ').map(n => n[0]).join('').toUpperCase(),
        avatarHint: "person portrait",
      };
      setCustomers(prev => [customerToAdd, ...prev]);
      setAddDialogOpen(false);
      setNewCustomer(initialNewCustomerState);
      toast({ title: "Sucesso!", description: "Cliente adicionado." });
    } else {
      toast({ variant: "destructive", title: "Erro!", description: "Por favor, preencha todos os campos obrigatórios." });
    }
  };

  const handleEditCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      setCustomers(customers.map(c => c.id === editingCustomer.id ? editingCustomer : c));
      setEditingCustomer(null);
      toast({ title: "Sucesso!", description: "Cliente atualizado." });
    }
  };

  const handleDeleteCustomer = () => {
    if (deletingCustomer) {
      setCustomers(customers.filter(c => c.id !== deletingCustomer.id));
      setDeletingCustomer(null);
      toast({ title: "Sucesso!", description: "Cliente deletado." });
    }
  };

  const handleEditChange = (field: keyof Customer, value: any) => {
    if (editingCustomer) {
      setEditingCustomer({ ...editingCustomer, [field]: value });
    }
  };

  const handleEditAddressChange = (field: keyof Customer['address'], value: any) => {
    if (editingCustomer) {
      setEditingCustomer({
        ...editingCustomer,
        address: {
          ...editingCustomer.address,
          [field]: value
        }
      });
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Clientes</h1>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Pesquisar clientes por nome ou email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8"
            />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Adicionar Cliente
                </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <form onSubmit={handleAddCustomer}>
                <DialogHeader>
                    <DialogTitle>Adicionar Novo Cliente</DialogTitle>
                    <DialogDescription>
                    Preencha as informações do novo cliente.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-96 w-full">
                    <div className="grid gap-4 p-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nome</Label>
                        <Input id="name" value={newCustomer.name} onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})} placeholder="Ex: João da Silva" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={newCustomer.email} onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})} placeholder="Ex: joao@email.com" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input id="phone" value={newCustomer.phone} onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})} placeholder="Ex: 11987654321" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="cpf">CPF</Label>
                        <Input id="cpf" value={newCustomer.cpf} onChange={(e) => setNewCustomer({...newCustomer, cpf: e.target.value})} placeholder="Ex: 123.456.789-00" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="zipCode">CEP</Label>
                        <Input id="zipCode" value={newCustomer.zipCode} onChange={(e) => setNewCustomer({...newCustomer, zipCode: e.target.value})} placeholder="Ex: 01000-000" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="street">Rua</Label>
                        <Input id="street" value={newCustomer.street} onChange={(e) => setNewCustomer({...newCustomer, street: e.target.value})} placeholder="Ex: Rua das Flores" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="number">Número</Label>
                        <Input id="number" value={newCustomer.number} onChange={(e) => setNewCustomer({...newCustomer, number: e.target.value})} placeholder="Ex: 123" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="complement">Complemento</Label>
                        <Input id="complement" value={newCustomer.complement} onChange={(e) => setNewCustomer({...newCustomer, complement: e.target.value})} placeholder="Ex: Apto 4B" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="city">Cidade</Label>
                        <Input id="city" value={newCustomer.city} onChange={(e) => setNewCustomer({...newCustomer, city: e.target.value})} placeholder="Ex: São Paulo" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="state">Estado</Label>
                        <Input id="state" value={newCustomer.state} onChange={(e) => setNewCustomer({...newCustomer, state: e.target.value})} placeholder="Ex: SP" />
                    </div>
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <DialogClose asChild>
                    <Button type="button" variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button type="submit">Salvar Cliente</Button>
                </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            Gerencie seus clientes e veja o histórico de compras.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead className="hidden md:table-cell">
                  Email
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Tipo
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Data de Cadastro
                </TableHead>
                <TableHead className="text-right">Total Gasto</TableHead>
                <TableHead>
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map(customer => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="hidden h-9 w-9 sm:flex">
                          <AvatarImage src={customer.avatar} alt="Avatar" data-ai-hint={customer.avatarHint} />
                          <AvatarFallback>{customer.avatarFallback}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{customer.name}</div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {customer.email}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {customer.type}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {customer.signupDate}
                  </TableCell>
                  <TableCell className="text-right">{customer.totalSpent.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem onSelect={() => setViewingCustomer(customer)}>
                          Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setEditingCustomer(customer)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onSelect={() => setDeletingCustomer(customer)}>
                          Deletar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
            <div className="text-xs text-muted-foreground">
                Mostrando <strong>{filteredCustomers.length}</strong> de <strong>{customers.length}</strong> clientes
            </div>
        </CardFooter>
      </Card>

      <Dialog open={!!editingCustomer} onOpenChange={(isOpen) => !isOpen && setEditingCustomer(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <form onSubmit={handleEditCustomer}>
            <DialogHeader>
              <DialogTitle>Editar Cliente</DialogTitle>
              <DialogDescription>
                Atualize as informações do cliente.
              </DialogDescription>
            </DialogHeader>
             <ScrollArea className="h-96 w-full">
              <div className="grid gap-4 p-4">
                <div className="grid gap-2">
                  <Label htmlFor="name-edit">Nome</Label>
                  <Input id="name-edit" value={editingCustomer?.name || ''} onChange={(e) => handleEditChange('name', e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email-edit">Email</Label>
                  <Input id="email-edit" type="email" value={editingCustomer?.email || ''} onChange={(e) => handleEditChange('email', e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone-edit">Telefone</Label>
                  <Input id="phone-edit" value={editingCustomer?.phone || ''} onChange={(e) => handleEditChange('phone', e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cpf-edit">CPF</Label>
                  <Input id="cpf-edit" value={editingCustomer?.cpf || ''} onChange={(e) => handleEditChange('cpf', e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="zipCode-edit">CEP</Label>
                  <Input id="zipCode-edit" value={editingCustomer?.address?.zipCode || ''} onChange={(e) => handleEditAddressChange('zipCode', e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="street-edit">Rua</Label>
                  <Input id="street-edit" value={editingCustomer?.address?.street || ''} onChange={(e) => handleEditAddressChange('street', e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="number-edit">Número</Label>
                  <Input id="number-edit" value={editingCustomer?.address?.number || ''} onChange={(e) => handleEditAddressChange('number', e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="complement-edit">Complemento</Label>
                  <Input id="complement-edit" value={editingCustomer?.address?.complement || ''} onChange={(e) => handleEditAddressChange('complement', e.target.value)} />
                </div>
                 <div className="grid gap-2">
                  <Label htmlFor="city-edit">Cidade</Label>
                  <Input id="city-edit" value={editingCustomer?.address?.city || ''} onChange={(e) => handleEditAddressChange('city', e.target.value)} />
                </div>
                 <div className="grid gap-2">
                  <Label htmlFor="state-edit">Estado</Label>
                  <Input id="state-edit" value={editingCustomer?.address?.state || ''} onChange={(e) => handleEditAddressChange('state', e.target.value)} />
                </div>
              </div>
            </ScrollArea>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingCustomer(null)}>Cancelar</Button>
              <Button type="submit">Salvar Alterações</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!deletingCustomer} onOpenChange={(isOpen) => !isOpen && setDeletingCustomer(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso irá deletar permanentemente o cliente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingCustomer(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCustomer}>Deletar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!viewingCustomer} onOpenChange={(isOpen) => !isOpen && setViewingCustomer(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Cliente</DialogTitle>
            <DialogDescription>
              Informações completas do cliente selecionado.
            </DialogDescription>
          </DialogHeader>
          {viewingCustomer && (
            <ScrollArea className="h-96 w-full">
              <div className="grid gap-4 p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                      <AvatarImage src={viewingCustomer.avatar} alt="Avatar" data-ai-hint={viewingCustomer.avatarHint} />
                      <AvatarFallback>{viewingCustomer.avatarFallback}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{viewingCustomer.name}</h3>
                    <p className="text-sm text-muted-foreground">{viewingCustomer.email}</p>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Telefone</Label>
                    <p className="font-medium text-sm">{viewingCustomer.phone}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">CPF</Label>
                    <p className="font-medium text-sm">{viewingCustomer.cpf}</p>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-xs text-muted-foreground">Endereço</Label>
                    <p className="font-medium text-sm">
                      {`${viewingCustomer.address.street}, ${viewingCustomer.address.number}`}
                      {viewingCustomer.address.complement && `, ${viewingCustomer.address.complement}`}
                    </p>
                     <p className="font-medium text-sm">
                      {`${viewingCustomer.address.city}, ${viewingCustomer.address.state} - CEP: ${viewingCustomer.address.zipCode}`}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Tipo de Cliente</Label>
                    <p className="font-medium text-sm">{viewingCustomer.type}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Data de Cadastro</Label>
                    <p className="font-medium text-sm">{viewingCustomer.signupDate}</p>
                  </div>
                   <div>
                    <Label className="text-xs text-muted-foreground">Total Gasto</Label>
                    <p className="font-medium text-sm">{viewingCustomer.totalSpent.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Fechar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
