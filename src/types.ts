export type ErrorWithMessage = {
    status: number;
    data: {
        message: string;
    };
};

export type User = {
    _id: string;
    name: string;
    email: string;
    role: "user" | "admin" | "moderator";
    password: string;
    bill: number;
    suppliers: Supplier[]
}

export type Supplier = {
    
}