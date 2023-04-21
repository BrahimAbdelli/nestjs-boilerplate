import { UsersService } from '../../users/users.service';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { NewsletterEntity } from '../entities/category.entity';
import { NewsletterService } from '../category.service';
import { NewsletterController } from '../category.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { ObjectID } from 'mongodb';
import { newsletterStates } from '../entities/category.state.enum';
//import { eventTypes } from '../entities/event.enum';
// import { findByField } from './../../../shared/findByField.utils';

const mockNewsletter = new NewsletterEntity();
mockNewsletter._id = new ObjectID('5e2f63d67c06a754d05da4b7');
mockNewsletter.commentary = 'Commentary';
mockNewsletter.email = 'test@test.tn';
mockNewsletter.state = newsletterStates.waiting;

describe('NewsletterController (e2e)', () => {
  jest.mock('./../../../shared/findByField.utils', () => {
    const original = jest.requireActual('./../../../shared/findByField.utils');
    original.default = jest.fn(notFound => {
      if (notFound) {
        throw new HttpException({ Newsletter: 'Not found' }, 400);
      }
      return mockNewsletter;
    });
    return original;
  });
  const findByField = require('./../../../shared/findByField.utils');

  jest.mock('./../../../shared/isFieldUnique.utils', () => {
    const original = jest.requireActual('./../../../shared/isFieldUnique.utils');
    original.default = jest.fn(notFound => {
      if (notFound) {
        return false;
      }
      return true;
    });
    return original;
  });
  const isFieldUnique = require('./../../../shared/isFieldUnique.utils');

  let app: INestApplication;

  const notFoundException = { message: 'Check passed ID', errors: { Newsletter: 'Not found' } };
  const idRequiredException = {
    statusCode: 404,
    error: 'Not Found',
    message: 'Cannot GET /newsletters/'
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      // imports: [AppModule],
      controllers: [NewsletterController],
      providers: [
        {
          provide: 'NewsletterEntityRepository',
          useFactory: () => ({})
        },
        {
          provide: NewsletterService,
          useFactory: () => ({
            findAll: jest.fn(() => ['new NewsletterEntity()']),
            findById: jest.fn(id => {
              if (!id) {
                throw new HttpException({ Id: 'id param is required' }, 400);
              }
              if (id === '5e2f63d67c06a754d05da4b7') {
                return mockNewsletter;
              } else {
                throw new HttpException({ Newsletter: 'Not found' }, 400);
              }
            }),
            createNewsletter: jest.fn(newsletterData => {
              // console.log(newsletterData);
              if (!newsletterData) {
                throw new HttpException({ Newsletter: 'Not found' }, 400);
              }
              return mockNewsletter;
            }),
            update: jest.fn((_id, newsletterData) => {
              if (!_id) {
                throw new HttpException({ Id: 'id param is required' }, 400);
              }
              if (_id._id.toHexString() === '5e2f63d67c06a754d05da4b7') {
                newsletterData._id = mockNewsletter._id;
                return newsletterData;
              } else {
                throw new HttpException({ Newsletter: 'Not found' }, 400);
              }
            }),
            delete: jest.fn(_id => {
              if (!_id) {
                throw new HttpException({ Id: 'id param is required' }, 400);
              }
              if (_id.toHexString() === '5e2f63d67c06a754d05da4b7') {
                return {};
              } else {
                throw new HttpException({ Newsletter: 'Not found' }, 400);
              }
            })
          })
        },
        {
          provide: UsersService,
          useFactory: () => ({
            populateUsers: jest.fn(entity => {
              return entity;
            })
          })
        }
      ]
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/newsletters (GET) GET ALL', () => {
    it('/newsletters', () => {
      return request(app.getHttpServer()).get('/newsletters').expect(200).expect(['new NewsletterEntity()']);
    });
  });

  describe('/newsletters/:id (GET)', () => {
    it('/newsletters/:id (GET) 200', () => {
      const expected = {
        _id: '5e2f63d67c06a754d05da4b7',
        commentary: 'Commentary',
        email: 'test@test.tn',
        state: newsletterStates.waiting
      };
      const spying = jest.spyOn(findByField, 'findByField').mockReturnValueOnce(mockNewsletter);
      return (
        request(app.getHttpServer())
          .get('/newsletters/5e2f63d67c06a754d05da4b7')
          // .expect(({ body }) => global.console.log(body))
          .expect(200)
          .expect(expected)
      );
    });

    /*     it('/newsletter/:id (GET) NO ID 400', () => {
      return (
        request(app.getHttpServer())
          .get('/newsletter/')
          // .expect(({ body }) => global.console.log(body))
          .expect(404)
          .expect(idRequiredException)
      );
    }); */
    it('/newsletters/:id (GET) NO ID 404', () => {
      return request(app.getHttpServer()).get('/').expect(404);
    });

    it('/newsletters/:id (GET) Invalid 400', () => {
      const spying = jest.spyOn(findByField, 'findByField').mockReturnValueOnce(mockNewsletter);
      return (
        request(app.getHttpServer())
          .get('/newsletters/5e2f63d67c06a7')
          // .expect(({ body }) => global.console.log(body))
          .expect(400)
          .expect(notFoundException)
      );
    });
  });

  describe('/newsletters (POST)', () => {
    it('/newsletters (POST) 201', () => {
      const toSend = {
        email: 'test@test.tn'
      };

      const expected = {
        _id: '5e2f63d67c06a754d05da4b7',
        commentary: 'Commentary',
        email: 'test@test.tn',
        state: newsletterStates.waiting
      };
      const spying = jest.spyOn(findByField, 'findByField').mockReturnValueOnce(mockNewsletter);
      const spyingField = jest.spyOn(isFieldUnique, 'isFieldUnique').mockReturnValueOnce(true);
      return (
        request(app.getHttpServer())
          .post('/newsletters')
          .send(toSend)
          // .expect(({ body }) => global.console.log(body))
          .expect(201)
          .expect(expected)
      );
    });
  });

  describe('/newsletters (PUT)', () => {
    it('/newsletters (PUT) 200 OK', () => {
      const toSend = {
        _id: '5e2f63d67c06a754d05da4b7',
        commentary: 'Commentary',
        email: 'test@test.tn',
        state: newsletterStates.waiting
      };
      const expected = {
        _id: '5e2f63d67c06a754d05da4b7',
        commentary: 'Commentary',
        email: 'test@test.tn',
        state: newsletterStates.waiting
      };
      const spying = jest.spyOn(findByField, 'findByField').mockReturnValueOnce(mockNewsletter);
      const spyingField = jest.spyOn(isFieldUnique, 'isFieldUnique').mockReturnValueOnce(true);
      return (
        request(app.getHttpServer())
          .put('/newsletters/5e2f63d67c06a754d05da4b7')
          .send(toSend)
          // .expect(({ body }) => global.console.log(body))
          .expect(200)
          .expect(expected)
      );
    });
  });

  describe('/newsletters (DELETE)', () => {
    it('/newsletters (DELETE) 200', () => {
      const spying = jest.spyOn(findByField, 'findByField').mockReturnValueOnce(mockNewsletter);
      return (
        request(app.getHttpServer())
          .delete('/newsletters/5e2f63d67c06a754d05da4b7')
          // .expect(({ body }) => global.console.log(body))
          .expect(200)
          .expect({})
      );
    });

    it('/newsletters (DELETE) 400 Not Found or Id Is empty', () => {
      return (
        request(app.getHttpServer())
          .delete('/newsletters/5e2f63d67c06a754d05da4b7')
          // .expect(({ body }) => global.console.log(body))
          .expect(400)
          .expect({ Newsletter: 'Not found' }) &&
        request(app.getHttpServer())
          .delete('/newsletters')
          // .expect(({ body }) => global.console.log(body))
          .expect(404)
          .expect({
            statusCode: 404,
            error: 'Not Found',
            message: 'Cannot DELETE /newsletters'
          })
      );
    });
  });
});
