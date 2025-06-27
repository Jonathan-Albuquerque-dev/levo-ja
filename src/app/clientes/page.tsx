'use client'

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import {
  MoreHorizontal,
  PlusCircle,
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


type Customer = {
  id: string;
  name: string;
  email: string;
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
    type: "Novo",
    signupDate: "2024-03-20",
    totalSpent: 320.00,
    avatar: "https://placehold.co/36x36.png",
    avatarFallback: "BC",
    avatarHint: "man portrait",
  },
];


export default function ClientesPage() {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '' });

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCustomer.name && newCustomer.email) {
      const customerToAdd: Customer = {
        id: crypto.randomUUID(),
        name: newCustomer.name,
        email: newCustomer.email,
        type: "Novo",
        signupDate: new Date().toISOString().split('T')[0],
        totalSpent: 0,
        avatar: `https://placehold.co/36x36.png`,
        avatarFallback: newCustomer.name.split(' ').map(n => n[0]).join('').toUpperCase(),
        avatarHint: "person portrait",
      };
      setCustomers(prev => [customerToAdd, ...prev]);
      setAddDialogOpen(false);
      setNewCustomer({ name: '', email: '' });
      toast({ title: "Sucesso!", description: "Cliente adicionado." });
    } else {
      toast({ variant: "destructive", title: "Erro!", description: "Por favor, preencha todos os campos." });
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

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Clientes</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Adicionar Cliente
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleAddCustomer}>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Cliente</DialogTitle>
                <DialogDescription>
                  Preencha as informações do novo cliente.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Nome</Label>
                  <Input id="name" value={newCustomer.name} onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})} className="col-span-3" placeholder="Ex: João da Silva" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">Email</Label>
                  <Input id="email" type="email" value={newCustomer.email} onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})} className="col-span-3" placeholder="Ex: joao@email.com" />
                </div>
              </div>
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
              {customers.map(customer => (
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
                        <DropdownMenuItem onSelect={() => toast({ description: "Funcionalidade de detalhes em breve." })}>
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
                Mostrando <strong>1-{customers.length}</strong> de <strong>{customers.length}</strong> clientes
            </div>
        </CardFooter>
      </Card>

      <Dialog open={!!editingCustomer} onOpenChange={(isOpen) => !isOpen && setEditingCustomer(null)}>
        <DialogContent>
          <form onSubmit={handleEditCustomer}>
            <DialogHeader>
              <DialogTitle>Editar Cliente</DialogTitle>
              <DialogDescription>
                Atualize as informações do cliente.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name-edit" className="text-right">Nome</Label>
                <Input id="name-edit" value={editingCustomer?.name || ''} onChange={(e) => editingCustomer && setEditingCustomer({...editingCustomer, name: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email-edit" className="text-right">Email</Label>
                <Input id="email-edit" type="email" value={editingCustomer?.email || ''} onChange={(e) => editingCustomer && setEditingCustomer({...editingCustomer, email: e.target.value})} className="col-span-3" />
              </div>
            </div>
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
    </DashboardLayout>
  )
}
