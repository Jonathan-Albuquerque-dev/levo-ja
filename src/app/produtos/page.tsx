'use client'

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import {
  File,
  MoreHorizontal,
  PlusCircle,
} from "lucide-react"
import Image from "next/image"

import { Badge } from "@/components/ui/badge"
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
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


type Product = {
  id: string;
  name: string;
  status: "Ativo" | "Arquivado";
  price: number;
  stock: number;
  createdAt: string;
  image: string;
  imageHint: string;
};

const initialProducts: Product[] = [
  {
    id: "1",
    name: "Camiseta Hyper-Brilho Laser",
    status: "Ativo",
    price: 49.99,
    stock: 25,
    createdAt: "2023-07-12",
    image: "https://placehold.co/64x64.png",
    imageHint: "tshirt product",
  },
  {
    id: "2",
    name: "Moletom com Capuz Eco-Conforto",
    status: "Ativo",
    price: 89.99,
    stock: 102,
    createdAt: "2023-10-18",
    image: "https://placehold.co/64x64.png",
    imageHint: "hoodie product",
  },
   {
    id: "3",
    name: "Tênis de Corrida Zyon-Flex",
    status: "Arquivado",
    price: 159.90,
    stock: 0,
    createdAt: "2023-05-30",
    image: "https://placehold.co/64x64.png",
    imageHint: "sneaker product",
  },
];

const initialNewProductState = {
  name: '',
  price: '',
  stock: '',
};

export default function ProdutosPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState(initialNewProductState);
  const [activeTab, setActiveTab] = useState("todos");

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProduct.name && newProduct.price && newProduct.stock) {
      const productToAdd: Product = {
        id: crypto.randomUUID(),
        name: newProduct.name,
        status: "Ativo",
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock, 10),
        createdAt: new Date().toISOString().split('T')[0],
        image: "https://placehold.co/64x64.png",
        imageHint: "product placeholder",
      };
      setProducts(prev => [productToAdd, ...prev]);
      setAddDialogOpen(false);
      setNewProduct(initialNewProductState);
      toast({ title: "Sucesso!", description: "Produto adicionado." });
    } else {
      toast({ variant: "destructive", title: "Erro!", description: "Por favor, preencha todos os campos." });
    }
  };

  const handleEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
      setEditingProduct(null);
      toast({ title: "Sucesso!", description: "Produto atualizado." });
    }
  };

  const handleDeleteProduct = () => {
    if (deletingProduct) {
      setProducts(products.filter(p => p.id !== deletingProduct.id));
      setDeletingProduct(null);
      toast({ title: "Sucesso!", description: "Produto deletado." });
    }
  };

  const handleEditChange = (field: keyof Product, value: any) => {
    if (editingProduct) {
      setEditingProduct(prev => prev ? { ...prev, [field]: value } : null);
    }
  };

  const toggleProductStatus = (productId: string) => {
    setProducts(products.map(p => 
        p.id === productId 
            ? { ...p, status: p.status === 'Ativo' ? 'Arquivado' : 'Ativo' } 
            : p
    ));
    toast({ title: "Sucesso!", description: "Status do produto atualizado." });
  };

  const handleExport = () => {
    toast({ title: "Funcionalidade em desenvolvimento", description: "A exportação de produtos estará disponível em breve." })
  }

  const filteredProducts = products.filter(product => {
    if (activeTab === "todos") return true;
    return product.status.toLowerCase() === activeTab;
  });

  return (
    <DashboardLayout>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="ativo">Ativo</TabsTrigger>
            <TabsTrigger value="arquivado" className="hidden sm:flex">
              Arquivado
            </TabsTrigger>
          </TabsList>
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
                            Adicionar Produto
                        </span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleAddProduct}>
                        <DialogHeader>
                            <DialogTitle>Adicionar Novo Produto</DialogTitle>
                            <DialogDescription>
                            Preencha as informações do novo produto.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nome</Label>
                                <Input id="name" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} placeholder="Ex: Camiseta Branca" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="price">Preço</Label>
                                <Input id="price" type="number" step="0.01" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} placeholder="Ex: 49.99" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="stock">Estoque</Label>
                                <Input id="stock" type="number" value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} placeholder="Ex: 100" />
                            </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">Cancelar</Button>
                            </DialogClose>
                            <Button type="submit">Salvar Produto</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
          </div>
        </div>
        <TabsContent value="todos">
          <ProductCard />
        </TabsContent>
         <TabsContent value="ativo">
          <ProductCard />
        </TabsContent>
         <TabsContent value="arquivado">
          <ProductCard />
        </TabsContent>
      </Tabs>

      <Dialog open={!!editingProduct} onOpenChange={(isOpen) => !isOpen && setEditingProduct(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleEditProduct}>
            <DialogHeader>
              <DialogTitle>Editar Produto</DialogTitle>
              <DialogDescription>
                Atualize as informações do produto.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="name-edit">Nome</Label>
                    <Input id="name-edit" value={editingProduct?.name || ''} onChange={(e) => handleEditChange('name', e.target.value)} />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="price-edit">Preço</Label>
                        <Input id="price-edit" type="number" step="0.01" value={editingProduct?.price || ''} onChange={(e) => handleEditChange('price', parseFloat(e.target.value) || 0)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="stock-edit">Estoque</Label>
                        <Input id="stock-edit" type="number" value={editingProduct?.stock || ''} onChange={(e) => handleEditChange('stock', parseInt(e.target.value, 10) || 0)} />
                    </div>
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="status-edit">Status</Label>
                    <Select value={editingProduct?.status} onValueChange={(value) => handleEditChange('status', value)}>
                      <SelectTrigger id="status-edit">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ativo">Ativo</SelectItem>
                        <SelectItem value="Arquivado">Arquivado</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingProduct(null)}>Cancelar</Button>
              <Button type="submit">Salvar Alterações</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!deletingProduct} onOpenChange={(isOpen) => !isOpen && setDeletingProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso irá deletar permanentemente o produto.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingProduct(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct}>Deletar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )

  function ProductCard() {
    return (
        <Card>
            <CardHeader>
            <CardTitle>Produtos</CardTitle>
            <CardDescription>
                Gerencie seus produtos e visualize seu desempenho de vendas.
            </CardDescription>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell">
                    <span className="sr-only">Imagem</span>
                    </TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">
                    Preço
                    </TableHead>
                    <TableHead>
                      Estoque
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                    Criado em
                    </TableHead>
                    <TableHead>
                    <span className="sr-only">Ações</span>
                    </TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {filteredProducts.map(product => (
                    <TableRow key={product.id}>
                        <TableCell className="hidden sm:table-cell">
                        <Image
                            alt="Imagem do Produto"
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src={product.image}
                            width="64"
                            data-ai-hint={product.imageHint}
                        />
                        </TableCell>
                        <TableCell className="font-medium">
                        {product.name}
                        </TableCell>
                        <TableCell>
                        <Badge variant={product.status === 'Ativo' ? 'outline' : 'secondary'}>{product.status}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                        {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </TableCell>
                        <TableCell>
                        {product.stock}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                        {product.createdAt}
                        </TableCell>
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
                            <DropdownMenuItem onSelect={() => setEditingProduct(product)}>Editar</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => toggleProductStatus(product.id)}>
                                {product.status === 'Ativo' ? 'Arquivar' : 'Ativar'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onSelect={() => setDeletingProduct(product)}>
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
                Mostrando <strong>{filteredProducts.length}</strong> de <strong>{products.length}</strong> produtos
            </div>
            </CardFooter>
        </Card>
    )
  }
}
