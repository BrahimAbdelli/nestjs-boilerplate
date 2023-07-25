import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../shared/base/base.service';
import { IGetUserAuthInfoRequest } from '../../shared/user-request.interface';
import { ProductCreateDto, ProductUpdateDto } from './dtos';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class ProductService extends BaseService<ProductEntity, ProductCreateDto, ProductUpdateDto> {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @Inject(REQUEST) public readonly request: IGetUserAuthInfoRequest
  ) {
    super(productRepository, request);
  }

  //In case you want to override a method in the baseservice,
  //this is how you proceed
  async create(dto: ProductCreateDto): Promise<ProductEntity> {
    const newProduct = Object.assign(new ProductEntity(), dto);
    newProduct.isDeleted = false;
    return await this.productRepository.save(newProduct);
  }
}
