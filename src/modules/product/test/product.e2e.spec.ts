import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ObjectID } from 'mongodb';
import * as request from 'supertest';
import { AppModule } from '../../../app.module';
import { ComparaisonTypeEnum, ComparatorEnum } from '../../../shared/search/search-dto';

describe('ProductModule (e2e)', () => {
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

  describe('/products (GET)', () => {
    it('should return an array of products', done => {
      return request(app.getHttpServer())
        .get('/products')
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

  describe('/products (DELETE)', () => {
    it('should clear all products', async () => {
      // Create some products to be cleared
      const product1 = {
        name: 'Product 1',
        price: 9.99,
        description: 'Product 1 description'
      };

      const product2 = {
        name: 'Product 2',
        price: 19.99,
        description: 'Product 2 description'
      };

      // Create the products
      await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${token}`)
        .send(product1)
        .expect(201);

      await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${token}`)
        .send(product2)
        .expect(201);

      // Clear all products
      await request(app.getHttpServer()).delete('/products').set('Authorization', `Bearer ${token}`).expect(200);

      // Check if all products are cleared
      const response = await request(app.getHttpServer())
        .get('/products')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const products = response.body;
      expect(products).toHaveLength(0);
    });
  });

  describe('/products/find/:id (GET)', () => {
    it('should return a product by ID', async () => {
      const newProduct = {
        name: 'Test Product',
        price: 9.99,
        description: 'Test Description'
      };

      const response = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${token}`)
        .send(newProduct)
        .expect(201);

      return request(app.getHttpServer())
        .get(`/products/find/${response.body._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect(response => {
          expect(response.body).toHaveProperty('_id', response.body._id);
        });
    }, 10000);

    it('should return 404 if product not found', async () => {
      const nonExistentId = new ObjectID('645ead8b586d13a6932d46dd'); // Provide a non-existent product ID

      return request(app.getHttpServer())
        .get(`/products/find/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    }, 10000);
  });

  describe('/products (POST)', () => {
    it('should create a new product', () => {
      const newProduct = {
        name: 'Test Product',
        price: 9.99,
        description: 'Test Description'
      };

      return request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${token}`)
        .send(newProduct)
        .expect(201)
        .expect(response => {
          expect(response.body).toHaveProperty('_id');
          expect(response.body.name).toBe(newProduct.name);
          expect(response.body.price).toBe(newProduct.price);
          expect(response.body.description).toBe(newProduct.description);
        });
    });
  });

  describe('/products/:id (PUT)', () => {
    it('should update a product', async () => {
      const newProduct = {
        name: 'Test Product',
        price: 9.99,
        description: 'Test Description'
      };

      const updatedProduct = {
        name: 'Updated Product',
        price: 19.99,
        description: 'Updated Product description'
      };

      const response = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${token}`)
        .send(newProduct)
        .expect(201);

      return request(app.getHttpServer())
        .put(`/products/${response.body._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedProduct)
        .expect(200)
        .expect(response => {
          expect(response.body).toHaveProperty('_id', response.body._id);
          expect(response.body.name).toBe(updatedProduct.name);
          expect(response.body.price).toBe(updatedProduct.price);
          expect(response.body.description).toBe(updatedProduct.description);
        });
    });

    it('should return 404 if product not found', () => {
      const nonExistentId = new ObjectID('645ead8b586d13a6932d46dd'); // Provide a non-existent product ID
      const updatedProduct = {
        name: 'Updated Product',
        price: 19.99,
        description: 'Updated Product description'
      };

      return request(app.getHttpServer())
        .put(`/products/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedProduct)
        .expect(404);
    });
  });

  describe('/products/archive/:id (PATCH)', () => {
    it('should archive a product', async () => {
      const newProduct = {
        name: 'Test Product',
        price: 9.99,
        description: 'Test Description'
      };

      const response = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${token}`)
        .send(newProduct)
        .expect(201);

      return request(app.getHttpServer())
        .patch(`/products/archive/${response.body._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('should return 404 if product not found', () => {
      const nonExistentId = new ObjectID('645ead8b586d13a6932d46dd'); // Provide a non-existent product ID

      return request(app.getHttpServer())
        .patch(`/products/archive/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('/products/unarchive/:id (PATCH)', () => {
    it('should unarchive a product', async () => {
      const newProduct = {
        name: 'Test Product',
        price: 9.99,
        description: 'Test Description'
      };

      const response = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${token}`)
        .send(newProduct)
        .expect(201);

      return request(app.getHttpServer())
        .patch(`/products/unarchive/${response.body._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('should return 404 if product not found', () => {
      const nonExistentId = new ObjectID('645ead8b586d13a6932d46dd'); // Provide a non-existent product ID

      return request(app.getHttpServer())
        .patch(`/products/unarchive/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('/products/search (GET)', () => {
    it('should return an array of products matching the search criteria', done => {
      const searchCriteria = {
        attributes: [{ key: 'name', value: 'Test', comparator: ComparatorEnum.LIKE }],
        type: ComparaisonTypeEnum.AND,
        isPaginable: true,
        take: 10,
        skip: 0
      };

      request(app.getHttpServer())
        .get('/products/search')
        .set('Authorization', `Bearer ${token}`)
        .send(searchCriteria)
        .expect(200)
        .expect(response => {
          const products = response.body.data;
          expect(products).toBeInstanceOf(Array);
          expect(products.length).toBeGreaterThan(0);
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });
  });

  describe('/products/paginate (GET)', () => {
    it('should paginate products', done => {
      const take = 10;
      const skip = 0;

      return request(app.getHttpServer())
        .get(`/products/paginate?take=${take}&skip=${skip}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect(response => {
          expect(response.body).toHaveProperty('data');
          expect(response.body).toHaveProperty('count');
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });
  });

  describe('/products/:id (DELETE)', () => {
    it('should delete a product', async () => {
      const newProduct = {
        name: 'Test Product',
        price: 9.99,
        description: 'Test Description'
      };

      const response = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${token}`)
        .send(newProduct)
        .expect(201);

      return request(app.getHttpServer())
        .delete(`/products/${response.body._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(({ body }) => {
          global.console.log(body);
        })
        .expect(200);
    });

    it('should return 404 if product not found', () => {
      const nonExistentId = new ObjectID('645ead8b586d13a6932d46dd'); // Provide a non-existent product ID

      return request(app.getHttpServer())
        .delete(`/products/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});
