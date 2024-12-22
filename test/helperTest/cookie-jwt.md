Para recibir la cookie en tu archivo de pruebas, puedes usar una librería como [supertest](https://www.npmjs.com/package/supertest), que simplifica las pruebas de endpoints en aplicaciones Express. Además, para manipular y acceder a cookies, puedes usar un mecanismo de persistencia como el agente de supertest.

Aquí tienes un ejemplo para realizar pruebas unitarias en tu servidor y manejar cookies:

### Archivo de prueba

```javascript
import request from 'supertest';
import authServer from './path/to/authServer';

describe('Pruebas de autenticación con JSON Web Tokens y sesiones', () => {
  let agent;

  beforeAll(() => {
    // Crear un agente persistente para manejar cookies entre solicitudes
    agent = request.agent(authServer);
  });

  it('Debe iniciar sesión y establecer una cookie', async () => {
    const loginResponse = await agent
      .post('/test/login')
      .send({ email: 'test@example.com', password: 'password', role: 'admin' })
      .expect(200);

    expect(loginResponse.body).toHaveProperty('token');
    expect(loginResponse.body).toHaveProperty('user');
    expect(loginResponse.body.user.email).toBe('test@example.com');

    // Verificar que la cookie está configurada
    const cookies = loginResponse.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies.some((cookie) => cookie.startsWith('sessionId='))).toBe(true);
  });

  it('Debe recibir la cookie en solicitudes posteriores', async () => {
    // Usar el agente para mantener la cookie establecida en la sesión anterior
    const response = await agent.get('/protected/resource').expect(200);

    // Verificar que la respuesta depende de la cookie de sesión
    expect(response.body).toHaveProperty('message', 'Acceso autorizado');
  });

  it('Debe cerrar sesión y limpiar las cookies', async () => {
    const logoutResponse = await agent.post('/test/logout').expect(302); // Redirección tras logout

    // Verificar que las cookies han sido limpiadas
    const cookies = logoutResponse.headers['set-cookie'];
    expect(cookies.some((cookie) => cookie.startsWith('connect.sid=;'))).toBe(true);
  });
});
```

### Explicación

1. **Agente persistente con `supertest.agent`**:
   - Esto permite mantener las cookies entre diferentes solicitudes, simulando el comportamiento de un navegador.

2. **`set-cookie`**:
   - La cabecera `set-cookie` es utilizada por el servidor para enviar cookies al cliente. Verificamos que se configura correctamente durante el inicio de sesión.

3. **Validación de cookies**:
   - Al realizar solicitudes posteriores con el agente, verificamos que las cookies sean utilizadas automáticamente para autenticar las solicitudes.

4. **Limpieza de cookies en logout**:
   - Tras llamar al endpoint de logout, verificamos que las cookies se limpian correctamente.

Con este enfoque, puedes probar que tu servidor gestiona las cookies de sesión de manera adecuada durante el login, el uso de recursos protegidos y el logout.