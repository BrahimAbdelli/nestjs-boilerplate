import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ObjectID } from 'mongodb';
import * as request from 'supertest';
import { AppModule } from '../../../app.module';
import { ComparaisonTypeEnum, ComparatorEnum } from '../../../shared/search/search-dto';

describe('CategoryModule (e2e)', () => {
  let app: INestApplication;
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RpbmciLCJlbWFpbCI6InRlc3RpbmdAdGVzdC50biIsImlhdCI6MTY4MzQ3MDMyMiwiZXhwIjoxNjg0NzY2MzIyfQ.VwMrPTlci-EgkQwhW20dWA-TpZbJjDK8dLRDxzKnMJM';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/categories (GET)', () => {
    it('should return an array of categories', done => {
      return request(app.getHttpServer())
        .get('/categories')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect(response => {
          expect(response.body).toBeInstanceOf(Array);
          //expect(response.body.length).toBeGreaterThan(0);
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });
  });

  describe('/categories (DELETE)', () => {
    it('should clear all categories', async () => {
      // Create some categories to be cleared
      const category1 = {
        name: 'Category 1',
        quantity: 9.99
      };

      const category2 = {
        name: 'Category 2',
        quantity: 19.99
      };

      // Create the categories
      await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${token}`)
        .send(category1)
        .expect(201);

      await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${token}`)
        .send(category2)
        .expect(201);

      // Clear all categories
      await request(app.getHttpServer()).delete('/categories').set('Authorization', `Bearer ${token}`).expect(200);

      // Check if all categories are cleared
      const response = await request(app.getHttpServer())
        .get('/categories')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const categories = response.body;
      expect(categories).toHaveLength(0);
    });
  });

  describe('/categories/find/:id (GET)', () => {
    it('should return a category by ID', async () => {
      const newCategory = {
        name: 'Test Category',
        quantity: 9.99
      };

      const response = await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${token}`)
        .send(newCategory)
        .expect(201);

      return request(app.getHttpServer())
        .get(`/categories/find/${response.body._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect(response => {
          expect(response.body).toHaveProperty('_id', response.body._id);
        });
    }, 10000);

    it('should return 404 if category not found', async () => {
      const nonExistentId = new ObjectID('645ead8b586d13a6932d46dd'); // Provide a non-existent category ID

      return request(app.getHttpServer())
        .get(`/categories/find/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    }, 10000);
  });

  describe('/categories (POST)', () => {
    it('should create a new category', () => {
      const newCategory = {
        name: 'Test Category',
        quantity: 9.99
      };

      return request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${token}`)
        .send(newCategory)
        .expect(201)
        .expect(response => {
          expect(response.body).toHaveProperty('_id');
          expect(response.body.name).toBe(newCategory.name);
          expect(response.body.quantity).toBe(newCategory.quantity);
        });
    });
  });

  describe('/categories/:id (PUT)', () => {
    it('should update a category', async () => {
      const newCategory = {
        name: 'Test Category',
        quantity: 9.99
      };

      const updatedCategory = {
        name: 'Updated Category',
        quantity: 19.99
      };

      const response = await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${token}`)
        .send(newCategory)
        .expect(201);

      return request(app.getHttpServer())
        .put(`/categories/${response.body._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedCategory)
        .expect(200)
        .expect(response => {
          expect(response.body).toHaveProperty('_id', response.body._id);
          expect(response.body.name).toBe(updatedCategory.name);
          expect(response.body.quantity).toBe(updatedCategory.quantity);
        });
    });

    it('should return 404 if category not found', () => {
      const nonExistentId = new ObjectID('645ead8b586d13a6932d46dd'); // Provide a non-existent category ID
      const updatedCategory = {
        name: 'Updated Category',
        quantity: 19.99
      };

      return request(app.getHttpServer())
        .put(`/categories/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedCategory)
        .expect(404);
    });
  });

  describe('/categories/archive/:id (PATCH)', () => {
    it('should archive a category', async () => {
      const newCategory = {
        name: 'Test Category',
        quantity: 9.99
      };

      const response = await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${token}`)
        .send(newCategory)
        .expect(201);

      return request(app.getHttpServer())
        .patch(`/categories/archive/${response.body._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('should return 404 if category not found', () => {
      const nonExistentId = new ObjectID('645ead8b586d13a6932d46dd'); // Provide a non-existent category ID

      return request(app.getHttpServer())
        .patch(`/categories/archive/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('/categories/unarchive/:id (PATCH)', () => {
    it('should unarchive a category', async () => {
      const newCategory = {
        name: 'Test Category',
        quantity: 9.99
      };

      const response = await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${token}`)
        .send(newCategory)
        .expect(201);

      return request(app.getHttpServer())
        .patch(`/categories/unarchive/${response.body._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('should return 404 if category not found', () => {
      const nonExistentId = new ObjectID('645ead8b586d13a6932d46dd'); // Provide a non-existent category ID

      return request(app.getHttpServer())
        .patch(`/categories/unarchive/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('/categories/search (GET)', () => {
    it('should return an array of categories matching the search criteria', done => {
      const searchCriteria = {
        attributes: [{ key: 'name', value: 'Test', comparator: ComparatorEnum.LIKE }],
        type: ComparaisonTypeEnum.AND,
        isPaginable: true,
        take: 10,
        skip: 0
      };

      return request(app.getHttpServer())
        .get('/categories/search')
        .set('Authorization', `Bearer ${token}`)
        .send(searchCriteria)
        .expect(200)
        .expect(response => {
          const categories = response.body.data;
          expect(categories).toBeInstanceOf(Array);
          expect(categories.length).toBeGreaterThan(0);
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });
  });

  describe('/categories/paginate (GET)', () => {
    it('should paginate categories', () => {
      const take = 10;
      const skip = 0;

      return request(app.getHttpServer())
        .get(`/categories/paginate?take=${take}&skip=${skip}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect(response => {
          expect(response.body).toHaveProperty('data');
          expect(response.body).toHaveProperty('count');
        });
    });
  });

  describe('/categories/:id (DELETE)', () => {
    it('should delete a category', async () => {
      const newCategory = {
        name: 'Test category',
        quantity: 14.99
      };

      const response = await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${token}`)
        .send(newCategory)
        .expect(201);

      return request(app.getHttpServer())
        .delete(`/categories/${response.body._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(({ body }) => {
          //global.console.log(body);
        })
        .expect(200);
    });

    it('should return 404 if category not found', () => {
      const nonExistentId = new ObjectID('645ead8b586d13a6932d46dd'); // Provide a non-existent product ID

      return request(app.getHttpServer())
        .delete(`/categories/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});
