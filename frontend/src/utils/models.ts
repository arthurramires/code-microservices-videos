export interface ListResponse<T> {
    data: T[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    },
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: number;
        per_page: number;
        to: number;
        total: number;
    }
}

export interface Timestampable {
    deleted_at: string | null; 
    created_at: string;
    updated_at:string;
}

export interface Category extends Timestampable {
    id: string;
    name: string;
    description: string;
    is_active: boolean;
}

export interface CastMember extends Timestampable{
    id: string;
    name: string;
    type: number;
}

export interface Genre extends Timestampable {
    id: string;
    name: string;
    is_active: boolean;
    categories: Category[];
}