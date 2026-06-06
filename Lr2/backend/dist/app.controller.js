"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
let AppController = class AppController {
    appService;
    constructor(appService) {
        this.appService = appService;
    }
    getAll() {
        return this.appService.getAllContacts();
    }
    getById(id) {
        return this.appService.getContactById(id);
    }
    create(createDto) {
        return this.appService.createContact(createDto);
    }
    update(id, updateDto) {
        return this.appService.updateContact(id, updateDto);
    }
    delete(id) {
        this.appService.deleteContact(id);
        return { deleted: true };
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)()
], AppController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe))
], AppController.prototype, "getById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)())
], AppController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)())
], AppController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe))
], AppController.prototype, "delete", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)('contacts'),
    __param(0, (0, common_1.Inject)(app_service_1.AppService))
], AppController);
//# sourceMappingURL=app.controller.js.map