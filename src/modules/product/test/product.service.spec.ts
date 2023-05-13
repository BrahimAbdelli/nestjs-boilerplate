import { REQUEST } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ObjectID } from 'mongodb';
import { ComparaisonTypeEnum, ComparatorEnum } from '../../../shared/search/search-dto';
import { SearchResponse } from '../../../shared/search/search-response.dto';
import { ProductEntity } from '../entities/product.entity';
import { ProductService } from '../product.service';
import { PaginationConstants } from './../../../shared/constants/pagination.enum';

const mockProductRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  clear: jest.fn(),
  preload: jest.fn(),
  findAndCount: jest.fn()
});

const mockRequest = {
  user: {
    token: 'mocktoken',
    username: 'mock',
    email: 'mock@mock.mock',
    _id: new ObjectID('645c12b8515b06f417f8041a')
  }
};
const mockDate = new Date();

describe('Product Service', () => {
  let productService;
  let productRepository;

  /*   jest.mock('../../../shared/utils/find-by-field.utils', () => {
    const original = jest.requireActual('./../../../shared/utils/find-by-field.utils');
    original.default = jest.fn();
    return original;
  }); */
  jest.mock('../../../shared/utils/find-by-field.utils', () => {
    const original = jest.requireActual('../../../shared/utils/find-by-field.utils');
    original.default = jest.fn();
    return original;
  });
  const findByField = require('../../../shared/utils/find-by-field.utils');
  //const findByField = require('./../../../shared/utils/find-by-field.utils');

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(ProductEntity),
          useFactory: mockProductRepository
        },
        {
          provide: REQUEST,
          useValue: mockRequest
        }
      ]
    }).compile();

    productService = await module.resolve<ProductService>(ProductService);
    productRepository = await module.get(getRepositoryToken(ProductEntity));
  });

  describe('findAll', () => {
    it('gets all products', async () => {
      productRepository.find.mockResolvedValue([new ProductEntity()]);
      expect(productRepository.find).not.toHaveBeenCalled();
      const result = await productService.findAll();
      expect(productRepository.find).toHaveBeenCalled();
      expect(result).toEqual([new ProductEntity()]);
    });
  });

  describe('Create Product', () => {
    it('calls create product and returns saved entity', async () => {
      expect(productRepository.save).not.toHaveBeenCalled();

      const mockProduct = {
        description: 'undefined',
        price: null,
        name: 'undefined'
      };
      const resultValues = {
        createdAt: jest.fn(() => mockDate),
        date: jest.fn(() => mockDate),
        description: 'undefined',
        price: null,
        name: 'undefined',
        lastUpdateAt: jest.fn(() => mockDate),
        userCreated: {
          email: 'mock@mock.mock',
          username: 'mock'
        },
        userUpdated: {
          email: 'mock@mock.mock',
          username: 'mock'
        }
      };
      const mockNewsletterResult = new ProductEntity();
      Object.assign(mockNewsletterResult, resultValues);
      productRepository.save.mockResolvedValue(mockNewsletterResult);

      const result = await productService.create(mockProduct);
      expect(result).toEqual(mockNewsletterResult);
    });
  });

  describe('Delete Product', () => {
    it('Call delete repository to delete product and is successful', async () => {
      // Mock data
      const mockId = new ObjectID();

      // Mock repository methods
      const findByFieldSpy = jest.spyOn(findByField, 'findByField').mockResolvedValueOnce({});
      productService.repository.delete.mockResolvedValueOnce(undefined);

      // Call service method
      await productService.delete(mockId);

      // Expect repository methods to have been called with correct arguments
      expect(findByFieldSpy).toHaveBeenCalledWith(productService.repository, { _id: mockId }, true);
      expect(productService.repository.delete).toHaveBeenCalledWith(mockId);
    });
  });

  describe('Clear Products', () => {
    it('Call delete repository to clear products and is successful', async () => {
      await productService.clear();
      expect(productRepository.clear).toHaveBeenCalled();
    });
  });

  describe('Update Product', () => {
    it('should update an entity and return the updated entity', async () => {
      // Mock data
      const mockId = new ObjectID();
      const mockDto = { name: 'Updated Product', price: 10.99 };
      const mockEntity = new ProductEntity();
      mockEntity._id = mockId;
      const mockUpdatedEntity = new ProductEntity();
      mockUpdatedEntity._id = mockId;
      mockUpdatedEntity.name = 'Updated Product';
      mockUpdatedEntity.price = 10.99;

      // Mock repository methods
      const findByFieldMock = jest.spyOn(findByField, 'findByField').mockResolvedValueOnce(mockEntity);
      productService.repository.preload.mockResolvedValueOnce(mockUpdatedEntity);
      productService.repository.save.mockResolvedValueOnce(mockUpdatedEntity);

      // Call service method
      const result = await productService.update(mockId, mockDto);

      // Expect repository methods to have been called with correct arguments
      expect(findByFieldMock).toHaveBeenCalledWith(productService.repository, { id: mockId }, true);
      expect(productService.repository.preload).toHaveBeenCalledWith({
        _id: expect.any(ObjectID), // Expect an instance of ObjectID
        ...mockDto
      });
      expect(productService.repository.save).toHaveBeenCalledWith(mockUpdatedEntity);

      // Expect the updated entity to be returned
      expect(result).toEqual(mockUpdatedEntity);
    });
  });

  describe('Updating status when the product exists', () => {
    const productId = new ObjectID('5e2f63d67c06a754d05da4b6');

    beforeEach(() => {
      const mockProduct = new ProductEntity();
      mockProduct._id = productId;
      mockProduct.isDeleted = false;

      jest.spyOn(productRepository, 'findOne').mockResolvedValue(mockProduct);
      jest.spyOn(productRepository, 'save').mockResolvedValue(mockProduct);
    });

    it('should update the product status', async () => {
      const updatedProduct = await productService.updateStatus(productId, true);

      expect(updatedProduct).toBeDefined();
      expect(updatedProduct._id).toEqual(productId);
      expect(updatedProduct.isDeleted).toBeTruthy();
      expect(productRepository.findOne).toHaveBeenCalledTimes(1);
      expect(productRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('Updating status when the product does not exist', () => {
    const productId = new ObjectID('5e2f63d67c06a754d05da4b6');

    beforeEach(() => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(null);
    });

    it('should throw a TypeError', async () => {
      await expect(productService.updateStatus(productId, true)).rejects.toThrow(TypeError);
      expect(productRepository.findOne).toHaveBeenCalledTimes(1);
      expect(productRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('Search Products', () => {
    const mockData = {
      take: '5',
      skip: '0',
      attributes: [
        { key: 'name', value: 'test', comparator: ComparatorEnum.LIKE },
        { key: 'price', value: 100, comparator: ComparatorEnum.EQUALS }
      ],
      orders: {
        name: 'ASC',
        price: 'DESC'
      },
      type: ComparaisonTypeEnum.AND,
      isPaginable: true
    };

    it('should return expected search response', async () => {
      const expectedResponse: SearchResponse<ProductEntity> = {
        data: [new ProductEntity(), new ProductEntity()],
        count: 2,
        page: 0,
        totalPages: 1
      };

      jest
        .spyOn(productRepository, 'findAndCount')
        .mockResolvedValueOnce([expectedResponse.data, expectedResponse.count]);

      const result = await productService.search(mockData);

      expect(productRepository.findAndCount).toHaveBeenCalledWith({
        where: {
          $and: [{ name: /^test/i }, { price: 100 }]
        },
        order: {
          name: 'ASC',
          price: 'DESC'
        },
        take: 5,
        skip: 0
      });

      expect(result).toEqual(expectedResponse);
    });
  });

  describe('Paginate Products', () => {
    it('should paginate results with default values', async () => {
      // Mock data
      const mockResults = [
        { id: 1, name: 'Product 1' },
        { id: 2, name: 'Product 2' }
      ];
      const mockTotal = 2;
      const mockCondition = { isDeleted: false };
      const mockTake = PaginationConstants.DEFAULT_TAKE;
      const mockSkip = PaginationConstants.DEFAULT_SKIP;

      // Mock repository method
      productService.repository.findAndCount.mockResolvedValueOnce([mockResults, mockTotal]);

      // Call service method
      const result = await productService.paginate(mockTake, mockSkip, mockCondition);

      // Expect repository method to have been called with correct arguments
      expect(productService.repository.findAndCount).toHaveBeenCalledWith({
        where: mockCondition,
        take: mockTake,
        skip: mockSkip
      });

      // Expect service method to return correct result
      expect(result).toEqual({
        data: mockResults,
        count: mockTotal
      });
    });

    it('should paginate results with custom values', async () => {
      // Mock data
      const mockResults = [{ id: 1, name: 'Product 1' }];
      const mockTotal = 1;
      const mockCondition = { isDeleted: false };
      const mockTake = 5;
      const mockSkip = 10;
      const mockType = 'type1';

      // Mock repository method
      productService.repository.findAndCount.mockResolvedValueOnce([mockResults, mockTotal]);

      // Call service method
      const result = await productService.paginate(mockTake, mockSkip, mockCondition, mockType);

      // Expect repository method to have been called with correct arguments
      expect(productService.repository.findAndCount).toHaveBeenCalledWith({
        where: { ...mockCondition, ...{ type: mockType } },
        take: mockTake,
        skip: mockSkip
      });

      // Expect service method to return correct result
      expect(result).toEqual({
        data: mockResults,
        count: mockTotal
      });
    });
  });
});
