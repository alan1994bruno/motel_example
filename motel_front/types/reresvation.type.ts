import { RoomType } from "./rooms.type";

export type ReservationSummary = {
  publicId: string; // uuid
  checkinTime: string; // ISO 8601 datetime
  checkoutTime: string; // ISO 8601 datetime
  occupied: boolean;
  penaltyApplied: boolean;
  price: number;
  room: RoomType;
};

export interface RoomImage {
  url: string;
  publicId: string;
}

export interface UserProfile {
  cep: string;
  cpf: string;
  phone: string;
  publicId: string;
}

export interface UserRole {
  level: string; // ex: "CLIENT", "ADMIN"
  publicId: string;
}

export interface Authority {
  authority: string;
}

// --- 2. Entidades Principais (Quarto e Usuário) ---

export interface RoomData {
  hourlyRate: number;
  images: RoomImage[];
  name: string;
  publicId: string;
  units: number;
}

export interface UserData {
  publicId: string;
  username: string;
  email: string;
  enabled: boolean;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  authorities: Authority[];
  role: UserRole;
  profile: UserProfile;
  penalty: any | null; // Pode ser null ou um objeto de penalidade futura
}

// --- 3. O objeto de Reserva (Item do array 'content') ---

export interface ReservationItem {
  publicId: string;
  checkinTime: string; // ISO Date String
  checkoutTime: string; // ISO Date String
  price: number;

  // Status flags
  cancelled: boolean;
  cancelledAt: string | null;
  occupied: boolean;
  penaltyApplied: boolean;

  // Relacionamentos
  room: RoomData;
  user: UserData;
}

export type ReservationRequest = {
  roomPublicId: string; // uuid
  checkinTime: string; // ISO 8601 datetime
  checkoutTime: string; // ISO 8601 datetime
};

// --- 4. Estrutura de Paginação (Genérica) ---

export interface SortInfo {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface PageableInfo {
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
  sort: SortInfo;
}

// Interface genérica para qualquer resposta paginada da sua API
export interface PaginatedResponse<T> {
  content: T[];
  pageable: PageableInfo;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: SortInfo;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

// --- 5. O Tipo Final Específico para essa Resposta ---

export type ReservationApiResponse = PaginatedResponse<ReservationItem>;
