import request from "supertest";
import app from '../server/app.js'
import express from "express";
import mvcRouter from "../server/router.js"; // Ajusta el path
import session from "express-session";

describe("MVC Routes", () => {
  //let app;

  // beforeAll(() => {
  //   app = express();

  //   app.use("/", mvcRouter);
  // });

  it("should render landing page", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("<title>"); // Asegúrate de que el título esté en el HTML
  });

  it("should render product page", async () => {
    const res = await request(app).get("/detalles");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("products"); // Verifica contenido específico
  });

  it("should render details page with valid ID", async () => {
    const res = await request(app).get("/detalle/1");
    expect(res.statusCode).toBe(200);
    //expect(res.text).toContain("details");
  });

  it("should return 400 for invalid detail ID", async () => {
    const res = await request(app).get("/detalle/invalid-id");
    expect(res.statusCode).toBe(400); // Asegúrate de que tu middleware valide correctamente
  });

  it("should render contact page", async () => {
    const res = await request(app).get("/contacto");
    expect(res.statusCode).toBe(200);
    //expect(res.text).toContain("contact");
  });

  it("should render about page", async () => {
    const res = await request(app).get("/acerca");
    expect(res.statusCode).toBe(200);
    //expect(res.text).toContain("about");
  });

  it("should render admin page", async () => {
    const res = await request(app).get("/admin");
    expect(res.statusCode).toBe(200);
    //expect(res.text).toContain("index");
  });

  it("should render login page", async () => {
    const res = await request(app).get("/login");
    expect(res.statusCode).toBe(200);
    //expect(res.text).toContain("index");
  });
});
