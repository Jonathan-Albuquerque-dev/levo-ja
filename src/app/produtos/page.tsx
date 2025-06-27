'use client'

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import {
  File,
  MoreHorizontal,
  PlusCircle,
  Search,
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
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"


type Product = {
  id: string;
  name: string;
  status: "Ativo" | "Arquivado";
  price: number;
  stock: number;
  createdAt: string;
  image: string;
  imageHint: string;
  category: string;
  brand: string;
  unitOfMeasure: string;
  description: string;
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
    category: "Vestuário",
    brand: "Hyper",
    unitOfMeasure: "Unidade",
    description: "Camiseta de algodão com estampa a laser que brilha no escuro."
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
    category: "Vestuário",
    brand: "EcoWear",
    unitOfMeasure: "Unidade",
    description: "Moletom sustentável feito com materiais reciclados."
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
    category: "Calçados",
    brand: "Zyon",
    unitOfMeasure: "Par",
    description: "Tênis leve e flexível para corredores de todos os níveis."
  },
];

const initialNewProductState = {
  name: '',
  price: '',
  stock: '',
  category: '',
  brand: '',
  unitOfMeasure: 'Unidade',
  description: '',
  image: '',
};

export default function ProdutosPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState(initialNewProductState);
  const [activeTab, setActiveTab] = useState("todos");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter(product => {
    const matchesTab = (() => {
      if (activeTab === "todos") return true;
      if (activeTab === "ativo") return product.status === "Ativo";
      return product.status.toLowerCase() === activeTab;
    })();
    
    const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProduct.name && newProduct.price && newProduct.stock && newProduct.category && newProduct.brand) {
      const productToAdd: Product = {
        id: crypto.randomUUID(),
        name: newProduct.name,
        status: "Ativo",
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock, 10),
        createdAt: new Date().toISOString().split('T')[0],
        image: newProduct.image || "https://placehold.co/64x64.png",
        imageHint: "product placeholder",
        category: newProduct.category,
        brand: newProduct.brand,
        unitOfMeasure: newProduct.unitOfMeasure,
        description: newProduct.description,
      };
      setProducts(prev => [productToAdd, ...prev]);
      setAddDialogOpen(false);
      setNewProduct(initialNewProductState);
      toast({ title: "Sucesso!", description: "Produto adicionado." });
    } else {
      toast({ variant: "destructive", title: "Erro!", description: "Por favor, preencha todos os campos obrigatórios." });
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
    const productsToExport = filteredProducts;

    if (productsToExport.length === 0) {
      toast({
        variant: "destructive",
        title: "Nenhum produto para exportar",
        description: "Não há produtos na lista atual para exportar.",
      });
      return;
    }

    const csvHeader = [
      "ID", "Nome", "Status", "Preço", "Estoque", "Data de Criação", 
      "URL da Imagem", "Categoria", "Marca", "Unidade de Medida", "Descrição"
    ].join(',');

    const escapeCsvField = (field: string | number): string => {
      const str = String(field);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvRows = productsToExport.map(product => {
      return [
        escapeCsvField(product.id),
        escapeCsvField(product.name),
        escapeCsvField(product.status),
        escapeCsvField(product.price),
        escapeCsvField(product.stock),
        escapeCsvField(product.createdAt),
        escapeCsvField(product.image),
        escapeCsvField(product.category),
        escapeCsvField(product.brand),
        escapeCsvField(product.unitOfMeasure),
        escapeCsvField(product.description),
      ].join(',');
    });

    const csvContent = [csvHeader, ...csvRows].join('\n');
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "produtos.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Exportação Concluída",
      description: `O arquivo "produtos.csv" com ${productsToExport.length} produtos foi baixado.`,
    });
  };

  return (
    <DashboardLayout>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="ativo">Ativo</TabsTrigger>
            <TabsTrigger value="arquivado">
              Arquivado
            </TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Pesquisar produtos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 w-[150px] bg-background pl-8 lg:w-[250px]"
                />
            </div>
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
                <DialogContent className="sm:max-w-[600px]">
                    <form onSubmit={handleAddProduct}>
                        <DialogHeader>
                            <DialogTitle>Adicionar Novo Produto</DialogTitle>
                            <DialogDescription>
                            Preencha as informações do novo produto.
                            </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="h-96 w-full">
                          <div className="grid gap-4 py-4 px-4">
                              <div className="grid gap-2">
                                  <Label htmlFor="name">Nome do Produto</Label>
                                  <Input id="name" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} placeholder="Ex: Camiseta Branca" />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="category">Categoria</Label>
                                    <Input id="category" value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} placeholder="Ex: Vestuário" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="brand">Marca</Label>
                                    <Input id="brand" value={newProduct.brand} onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})} placeholder="Ex: Hyper" />
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="price">Preço</Label>
                                    <Input id="price" type="number" step="0.01" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} placeholder="Ex: 49.99" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="stock">Estoque</Label>
                                    <Input id="stock" type="number" value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} placeholder="Ex: 100" />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="unitOfMeasure">Unidade de Medida</Label>
                                  <Select value={newProduct.unitOfMeasure} onValueChange={(value) => setNewProduct({...newProduct, unitOfMeasure: value})}>
                                    <SelectTrigger id="unitOfMeasure">
                                      <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Unidade">Unidade</SelectItem>
                                      <SelectItem value="Par">Par</SelectItem>
                                      <SelectItem value="Kg">Kg</SelectItem>
                                      <SelectItem value="Litro">Litro</SelectItem>
                                      <SelectItem value="Caixa">Caixa</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="grid gap-2">
                                  <Label htmlFor="image">URL da Imagem</Label>
                                  <Input id="image" value={newProduct.image} onChange={(e) => setNewProduct({...newProduct, image: e.target.value})} placeholder="https://placehold.co/64x64.png" />
                              </div>
                              <div className="grid gap-2">
                                  <Label htmlFor="description">Descrição</Label>
                                  <Textarea id="description" value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} placeholder="Descreva o produto..." />
                              </div>
                          </div>
                        </ScrollArea>
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
        <DialogContent className="sm:max-w-[600px]">
          <form onSubmit={handleEditProduct}>
            <DialogHeader>
              <DialogTitle>Editar Produto</DialogTitle>
              <DialogDescription>
                Atualize as informações do produto.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-96 w-full">
              <div className="grid gap-4 py-4 px-4">
                  <div className="grid gap-2">
                      <Label htmlFor="name-edit">Nome do Produto</Label>
                      <Input id="name-edit" value={editingProduct?.name || ''} onChange={(e) => handleEditChange('name', e.target.value)} />
                  </div>
                   <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="category-edit">Categoria</Label>
                        <Input id="category-edit" value={editingProduct?.category || ''} onChange={(e) => handleEditChange('category', e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="brand-edit">Marca</Label>
                        <Input id="brand-edit" value={editingProduct?.brand || ''} onChange={(e) => handleEditChange('brand', e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="price-edit">Preço</Label>
                        <Input id="price-edit" type="number" step="0.01" value={editingProduct?.price || ''} onChange={(e) => handleEditChange('price', parseFloat(e.target.value) || 0)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="stock-edit">Estoque</Label>
                        <Input id="stock-edit" type="number" value={editingProduct?.stock || ''} onChange={(e) => handleEditChange('stock', parseInt(e.target.value, 10) || 0)} />
                    </div>
                     <div className="grid gap-2">
                      <Label htmlFor="unitOfMeasure-edit">Unidade de Medida</Label>
                      <Select value={editingProduct?.unitOfMeasure} onValueChange={(value) => handleEditChange('unitOfMeasure', value)}>
                        <SelectTrigger id="unitOfMeasure-edit">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Unidade">Unidade</SelectItem>
                          <SelectItem value="Par">Par</SelectItem>
                          <SelectItem value="Kg">Kg</SelectItem>
                          <SelectItem value="Litro">Litro</SelectItem>
                          <SelectItem value="Caixa">Caixa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                   <div className="grid gap-2">
                      <Label htmlFor="image-edit">URL da Imagem</Label>
                      <Input id="image-edit" value={editingProduct?.image || ''} onChange={(e) => handleEditChange('image', e.target.value)} />
                  </div>
                   <div className="grid gap-2">
                      <Label htmlFor="description-edit">Descrição</Label>
                      <Textarea id="description-edit" value={editingProduct?.description || ''} onChange={(e) => handleEditChange('description', e.target.value)} />
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
            </ScrollArea>
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
