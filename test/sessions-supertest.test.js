import chai from "chai";
import supertest from "supertest";
import {app} from "../src/app.js";

const expect = chai.expect;
const requester = supertest(app);

describe("Test para session login", function() {
   
    this.timeout(5000); 
  
    it("Debe permitir loguear al usuario", async () => {
      try {
        const res = await requester
          .post('/api/sessions/login')
          .send({ email: 'pepe@gmail.com', password: '1234' }) 
          .expect(200);
  
        expect(res.text).to.equal('login exitoso;');
      } catch (err) {
        throw err;
      }
    });
  
   
  });