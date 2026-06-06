/* 

  MobX имплементирует в себе состояние, actions, и асинхронные запросы к backend API.
  Он предоставляет управление состоянием и реактивностью используя классовый подход, что позволяет легко обновлять вьюшку при изменении данных.
  В данном случае, ContactStore содержит список контактов, текущую вкладку, и методы для получения, создания, обновления и удаления контактов.

  Однако в реале, для более сложных приложений, может потребоваться разделение на несколько сторов, например, 
    отдельный стор для управления формой создания/редактирования контакта, или стор для управления состоянием загрузки и ошибок. 
  Это поможет поддерживать код чистым и организованным.
  Я же решил оставить все в одном сторе для простоты и удобства, так как приложение не слишком сложное.

*/
import axios from 'axios';
import { makeAutoObservable, runInAction } from 'mobx';

export type ContactCategory = 'work' | 'personal' | 'favorites';

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone?: string;
  category: ContactCategory;
  favorite: boolean;
}

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  category: ContactCategory;
  favorite?: boolean;
}

export type TabFilter = 'all' | 'favorites' | 'work' | 'personal';

// url бэкенда
const API_BASE = 'http://localhost:3000';

export class ContactStore {
  contacts: Contact[] = [];
  loading = false;
  error = '';
  activeTab: TabFilter = 'all';

  constructor() {
    makeAutoObservable(this);
  }

  // геттер для фильтрации контактов в зависимости от выбранной вкладки
  get filteredContacts(): Contact[] {
    if (this.activeTab === 'all') return this.contacts;
    if (this.activeTab === 'favorites') return this.contacts.filter((it) => it.favorite);
    if (this.activeTab === 'work') return this.contacts.filter((it) => it.category === 'work');
    if (this.activeTab === 'personal') return this.contacts.filter((it) => it.category === 'personal');
    return this.contacts;
  }

  // action для смены вкладки
  setTab(tab: TabFilter) {
    this.activeTab = tab;
  }

  // action для установки ошибки в случае неудачного запроса к апи
  setError(message: string) {
    this.error = message;
  }

  // action для получения контактов с сервера и обновления стора
  async refresh(type: 'soft' | 'hard' = 'hard') {
    if(type === 'hard') {
        this.loading = true;
    }
    this.error = '';
    try {
      // искуственная задержка для показа экрана загрузки
      await new Promise((resolve) => setTimeout(resolve, 500));
      const { data } = await axios.get<Contact[]>(`${API_BASE}/contacts`);
      runInAction(() => {
        this.contacts = data;
      });
    } catch (err) {
      this.setError((err as Error).message);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  // action для создания нового контакта
  async createContact(payload: ContactPayload) {
    try {
        await axios.post(`${API_BASE}/contacts`, payload);
        await this.refresh();
    } catch (err) {
        throw new Error('Failed to create contact');
    }
  }

  // action для создания нового контакта
  async updateContact(id: number, payload: Partial<ContactPayload>) {
    try {
        await axios.put(`${API_BASE}/contacts/${id}`, payload);
        await this.refresh('soft');
    } catch (err) {
        throw new Error('Failed to update contact');
    }
  }

  async deleteContact(id: number) {
    try {
      await axios.delete(`${API_BASE}/contacts/${id}`);
      await this.refresh();
    } catch (err) {
      throw new Error('Failed to delete contact');
    }
  }
}

export const contactStore = new ContactStore();
