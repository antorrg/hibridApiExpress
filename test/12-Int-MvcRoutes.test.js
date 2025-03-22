import request from "supertest";
import app from '../server/app.js'
import createMockProduct from "./helperTest/MvcRoutesHelp.js";


describe("MVC Routes", () => {
  beforeAll(async() => {
    await createMockProduct()
  });

  it("Route '/'. Should render landing page", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("<title>"); // Asegúrate de que el título esté en el HTML
  });

  it("Route '/detalles'. Should render product page", async () => {
    const res = await request(app).get("/detalles");
    expect(res.statusCode).toBe(200);
    //expect(res.text).toContain("<info.landing>"); // Verifica contenido específico
    expect(res.text).toContain("<title>");
    expect(res.text).toContain("landing")
  });

  it("Route '/detalles/:id'. Should render details page with valid ID", async () => {
    const res = await request(app).get("/detalles/1");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("title");
    expect(res.text).toContain("landing");
    expect(res.text).toContain("info_body");
    expect(res.text).toContain("img");
    expect(res.text).toContain("text");
  });

  it("Route '/detalles/item/:id'. Should render item page with valid ID", async () => {
    const res = await request(app).get("/detalles/item/2");
    expect(res.status).toBe(200); // Asegúrate de que tu middleware valide correctamente
    expect(res.text).toContain("text")
    expect(res.text).toContain("img")
    
  });

  it("Route '/detalles/item/:id'. Should return 400 for invalid detail ID", async () => {
    const res = await request(app).get("/detalles/item/kk");
    expect(res.status).toBe(400); // Asegúrate de que tu middleware valide correctamente
    expect(res.text).toContain("Parametros no permitidos")
  });

  it("Route '/contacto'. Should render contact page", async () => {
    const res = await request(app).get("/contacto");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("Contacto:");
  });

  it("Route '/acerca'. Should render about page", async () => {
    const res = await request(app).get("/acerca");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("Acerca de:");
  });

  it("Route '/login'. Should render login page", async () => {
    const res = await request(app).get("/login");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("Admin");
  });

  it("Route '/admin'. Should render admin page", async () => {
    const res = await request(app).get("/admin");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("Admin");
  });

 
});
