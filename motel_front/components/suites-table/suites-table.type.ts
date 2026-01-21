export interface SuiteData {
  id: string;
  name: string;
  price: number;
  units: number; // Quantidade de quartos desse tipo
}

export interface SuitesTableProps {
  data: SuiteData[];
}
