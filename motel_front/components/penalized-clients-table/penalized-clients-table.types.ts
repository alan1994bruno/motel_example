export interface PenalizedClientData {
  id: string;
  email: string;
  penalty: {
    createdAt: string;
    price: number;
    publicId: string;
  };
}

export interface PenalizedClientsTableProps {
  data: PenalizedClientData[];
  totalClients: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
}
