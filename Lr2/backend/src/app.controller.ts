import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import {
  AppService,
  Contact,
  CreateContactDto,
  UpdateContactDto,
} from './app.service';

@Controller('contacts')
export class AppController {
  constructor(@Inject(AppService) private readonly appService: AppService) {}

  @Get()
  getAll(): Contact[] {
    return this.appService.getAllContacts();
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number): Contact {
    return this.appService.getContactById(id);
  }

  @Post()
  create(@Body() createDto: CreateContactDto): Contact {
    return this.appService.createContact(createDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateContactDto,
  ): Contact {
    return this.appService.updateContact(id, updateDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): { deleted: true } {
    this.appService.deleteContact(id);
    return { deleted: true };
  }
}
