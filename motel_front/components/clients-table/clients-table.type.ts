export interface ClientData {
  id: string;
  email: string;
  isPenalized: boolean;
}

export interface ClientsTableProps {
  data: ClientData[];
  totalClients: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
}
