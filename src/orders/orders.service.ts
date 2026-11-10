import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { DataSource } from 'typeorm';

import { CreateOrderDto } from './dto/create-order.dto.js';
import { Client } from '../clients/entities/client.entity.js';
import { Product } from '../products/entities/product.entity.js';
import { CustomerOrder } from './entities/order.entity.js';
import { OrderItem } from './entities/order-item.entity.js';

@Injectable()
export class OrdersService {
    constructor(
        private readonly dataSource: DataSource,
    ) {}

    async create(dto: CreateOrderDto) {
        return this.dataSource.transaction(async (manager) => {

            // 1. Verify that the client exists
            const client = await manager.findOneBy(Client, {
                id: dto.clientId,
            });

            if (!client) {
                throw new NotFoundException('Client introuvable');
            }

            // 2. Check for duplicate products
            const ids = dto.items.map((item) => item.productId);

            if (new Set(ids).size !== ids.length) {
                throw new BadRequestException(
                    'Produit duplique dans la commande',
                );
            }

            // 3. Prepare product lookup and snapshots
            const byId = new Map(
                dto.items.map((item) => [
                    item.productId,
                    item,
                ]),
            );

            const snapshots = new Map<number, Product>();

            // 4. Update stock atomically, product by product
            // Sorting IDs helps reduce deadlock risks between transactions
            for (const id of [...ids].sort((a, b) => a - b)) {

                const input = byId.get(id)!;

                const product = await manager.findOneBy(Product, {
                    id,
                });

                if (!product) {
                    throw new NotFoundException(
                        `Produit ${id} introuvable`,
                    );
                }

                const update = await manager
                    .createQueryBuilder()
                    .update(Product)
                    .set({
                        stock: () => `stock - ${input.quantity}`,
                    })
                    .where(
                        'id = :id AND stock >= :qty',
                        {
                            id,
                            qty: input.quantity,
                        },
                    )
                    .execute();

                if (update.affected !== 1) {
                    throw new BadRequestException(
                        `Stock insuffisant: ${id}`,
                    );
                }

                snapshots.set(id, product);
            }

            // 5. Calculate the total price in cents
            const cents = dto.items.reduce((sum, line) => {
                const product = snapshots.get(line.productId)!;

                return (
                    sum +
                    Math.round(Number(product.price) * 100) *
                    line.quantity
                );
            }, 0);

            // 6. Create the order
            const order = await manager.save(
                CustomerOrder,
                manager.create(CustomerOrder, {
                    clientId: client.id,
                    total: (cents / 100).toFixed(2),
                    status: 'CREATED',
                }),
            );

            // 7. Create order items
            for (const line of dto.items) {
                const product = snapshots.get(line.productId)!;

                await manager.save(
                    OrderItem,
                    manager.create(OrderItem, {
                        orderId: order.id,
                        productId: product.id,
                        quantity: line.quantity,
                        unitPrice: product.price,
                    }),
                );
            }

            // 8. Return the complete order
            return manager.findOneOrFail(CustomerOrder, {
                where: {
                    id: order.id,
                },
                relations: {
                    client: true,
                    items: {
                        product: true,
                    },
                },
            });
        });
    }

    // 9. Retrieve all orders with their clients and products
    findAll() {
        return this.dataSource
            .getRepository(CustomerOrder)
            .find({
                relations: {
                    client: true,
                    items: {
                        product: true,
                    },
                },
            });
    }
}
