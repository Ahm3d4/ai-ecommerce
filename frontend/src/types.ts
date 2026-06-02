export interface User {
    id: number;
    email: string;
    fullName: string;
    role: string; // e.g., 'Customer' or 'Admin'
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    balance: number
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, fullName: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    refreshBalance: () => void;
}