
import { DashboardLayout } from "@/components/dashboard-layout"
import {
  File,
  ListFilter,
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
  DropdownMenuCheckboxItem,
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

export default function ProdutosPage() {
  return (
    <DashboardLayout>
      <Tabs defaultValue="todos">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="ativo">Ativo</TabsTrigger>
            <TabsTrigger value="arquivado" className="hidden sm:flex">
              Arquivado
            </TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filtro
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>
                  Ativo
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>
                  Arquivado
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Exportar
              </span>
            </Button>
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Adicionar Produto
              </span>
            </Button>
          </div>
        </div>
        <TabsContent value="todos">
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
                    <TableHead className="hidden md:table-cell">
                      Vendas
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
                  <TableRow>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt="Imagem do Produto"
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src="https://placehold.co/64x64.png"
                        width="64"
                        data-ai-hint="tshirt product"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      Camiseta Hyper-Brilho Laser
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Ativo</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      R$49,99
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      25
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      2023-07-12 10:42
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
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem>Duplicar</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Deletar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt="Imagem do Produto"
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src="https://placehold.co/64x64.png"
                        width="64"
                        data-ai-hint="hoodie product"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      Moletom com Capuz Eco-Conforto
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Ativo</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      R$89,99
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      102
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      2023-10-18 03:21
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
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem>Duplicar</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Deletar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Mostrando <strong>1-2</strong> de <strong>32</strong> produtos
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
