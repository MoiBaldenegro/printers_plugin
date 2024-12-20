export const tableConfig: {
  text: string;
  align?: 'LEFT' | 'CENTER' | 'RIGHT';
  width?: number;
  cols?: number;
  bold?: boolean;
}[] = [
  { text: '000', align: 'LEFT', width: 0.08 },
  { text: 'Product Name', align: 'LEFT', width: 0.44 },
  { text: '$0,000.00', align: 'LEFT', width: 0.22 },
  { text: '$0,000.00', align: 'LEFT', width: 0.22 },
];

export const tableHead: {
  text: string;
  align?: 'LEFT' | 'CENTER' | 'RIGHT';
  width?: number;
  cols?: number;
  bold?: boolean;
}[] = [
  { text: 'Can', align: 'LEFT', width: 0.08 },
  { text: 'Producto', align: 'LEFT', width: 0.44 },
  { text: 'Precio', align: 'LEFT', width: 0.22 },
  { text: 'Importe', align: 'LEFT', width: 0.22 },
];
