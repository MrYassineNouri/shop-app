import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity.js';
import type { Relation } from 'typeorm';
@Entity('categories')
export class Category {
@PrimaryGeneratedColumn() id: number;
@Column({ unique: true }) name: string;
@OneToMany(() => Product, (p) => p.category) products: Relation <Product[]>;
}