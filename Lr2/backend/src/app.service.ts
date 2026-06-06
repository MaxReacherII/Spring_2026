import { Injectable, NotFoundException } from '@nestjs/common';

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

@Injectable()
export class AppService {
  private contacts: Contact[] = [];
  private nextId = 1;

  getAllContacts(): Contact[] {
    return this.contacts;
  }

  getContactById(id: number): Contact {
    const contact = this.contacts.find((item) => item.id === id);
    if (!contact) {
      throw new NotFoundException(`Contact with id=${id} not found`);
    }
    return contact;
  }

  createContact(createDto: CreateContactDto): Contact {
    const newContact: Contact = {
      id: this.nextId++,
      name: createDto.name,
      email: createDto.email,
      phone: createDto.phone,
      category: createDto.category ?? 'personal',
      favorite: createDto.favorite ?? false,
    };
    this.contacts.push(newContact);
    return newContact;
  }

  updateContact(id: number, updateDto: UpdateContactDto): Contact {
    const contact = this.getContactById(id);
    contact.name = updateDto.name ?? contact.name;
    contact.email = updateDto.email ?? contact.email;
    contact.phone = updateDto.phone ?? contact.phone;
    contact.category = updateDto.category ?? contact.category;
    contact.favorite = updateDto.favorite ?? contact.favorite;
    return contact;
  }

  deleteContact(id: number): void {
    this.getContactById(id);
    this.contacts = this.contacts.filter((item) => item.id !== id);
  }
}
