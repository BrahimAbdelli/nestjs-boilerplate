import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NewsletterEntity } from '../entities/category.entity';
import { NewsletterService } from '../category.service';
import { Test } from '@nestjs/testing';
import { REQUEST } from '@nestjs/core';
import { ObjectID } from 'mongodb';
/* import { eventTypes } from '../entities/event.enum'; */

const mockNewsletterRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  delete: jest.fn()
});

const mockRequest = {
  user: {
    token: 'mocktoken',
    username: 'mock',
    email: 'mock@mock.mock'
  }
};
const mockDate = new Date();

describe('Newsletter Service', () => {
  let newsletterService;
  let newsletterRepository;

  jest.mock('../../../shared/findByField.utils', () => {
    const original = jest.requireActual('./../../../shared/findByField.utils');
    original.default = jest.fn();
    return original;
  });
  const findByField = require('./../../../shared/findByField.utils');

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        NewsletterService,
        {
          provide: getRepositoryToken(NewsletterEntity),
          useFactory: mockNewsletterRepository
        },
        {
          provide: REQUEST,
          useValue: mockRequest
        }
      ]
    }).compile();

    newsletterService = await module.resolve<NewsletterService>(NewsletterService);
    newsletterRepository = await module.get(getRepositoryToken(NewsletterEntity));
  });

  describe('findAll', () => {
    it('gets all newsletter', async () => {
      newsletterRepository.find.mockResolvedValue([new NewsletterEntity()]);
      expect(newsletterRepository.find).not.toHaveBeenCalled();
      const result = await newsletterService.findAll();
      expect(newsletterRepository.find).toHaveBeenCalled();
      expect(result).toEqual([new NewsletterEntity()]);
    });
  });

  describe('create Newsletter', () => {
    it('calls create newsletter and returns saved entity', async () => {
      expect(newsletterRepository.save).not.toHaveBeenCalled();

      const mockNewsletter = {
        commentary: 'Commentary',
        email: 'test@test.tn'
        //state: newsletterStates.waiting
      };
      const resultValues = {
        createdAt: jest.fn(() => mockDate),
        date: jest.fn(() => mockDate),
        commentary: 'undefined',
        email: 'undefined',
        state: 'undefined',
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
      const mockNewsletterResult = new NewsletterEntity();
      Object.assign(mockNewsletterResult, resultValues);
      newsletterRepository.save.mockResolvedValue(mockNewsletterResult);

      const result = await newsletterService.createNewsletter(mockNewsletter);
      expect(result).toEqual(mockNewsletterResult);
    });
  });

  describe('Delete Newsletter', () => {
    it('Call delete repository to delete newsletter and is successful', async () => {
      const mockEntity = new NewsletterEntity();
      const _id = new ObjectID('5e2f63d67c06a754d05da4b6');
      mockEntity._id = _id;
      newsletterRepository.delete.mockResolvedValue({});
      newsletterRepository.findOne.mockResolvedValue(mockEntity);
      const spying = jest.spyOn(findByField, 'findByField').mockReturnValueOnce({ _id });
      expect(newsletterRepository.delete).not.toHaveBeenCalled();
      expect(newsletterRepository.findOne).not.toHaveBeenCalled();
      await newsletterService.delete(_id);
      // expect(newsletterRepository.findOne).toHaveBeenCalledWith({ _id });
      expect(newsletterRepository.delete).toHaveBeenCalledWith({ _id });
    });
  });

  describe('Update Newsletter', () => {
    it('Call update repository to update newsletter and is successful', async () => {
      const mockEntity = new NewsletterEntity();
      const _id = new ObjectID('5e2f63d67c06a754d05da4b6');
      mockEntity._id = _id;

      const mockEntityDto = {
        commentary: 'undefined',
        email: 'undefined',
        state: 'undefined',
        _id: _id
      };

      newsletterRepository.findOne.mockResolvedValue(mockEntity);
      newsletterRepository.save.mockResolvedValue(mockEntity);

      expect(newsletterRepository.findOne).not.toHaveBeenCalled();
      expect(newsletterRepository.save).not.toHaveBeenCalled();
      const result = await newsletterService.update(mockEntity, mockEntityDto);
      // expect(newsletterRepository.findOne).toHaveBeenCalledWith({ _id });
      expect(newsletterRepository.save).toHaveBeenCalledWith(result);
    });
  });
});
