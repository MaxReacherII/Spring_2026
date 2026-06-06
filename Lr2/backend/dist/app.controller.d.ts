import { AppService, Contact, CreateContactDto, UpdateContactDto } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getAll(): Contact[];
    getById(id: number): Contact;
    create(createDto: CreateContactDto): Contact;
    update(id: number, updateDto: UpdateContactDto): Contact;
    delete(id: number): {
        deleted: true;
    };
}
