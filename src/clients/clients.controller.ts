import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';

import { ClientsService } from './clients.service.js';
import { CreateClientDto } from './dto/create-client.dto.js';

@ApiTags('Clients')
@Controller('clients')
export class ClientsController {
    constructor(
        private readonly service: ClientsService,
    ) {}

    @Post()
    create(@Body() dto: CreateClientDto) {
        return this.service.create(dto);
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.service.findOne(id);
    }
}
