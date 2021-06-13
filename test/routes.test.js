const request = require('supertest')
const server = require('../server/server')
describe('Get Endpoints', () => {
  it('should request /api/', async () => {
    const res = await request(server)
      .get('/api/')
    expect(res.statusCode).toEqual(200)
  })
  it('should request /consumer/', async () => {
    const res = await request(server)
      .get('/consumer/')
    expect(res.statusCode).toEqual(200)
    expect(res.body.active).toEqual(false)
    expect(res.body.logging).toEqual(true)
  })
})
describe('Post Endpoints', () => {
    it('should post /consumer/', async () => {
    const res = await request(server)
        .post('/consumer/')
        .send({
            active: false,
            logging: false
          })
    expect(res.statusCode).toEqual(200)
    })
    it('should request /consumer/', async () => {
        const res = await request(server)
          .get('/consumer/')
        expect(res.statusCode).toEqual(200)
        expect(res.body.active).toEqual(false)
        expect(res.body.logging).toEqual(false)
      }) 
  })
