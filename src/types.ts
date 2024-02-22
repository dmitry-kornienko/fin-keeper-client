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
    _id: string,
    name: string,
    tax_rate: number,
    tax_from: string,
    is_active: boolean,
    user: User,
    token_stat: string,
    reports: Report[]
}

export type Report = {
    _id: string
}