export interface ReservationData {
  id: string;
  suiteName: string;
  userEmail: string;
  price: number;
  checkinTime: string;
  checkoutTime: string;
  occupied: boolean;
}

export interface ReservationsTableProps {
  data: ReservationData[];
  isOccupied?: boolean;
  totalItems: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  getActiveReservations?: () => Promise<void>;
}
