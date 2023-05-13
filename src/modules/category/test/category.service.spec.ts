import { REQUEST } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ObjectID } from 'mongodb';
import { PaginationConstants } from '../../../shared/constants/pagination.enum';
import { ComparaisonTypeEnum, ComparatorEnum } from '../../../shared/search/search-dto';
import { SearchResponse } from '../../../shared/search/search-response.dto';
import { CategoryService } from '../category.service';
import { CategoryEntity } from '../entities/category.entity';

const mockCategoryRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  clear: jest.fn(),
  preload: jest.fn(),
  findAndCount: jest.fn(),
  create: jest.fn()
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

describe('Category Service', () => {
  let categoryService;
  let categoryRepository;

  jest.mock('../../../shared/utils/find-by-field.utils', () => {
    const original = jest.requireActual('./../../../shared/utils/find-by-field.utils');
    original.default = jest.fn();
    return original;
  });
  const findByField = require('./../../../shared/utils/find-by-field.utils');

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(CategoryEntity),
          useFactory: mockCategoryRepository
        },
        {
          provide: REQUEST,
          useValue: mockRequest
        }
      ]
    }).compile();

    categoryService = await module.resolve<CategoryService>(CategoryService);
    categoryRepository = await module.get(getRepositoryToken(CategoryEntity));
  });

  describe('findAll', () => {
    it('gets all categories', async () => {
      categoryRepository.find.mockResolvedValue([new CategoryEntity()]);
      expect(categoryRepository.find).not.toHaveBeenCalled();
      const result = await categoryService.findAll();
      expect(categoryRepository.find).toHaveBeenCalled();
      expect(result).toEqual([new CategoryEntity()]);
    });
  });

  describe('Create Category', () => {
    it('calls create category and returns saved entity', async () => {
      expect(categoryRepository.save).not.toHaveBeenCalled();

      const mockCategory = {
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
      const mockNewsletterResult = new CategoryEntity();
      Object.assign(mockNewsletterResult, resultValues);
      categoryRepository.save.mockResolvedValue(mockNewsletterResult);

      const result = await categoryService.create(mockCategory);
      expect(result).toEqual(mockNewsletterResult);
    });
  });

  describe('Delete Category', () => {
    it('Call delete repository to delete category and is successful', async () => {
      // Mock data
      const mockId = new ObjectID();

      // Mock repository methods
      const findByFieldSpy = jest.spyOn(findByField, 'findByField').mockResolvedValueOnce({});
      categoryService.repository.delete.mockResolvedValueOnce(undefined);

      // Call service method
      await categoryService.delete(mockId);

      // Expect repository methods to have been called with correct arguments
      expect(findByFieldSpy).toHaveBeenCalledWith(categoryService.repository, { _id: mockId }, true);
      expect(categoryService.repository.delete).toHaveBeenCalledWith(mockId);
    });
  });

  describe('Clear Categories', () => {
    it('Call delete repository to delete category and is successful', async () => {
      await categoryService.clear();
      expect(categoryRepository.clear).toHaveBeenCalled();
    });
  });

  describe('Update Category', () => {
    it('should update an entity and return the updated entity', async () => {
      // Mock data
      const mockId = new ObjectID();
      const mockDto = { name: 'Updated Category', price: 10.99 };
      const mockEntity = new CategoryEntity();
      mockEntity._id = mockId;
      const mockUpdatedEntity = new CategoryEntity();
      mockUpdatedEntity._id = mockId;
      mockUpdatedEntity.name = 'Updated Category';

      // Mock repository methods
      categoryService.repository.findOne.mockResolvedValueOnce(mockEntity);
      categoryService.repository.preload.mockResolvedValueOnce(mockUpdatedEntity);
      categoryService.repository.save.mockResolvedValueOnce(mockUpdatedEntity);

      // Call service method
      const result = await categoryService.update(mockId, mockDto);

      // Expect repository methods to have been called with correct arguments
      //expect(categoryService.repository.findOne).toHaveBeenCalledWith(mockId);
      expect(categoryService.repository.preload).toHaveBeenCalledWith({
        _id: mockEntity._id,
        ...mockDto
      });
      expect(categoryService.repository.save).toHaveBeenCalledWith(mockUpdatedEntity);

      // Expect the updated entity to be returned
      expect(result).toEqual(mockUpdatedEntity);
    });
  });

  describe('Updating status when the category exists', () => {
    const categoryId = new ObjectID('5e2f63d67c06a754d05da4b6');

    beforeEach(() => {
      const mockCategory = new CategoryEntity();
      mockCategory._id = categoryId;
      mockCategory.isDeleted = false;

      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(mockCategory);
      jest.spyOn(categoryRepository, 'save').mockResolvedValue(mockCategory);
    });

    it('should update the category status', async () => {
      const updatedCategory = await categoryService.updateStatus(categoryId, true);

      expect(updatedCategory).toBeDefined();
      expect(updatedCategory._id).toEqual(categoryId);
      expect(updatedCategory.isDeleted).toBeTruthy();
      expect(categoryRepository.findOne).toHaveBeenCalledTimes(1);
      expect(categoryRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('Updating status when the category does not exist', () => {
    const categoryId = new ObjectID('5e2f63d67c06a754d05da4b6');

    beforeEach(() => {
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(null);
    });

    it('should throw a TypeError', async () => {
      await expect(categoryService.updateStatus(categoryId, true)).rejects.toThrow(TypeError);
      expect(categoryRepository.findOne).toHaveBeenCalledTimes(1);
      expect(categoryRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('Search Categories', () => {
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
      const expectedResponse: SearchResponse<CategoryEntity> = {
        data: [new CategoryEntity(), new CategoryEntity()],
        count: 2,
        page: 0,
        totalPages: 1
      };

      jest
        .spyOn(categoryRepository, 'findAndCount')
        .mockResolvedValueOnce([expectedResponse.data, expectedResponse.count]);

      const result = await categoryService.search(mockData);

      expect(categoryRepository.findAndCount).toHaveBeenCalledWith({
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

  describe('Paginate Categories', () => {
    it('should paginate results with default values', async () => {
      // Mock data
      const mockResults = [
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' }
      ];
      const mockTotal = 2;
      const mockCondition = { isDeleted: false };
      const mockTake = PaginationConstants.DEFAULT_TAKE;
      const mockSkip = PaginationConstants.DEFAULT_SKIP;

      // Mock repository method
      categoryService.repository.findAndCount.mockResolvedValueOnce([mockResults, mockTotal]);

      // Call service method
      const result = await categoryService.paginate(mockTake, mockSkip, mockCondition);

      // Expect repository method to have been called with correct arguments
      expect(categoryService.repository.findAndCount).toHaveBeenCalledWith({
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
      const mockResults = [{ id: 1, name: 'Category 1' }];
      const mockTotal = 1;
      const mockCondition = { isDeleted: false };
      const mockTake = 5;
      const mockSkip = 10;
      const mockType = 'type1';

      // Mock repository method
      categoryService.repository.findAndCount.mockResolvedValueOnce([mockResults, mockTotal]);

      // Call service method
      const result = await categoryService.paginate(mockTake, mockSkip, mockCondition, mockType);

      // Expect repository method to have been called with correct arguments
      expect(categoryService.repository.findAndCount).toHaveBeenCalledWith({
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
