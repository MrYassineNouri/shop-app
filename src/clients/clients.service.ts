import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Client } from './entities/client.entity.js';
import { CreateClientDto } from './dto/create-client.dto.js';

@Injectable()
export class ClientsService {
    constructor(
        @InjectRepository(Client)
        private readonly repo: Repository<Client>,
    ) {}

    create(dto: CreateClientDto) {
        const client = this.repo.create(dto);

        return this.repo.save(client);
    }

    findAll() {
        return this.repo.find();
    }

    async findOne(id: number) {
        const client = await this.repo.findOneBy({ id });

        if (!client) {
            throw new NotFoundException('Client introuvable');
        }

        return client;
    }
}
