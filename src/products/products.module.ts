import { Module } from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { ProductsController } from './products.controller.js';
import { Category } from '../categories/entities/category.entity.js';
import { Product } from './entities/product.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
imports: [TypeOrmModule.forFeature([Product, Category])],
controllers: [ProductsController], providers: [ProductsService],
}) export class ProductsModule {}
