export type Authority = {
  authority: string; // ex: "ROLE_CLIENT"
};

export type UserRole = {
  level: string; // ex: "CLIENT"
  publicId: string; // uuid
};

export type UserProfile = {
  publicId: string; // uuid
  cep: string | null;
  cpf: string;
  phone: string;
};

export type User = {
  publicId: string; // uuid
  username: string;
  email: string;
  penalty?: {
    createdAt: string;
    price: number;
    publicId: string;
  };

  enabled: boolean;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;

  authorities: Authority[];
  role: UserRole;
  profile: UserProfile;
};

export interface UpdateUserClientData {
  email: string;
  phone: string;
  cpf: string;
  cep: string;
  password?: string; // <--- (Opcional)
}
