import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
} from '@nestjs/common';

import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ProductsService } from './products.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
    constructor(
        private readonly service: ProductsService,
    ) {}

    @Post()
    @ApiOperation({ summary: 'Ajouter un produit a une categorie' })
    create(@Body() dto: CreateProductDto) {
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

