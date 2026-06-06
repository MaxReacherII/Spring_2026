export type ContactCategory = 'favorites' | 'work' | 'personal';
export interface Contact {
    id: number;
    name: string;
    email: string;
    phone?: string;
    category: 'work' | 'favorites' | 'personal';
    favorite: boolean;
}
export interface CreateContactDto {
    name: string;
    email: string;
    phone?: string;
    category?: 'work' | 'favorites' | 'personal';
    favorite?: boolean;
}
export interface UpdateContactDto {
    name?: string;
    email?: string;
    phone?: string;
    category?: 'work' | 'favorites' | 'personal';
    favorite?: boolean;
}
export declare class AppService {
    private contacts;
    private nextId;
    getAllContacts(): Contact[];
    getContactById(id: number): Contact;
    createContact(createDto: CreateContactDto): Contact;
    updateContact(id: number, updateDto: UpdateContactDto): Contact;
    deleteContact(id: number): void;
}
