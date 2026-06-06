"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
let AppService = class AppService {
    contacts = [];
    nextId = 1;
    getAllContacts() {
        return this.contacts;
    }
    getContactById(id) {
        const contact = this.contacts.find((item) => item.id === id);
        if (!contact) {
            throw new common_1.NotFoundException(`Contact with id=${id} not found`);
        }
        return contact;
    }
    createContact(createDto) {
        const newContact = {
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
    updateContact(id, updateDto) {
        const contact = this.getContactById(id);
        contact.name = updateDto.name ?? contact.name;
        contact.email = updateDto.email ?? contact.email;
        contact.phone = updateDto.phone ?? contact.phone;
        contact.category = updateDto.category ?? contact.category;
        contact.favorite = updateDto.favorite ?? contact.favorite;
        return contact;
    }
    deleteContact(id) {
        this.getContactById(id);
        this.contacts = this.contacts.filter((item) => item.id !== id);
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
//# sourceMappingURL=app.service.js.map