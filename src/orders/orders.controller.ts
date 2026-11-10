import {
    Body,
    Controller,
    Get,
    Post,
} from '@nestjs/common';

import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { OrdersService } from './orders.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
    constructor(
        private readonly service: OrdersService,
    ) {}

    @Post()
    @ApiOperation({
        summary: 'Commander avec verification du stock',
    })
    create(@Body() dto: CreateOrderDto) {
        return this.service.create(dto);
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }
}
