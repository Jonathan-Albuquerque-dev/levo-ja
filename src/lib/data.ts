
export type OrderStatus = 'Confirmado' | 'Em Andamento' | 'Saiu para Entrega' | 'Finalizado'

export type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export type Order = {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  orderDate: string;
  total: number;
  items: OrderItem[];
  shippingAddress: string;
};

export type Customer = {
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

export type Product = {
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


export const initialCustomers: Customer[] = [
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

export const initialProducts: Product[] = [
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

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
const todayString = `${year}-${month}-${day}`;

export const initialOrders: Order[] = [
  {
    id: "ORD001",
    customerId: "1",
    customerName: "Ana Silva",
    customerEmail: "ana.silva@email.com",
    status: "Confirmado",
    orderDate: todayString,
    total: 190.00,
    items: [{ id: "1", name: "Camiseta Hyper-Brilho Laser", quantity: 2, price: 49.99 }, { id: "2", name: "Moletom com Capuz Eco-Conforto", quantity: 1, price: 89.99 }],
    shippingAddress: "Rua das Flores, 123, São Paulo, SP"
  },
  {
    id: "ORD002",
    customerId: "2",
    customerName: "Bruno Costa",
    customerEmail: "bruno.costa@email.com",
    status: "Em Andamento",
    orderDate: todayString,
    total: 150.00,
    items: [{ id: "1", name: "Camiseta Hyper-Brilho Laser", quantity: 3, price: 49.99 }],
    shippingAddress: "Avenida Copacabana, 456, Rio de Janeiro, RJ"
  },
  {
    id: "ORD003",
    customerId: "1",
    customerName: "Ana Silva",
    customerEmail: "ana.silva@email.com",
    status: "Saiu para Entrega",
    orderDate: todayString,
    total: 340.00,
    items: [{ id: "3", name: "Tênis de Corrida Zyon-Flex", quantity: 1, price: 159.90 }, { id: "2", name: "Moletom com Capuz Eco-Conforto", quantity: 2, price: 89.99 }],
    shippingAddress: "Rua das Flores, 123, São Paulo, SP"
  },
  {
    id: "ORD004",
    customerId: "2",
    customerName: "Bruno Costa",
    customerEmail: "bruno.costa@email.com",
    status: "Finalizado",
    orderDate: todayString,
    total: 450.00,
    items: [{ id: "1", name: "Camiseta Hyper-Brilho Laser", quantity: 9, price: 49.99 }],
    shippingAddress: "Avenida Copacabana, 456, Rio de Janeiro, RJ"
  },
];
