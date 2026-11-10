import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service.js';
import { OrdersController } from './orders.controller.js';
import { Client } from '../clients/entities/client.entity.js';
import { Product } from '../products/entities/product.entity.js';
import { OrderItem } from './entities/order-item.entity.js';
import { CustomerOrder } from './entities/order.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
imports: [TypeOrmModule.forFeature([CustomerOrder, OrderItem, Product, Client])],
controllers: [OrdersController], providers: [OrdersService],
}) export class OrdersModule {}
