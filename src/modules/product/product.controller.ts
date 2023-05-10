import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../shared/base/base.controller';
import { ProductCreateDto, ProductUpdateDto } from './dtos';
import { ProductEntity } from './entities/product.entity';
import { ProductService } from './product.service';

@Controller('products')
@ApiTags('products')
export class ProductController extends BaseController<ProductEntity, ProductCreateDto, ProductUpdateDto>(
  ProductCreateDto,
  ProductUpdateDto
) {
  constructor(private readonly productService: ProductService) {
    super(productService);
  }

  //In case you want to override a method in the basecontroller, this is how
  //you proceed
  @Post()
  async create(@Body() dto: ProductCreateDto): Promise<ProductEntity> {
    return this.productService.create(dto);
  }
}
