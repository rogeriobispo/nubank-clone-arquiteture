import 'reflect-metadata';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../../../server/app';
import { JwtConfig } from '../../../../shared/config';

describe('authorized', () => {
  it('when the token is right', async () => {
    const token = jwt.sign(
      { id: 'klasdkflj', name: 'jhondoe', email: 'jhondoe@gmail.com' },
      JwtConfig.secret,
      {
        expiresIn: JwtConfig.expireIn,
      }
    );

    const response = await request(app)
      .get('/authorized')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      id: 'klasdkflj', 
      name: 'jhondoe', 
      email: 'jhondoe@gmail.com'
    })
  });

  it('when the token is wrong', async () => {
    const token = 'anytoken';

    const response = await request(app)
      .get('/authorized')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(401);
  });
});
