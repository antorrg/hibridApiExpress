Empecemos con el primer punto: la implementación de refresh tokens. Esto mejorará la experiencia del usuario permitiendo una renovación segura sin necesidad de volver a iniciar sesión.



```javascript
import pkg from 'jsonwebtoken';
import crypto from 'crypto';
import env from '../../envConfig.js';

// Constantes para tiempos de expiración
const REFRESH_TOKEN_EXPIRES = '7d';  // 7 días
const ACCESS_TOKEN_EXPIRES = '1h';   // 1 hora

// Modelo para almacenar refresh tokens (añadir a tus modelos de Sequelize)
const RefreshTokenModel = sequelize.define('RefreshToken', {
  token: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  expiresAt: {
    type: Sequelize.DATE,
    allowNull: false
  },
  isRevoked: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

// Función para generar refresh token
const generateRefreshToken = async (userId) => {
  const refreshToken = crypto.randomBytes(40).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días

  await RefreshTokenModel.create({
    token: refreshToken,
    userId: userId,
    expiresAt: expiresAt
  });

  return refreshToken;
};

// Modificar la función generateToken existente
export const generateTokenPair = async (user, session) => {
  const intData = disguiseRole(user.role, 5);
  
  // Access token
  const accessToken = pkg.sign(
    { userId: user.id, email: user.email, internalData: intData },
    env.SecretKey,
    { expiresIn: ACCESS_TOKEN_EXPIRES }
  );

  // Refresh token
  const refreshToken = await generateRefreshToken(user.id);

  return {
    accessToken,
    refreshToken
  };
};

// Nuevo endpoint para renovar el access token
export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token requerido' });
    }

    // Verificar si el refresh token existe y es válido
    const savedToken = await RefreshTokenModel.findOne({
      where: {
        token: refreshToken,
        isRevoked: false,
        expiresAt: {
          [Sequelize.Op.gt]: new Date()
        }
      }
    });

    if (!savedToken) {
      return res.status(401).json({ message: 'Refresh token inválido o expirado' });
    }

    // Buscar el usuario
    const user = await User.findByPk(savedToken.userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Generar nuevo access token
    const intData = disguiseRole(user.role, 5);
    const newAccessToken = pkg.sign(
      { userId: user.id, email: user.email, internalData: intData },
      env.SecretKey,
      { expiresIn: ACCESS_TOKEN_EXPIRES }
    );

    // Actualizar la sesión con el nuevo token
    req.session.user = {
      ...req.session.user,
      token: newAccessToken
    };

    res.json({
      accessToken: newAccessToken
    });

  } catch (error) {
    console.error('Error al renovar el token:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Middleware para verificar el refresh token
export const verifyRefreshToken = async (refreshToken) => {
  const savedToken = await RefreshTokenModel.findOne({
    where: {
      token: refreshToken,
      isRevoked: false,
      expiresAt: {
        [Sequelize.Op.gt]: new Date()
      }
    }
  });

  if (!savedToken) {
    throw new Error('Refresh token inválido o expirado');
  }

  return savedToken;
};

```

Esta implementación de refresh tokens funciona así:

1. **Estructura**:
   - Access token: token JWT de corta duración (1 hora)
   - Refresh token: token criptográfico aleatorio de larga duración (7 días)

2. **Flujo de autenticación**:
   - Al login, el usuario recibe ambos tokens
   - El access token se usa para las peticiones normales
   - Cuando expira el access token, el cliente usa el refresh token para obtener uno nuevo

3. **Seguridad**:
   - Los refresh tokens se almacenan en la base de datos
   - Cada refresh token está vinculado a un usuario específico
   - Se verifica que no estén revocados ni expirados
   - La sesión se actualiza con cada renovación

4. **Uso**:
```javascript
// En tu endpoint de login:
app.post('/login', async (req, res) => {
  // ... validación de credenciales ...
  const tokens = await generateTokenPair(user, req.session);
  res.json(tokens);
});

// Endpoint para renovar el token:
app.post('/refresh-token', refreshAccessToken);
```

5. **Del lado del cliente**:
```javascript
// Cuando un request falla por token expirado
if (responseStatus === 401) {
  const response = await fetch('/refresh-token', {
    method: 'POST',
    body: JSON.stringify({ refreshToken: savedRefreshToken }),
    headers: { 'Content-Type': 'application/json' }
  });
  const { accessToken } = await response.json();
  // Guardar nuevo accessToken y reintentar request original
}
```

¿Te gustaría que continuemos con el segundo punto sobre la revocación explícita de tokens, o tienes alguna duda sobre esta implementación de refresh tokens?

<hr> 

pasemos al siguiente:

Perfecto, veamos la implementación de la revocación explícita de tokens, que es crucial para gestionar logouts y situaciones de seguridad.



```javascript
import { Sequelize } from 'sequelize';
import pkg from 'jsonwebtoken';
import env from '../../envConfig.js';

// Modelo para lista negra de tokens
const BlacklistedToken = sequelize.define('BlacklistedToken', {
  token: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  reason: {
    type: Sequelize.STRING,
    allowNull: true
  },
  expiresAt: {
    type: Sequelize.DATE,
    allowNull: false
  }
});

// Función para revocar tokens
export const revokeToken = async (token, userId, reason = 'logout') => {
  try {
    // Decodificar el token para obtener su tiempo de expiración
    const decoded = pkg.decode(token);
    
    await BlacklistedToken.create({
      token: token,
      userId: userId,
      reason: reason,
      expiresAt: new Date(decoded.exp * 1000)
    });

    // Si existe un refresh token asociado, también lo revocamos
    await RefreshTokenModel.update(
      { isRevoked: true },
      { where: { userId: userId } }
    );

    return true;
  } catch (error) {
    console.error('Error al revocar token:', error);
    throw error;
  }
};

// Modificar el middleware verifyToken para incluir verificación de lista negra
export const verifyToken = async (req, res, next) => {
  try {
    let token = req.headers['x-access-token'] || req.headers.authorization;
    
    if (!token) {
      throw new Error('Acceso no autorizado. Token no proporcionado');
    }

    if (token.startsWith('Bearer ')) {
      token = token.slice(7);
    }

    // Verificar si el token está en la lista negra
    const blacklisted = await BlacklistedToken.findOne({
      where: {
        token: token,
        expiresAt: {
          [Sequelize.Op.gt]: new Date() // Solo verificamos tokens no expirados
        }
      }
    });

    if (blacklisted) {
      throw new Error('Token revocado');
    }

    // Verificar sesión y token como antes
    if (!req.session.user || req.session.user.token !== token) {
      throw new Error('Token o sesión inválidos');
    }

    pkg.verify(token, env.SecretKey, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          throw new Error('Token expirado');
        }
        throw new Error('Token inválido');
      }

      req.user = decoded;
      const userId = decoded.userId;
      const userRole = recoveryRole(decoded.internalData, 5);
      req.userInfo = { userId, userRole };
      next();
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// Implementación del logout
export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const userId = req.userInfo.userId;

    if (token) {
      await revokeToken(token, userId, 'logout');
    }

    // Destruir la sesión
    req.session.destroy((err) => {
      if (err) {
        console.error('Error al destruir la sesión:', err);
      }
    });

    res.clearCookie('connect.sid'); // Limpiar cookie de sesión
    res.json({ message: 'Logout exitoso' });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({ message: 'Error al cerrar sesión' });
  }
};

// Función para limpiar tokens expirados de la lista negra
export const cleanupBlacklist = async () => {
  try {
    await BlacklistedToken.destroy({
      where: {
        expiresAt: {
          [Sequelize.Op.lt]: new Date()
        }
      }
    });
  } catch (error) {
    console.error('Error al limpiar lista negra:', error);
  }
};

// Programar limpieza periódica (ejecutar cada día)
setInterval(cleanupBlacklist, 24 * 60 * 60 * 1000);

```

Esta implementación de revocación de tokens proporciona:

1. **Sistema de Lista Negra**:
   - Almacena tokens revocados en la base de datos
   - Incluye información sobre el motivo y el usuario
   - Mantiene la fecha de expiración para limpieza automática

2. **Verificación Mejorada**:
   - Antes de validar un token, verifica que no esté revocado
   - Integra con el sistema de sesiones existente
   - Maneja tanto access tokens como refresh tokens

3. **Logout Completo**:
   - Revoca el token actual
   - Destruye la sesión
   - Limpia las cookies
   - Revoca los refresh tokens asociados

4. **Mantenimiento Automático**:
   - Limpia periódicamente los tokens expirados de la lista negra
   - Reduce el tamaño de la base de datos
   - Mejora el rendimiento

Para usar este sistema:

```javascript
// En tus rutas:
app.post('/logout', verifyToken, logout);

// Para revocar tokens manualmente (ej: por razones de seguridad)
await revokeToken(token, userId, 'security_breach');
```

Esta implementación permite:
- Logout seguro
- Revocación manual de tokens por razones de seguridad
- Limpieza automática de tokens expirados
- Integración con el sistema de sesiones existente

¿Te gustaría que continuemos con el tercer punto sobre la sincronización de tiempos de expiración, o tienes alguna pregunta sobre esta implementación?

<hr>

siguiente...

Perfecto, vamos a implementar una mejor sincronización de los tiempos de expiración entre sesiones y tokens.



```javascript
// config/timing.js
export const TIMING_CONFIG = {
  // Tiempos base en milisegundos
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,

  // Configuración de tiempos
  SESSION: {
    DURATION: 24 * 60 * 60 * 1000,  // 24 horas
    CLEANUP_INTERVAL: 10 * 60 * 1000 // 10 minutos
  },
  
  COOKIES: {
    MAX_AGE: 24 * 60 * 60 * 1000    // 24 horas
  },
  
  TOKENS: {
    ACCESS: {
      DURATION: '24h',              // Formato JWT
      DURATION_MS: 24 * 60 * 60 * 1000
    },
    REFRESH: {
      DURATION: '7d',               // Formato JWT
      DURATION_MS: 7 * 24 * 60 * 60 * 1000
    }
  },
  
  CLEANUP: {
    BLACKLIST: 24 * 60 * 60 * 1000,  // Cada 24 horas
    EXPIRED_SESSIONS: 10 * 60 * 1000  // Cada 10 minutos
  }
};

// Implementación actualizada del store de sesiones
export const myStore = new SequelizeStore({
    db: sequelize,
    tableName: 'sessions',
    checkExpirationInterval: TIMING_CONFIG.SESSION.CLEANUP_INTERVAL,
    expiration: TIMING_CONFIG.SESSION.DURATION
});

// Configuración actualizada de la sesión
export const sessionMiddle = session({
    secret: env.SecretKey,
    resave: false,
    saveUninitialized: false,
    store: myStore,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: TIMING_CONFIG.COOKIES.MAX_AGE
    }
});

// Función actualizada para generar tokens
export const generateTokenPair = async (user, session) => {
    const intData = disguiseRole(user.role, 5);
    
    // Access token sincronizado con la duración de la sesión
    const accessToken = pkg.sign(
        {
            userId: user.id,
            email: user.email,
            internalData: intData,
            sessionId: session.id  // Vincular con la sesión
        },
        env.SecretKey,
        { expiresIn: TIMING_CONFIG.TOKENS.ACCESS.DURATION }
    );

    // Refresh token
    const refreshToken = await generateRefreshToken(user.id);

    return { accessToken, refreshToken };
};

// Función de utilidad para verificar y sincronizar tiempos
export const checkTokenExpiration = (token) => {
    try {
        const decoded = pkg.decode(token);
        const tokenExp = decoded.exp * 1000; // Convertir a millisegundos
        const sessionExp = Date.now() + TIMING_CONFIG.SESSION.DURATION;

        return {
            isValid: tokenExp <= sessionExp,
            tokenExpiration: new Date(tokenExp),
            sessionExpiration: new Date(sessionExp),
            needsRenewal: tokenExp - Date.now() < TIMING_CONFIG.HOUR // Renovar si queda menos de 1 hora
        };
    } catch (error) {
        console.error('Error al verificar expiración:', error);
        return {
            isValid: false,
            needsRenewal: true
        };
    }
};

// Middleware para renovación automática de tokens próximos a expirar
export const autoRenewToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) return next();

        const expInfo = checkTokenExpiration(token);
        
        if (expInfo.needsRenewal && req.session.user) {
            // Generar nuevo token
            const newToken = await generateTokenPair(req.session.user, req.session);
            
            // Actualizar sesión
            req.session.user.token = newToken.accessToken;
            
            // Añadir nuevo token al header de respuesta
            res.setHeader('X-New-Token', newToken.accessToken);
        }
        
        next();
    } catch (error) {
        next(error);
    }
};

// Función de limpieza programada
const cleanupTasks = () => {
    // Limpiar lista negra de tokens
    setInterval(async () => {
        await cleanupBlacklist();
    }, TIMING_CONFIG.CLEANUP.BLACKLIST);

    // Limpiar sesiones expiradas
    setInterval(async () => {
        await myStore.clearExpiredSessions();
    }, TIMING_CONFIG.CLEANUP.EXPIRED_SESSIONS);
};

// Iniciar tareas de limpieza
cleanupTasks();

```

Esta implementación proporciona:

1. **Configuración Centralizada**:
   - Todos los tiempos definidos en un solo lugar
   - Fácil de mantener y modificar
   - Previene inconsistencias

2. **Sincronización**:
   - Sesiones, cookies y tokens comparten la misma duración base
   - Los refresh tokens tienen una duración más larga
   - Las limpiezas programadas están coordinadas

3. **Renovación Automática**:
   - Detecta tokens próximos a expirar
   - Los renueva automáticamente antes de que expiren
   - Mantiene la sesión activa sin interrupciones

4. **Mantenimiento**:
   - Limpieza programada de sesiones expiradas
   - Limpieza de tokens en lista negra
   - Intervalos configurables

Para usar esta configuración:

```javascript
// En tu app.js o index.js
app.use(sessionMiddle);
app.use(autoRenewToken);  // Añadir después de la sesión

// En tus rutas protegidas
app.get('/protected', verifyToken, (req, res) => {
    // Si hay un nuevo token, el cliente puede obtenerlo del header X-New-Token
});
```

Los beneficios principales son:
1. Mejor experiencia de usuario (renovación automática)
2. Mayor seguridad (tiempos sincronizados)
3. Menor sobrecarga en la base de datos (limpiezas coordinadas)
4. Código más mantenible

¿Quieres que pasemos al cuarto punto sobre el logout mejorado, o tienes alguna pregunta sobre esta implementación?


<hr>

proximo...

Perfecto, vamos a implementar un sistema de logout mejorado que asegure una completa invalidación tanto de sesiones como de tokens.



```javascript
import { Sequelize } from 'sequelize';
import pkg from 'jsonwebtoken';
import env from '../../envConfig.js';

// Modelo para tracking de sesiones activas
const ActiveSession = sequelize.define('ActiveSession', {
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    sessionId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    deviceInfo: {
        type: Sequelize.JSON,
        allowNull: true
    },
    lastActivity: {
        type: Sequelize.DATE,
        allowNull: false
    }
});

// Sistema de logout mejorado
export const logoutService = {
    // Logout de sesión única
    async logoutSession(req, res) {
        try {
            const token = req.headers.authorization?.replace('Bearer ', '');
            const userId = req.userInfo.userId;
            const sessionId = req.session.id;

            // 1. Revocar el token actual
            if (token) {
                await revokeToken(token, userId, 'user_logout');
            }

            // 2. Invalidar refresh tokens asociados a esta sesión
            await RefreshTokenModel.update(
                { isRevoked: true },
                { 
                    where: { 
                        userId,
                        sessionId
                    }
                }
            );

            // 3. Eliminar registro de sesión activa
            await ActiveSession.destroy({
                where: {
                    userId,
                    sessionId
                }
            });

            // 4. Destruir la sesión
            await new Promise((resolve, reject) => {
                req.session.destroy((err) => {
                    if (err) reject(err);
                    resolve();
                });
            });

            // 5. Limpiar cookies
            res.clearCookie('connect.sid');
            
            return res.json({ 
                success: true, 
                message: 'Logout exitoso' 
            });

        } catch (error) {
            console.error('Error en logout:', error);
            throw error;
        }
    },

    // Logout de todas las sesiones
    async logoutAllSessions(req, res) {
        try {
            const userId = req.userInfo.userId;

            // 1. Revocar todos los tokens activos
            await BlacklistedToken.create({
                userId,
                reason: 'user_logout_all',
                wildcardRevocation: true,
                timestamp: new Date()
            });

            // 2. Revocar todos los refresh tokens
            await RefreshTokenModel.update(
                { isRevoked: true },
                { where: { userId } }
            );

            // 3. Encontrar y destruir todas las sesiones activas
            const activeSessions = await ActiveSession.findAll({
                where: { userId }
            });

            for (const session of activeSessions) {
                await myStore.destroy(session.sessionId);
            }

            // 4. Eliminar registros de sesiones activas
            await ActiveSession.destroy({
                where: { userId }
            });

            // 5. Destruir sesión actual
            await new Promise((resolve, reject) => {
                req.session.destroy((err) => {
                    if (err) reject(err);
                    resolve();
                });
            });

            // 6. Limpiar cookies
            res.clearCookie('connect.sid');

            return res.json({
                success: true,
                message: 'Logout de todas las sesiones exitoso'
            });

        } catch (error) {
            console.error('Error en logout de todas las sesiones:', error);
            throw error;
        }
    },

    // Logout forzado por administrador
    async forceLogout(adminReq, targetUserId, reason) {
        try {
            // Verificar permisos de administrador
            if (adminReq.userInfo.userRole !== 1) { // Asumiendo 1 = admin
                throw new Error('Permisos insuficientes');
            }

            // Ejecutar logout de todas las sesiones
            await this.logoutAllSessions({ userInfo: { userId: targetUserId } });

            // Registrar el evento
            await LoggingService.logAdminAction({
                adminId: adminReq.userInfo.userId,
                action: 'force_logout',
                targetUserId,
                reason
            });

            return {
                success: true,
                message: `Usuario ${targetUserId} desconectado forzosamente`
            };
        } catch (error) {
            console.error('Error en logout forzado:', error);
            throw error;
        }
    }
};

// Middleware para mantener registro de sesiones activas
export const trackSession = async (req, res, next) => {
    try {
        if (req.session && req.session.user) {
            await ActiveSession.upsert({
                userId: req.session.user.id,
                sessionId: req.session.id,
                deviceInfo: {
                    userAgent: req.headers['user-agent'],
                    ip: req.ip
                },
                lastActivity: new Date()
            });
        }
        next();
    } catch (error) {
        next(error);
    }
};

// Rutas
export const setupLogoutRoutes = (app) => {
    app.post('/logout', verifyToken, logoutService.logoutSession);
    app.post('/logout-all', verifyToken, logoutService.logoutAllSessions);
    app.post('/force-logout/:userId', verifyToken, async (req, res) => {
        try {
            const result = await logoutService.forceLogout(
                req,
                parseInt(req.params.userId),
                req.body.reason
            );
            res.json(result);
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    });
};

```

Esta implementación proporciona un sistema de logout completo con las siguientes características:

1. **Tipos de Logout**:
   - Logout de sesión única
   - Logout de todas las sesiones
   - Logout forzado por administrador

2. **Seguimiento de Sesiones**:
   - Registro de sesiones activas
   - Información del dispositivo
   - Última actividad

3. **Proceso de Logout Completo**:
   - Revocación de tokens de acceso
   - Revocación de refresh tokens
   - Destrucción de sesiones
   - Limpieza de cookies
   - Actualización de registros en base de datos

4. **Seguridad Mejorada**:
   - Revocación en cascada
   - Registro de acciones administrativas
   - Verificación de permisos

Para implementarlo:

```javascript
// En tu app.js
import { setupLogoutRoutes, trackSession } from './auth/logout';

// Agregar middleware de tracking
app.use(trackSession);

// Configurar rutas de logout
setupLogoutRoutes(app);
```

Uso desde el cliente:

```javascript
// Logout normal
await fetch('/logout', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

// Logout de todas las sesiones
await fetch('/logout-all', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

// Logout forzado (solo admin)
await fetch(`/force-logout/${userId}`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify({
        reason: 'security_concern'
    })
});
```

¿Te gustaría que profundice en algún aspecto específico de esta implementación o tienes alguna pregunta sobre cómo integrarla con tu sistema actual?

<hr>

Sistema completo:
Sí, podemos crear un sistema completo integrando el backend que ya tienes con un cliente React. La parte del cliente es más sencilla porque principalmente maneja el almacenamiento y gestión de tokens en el frontend.



```javascript
// src/services/auth.service.js
export class AuthService {
    static TOKEN_KEY = 'access_token';
    static REFRESH_TOKEN_KEY = 'refresh_token';

    static getToken() {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    static getRefreshToken() {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }

    static setTokens(accessToken, refreshToken) {
        localStorage.setItem(this.TOKEN_KEY, accessToken);
        if (refreshToken) {
            localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
        }
    }

    static removeTokens() {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }

    static async login(email, password) {
        try {
            const response = await fetch('http://your-api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include' // Importante para las cookies
            });

            if (!response.ok) throw new Error('Login failed');

            const data = await response.json();
            this.setTokens(data.accessToken, data.refreshToken);
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    static async logout() {
        try {
            const token = this.getToken();
            await fetch('http://your-api/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include'
            });
        } finally {
            this.removeTokens();
            window.location.href = '/login'; // O donde prefieras redirigir
        }
    }

    static async refreshToken() {
        try {
            const refreshToken = this.getRefreshToken();
            if (!refreshToken) throw new Error('No refresh token available');

            const response = await fetch('http://your-api/refresh-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken }),
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Token refresh failed');

            const data = await response.json();
            this.setTokens(data.accessToken);
            return data.accessToken;
        } catch (error) {
            console.error('Token refresh error:', error);
            this.removeTokens();
            window.location.href = '/login';
            throw error;
        }
    }
}

// src/hooks/useAuth.js
import { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = AuthService.getToken();
            if (token) {
                // Verificar token con el backend
                const response = await fetch('http://your-api/verify-token', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    credentials: 'include'
                });
                
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                } else {
                    // Intentar refresh token
                    await AuthService.refreshToken();
                }
            }
        } catch (error) {
            console.error('Auth check failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const data = await AuthService.login(email, password);
        setUser(data.user);
        return data;
    };

    const logout = async () => {
        await AuthService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// src/components/PrivateRoute.js
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

```

Para usar este sistema en tu aplicación React:

1. **Configura el Provider en tu App principal**:
```jsx
// App.jsx
import { AuthProvider } from './hooks/useAuth';
import { BrowserRouter } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}
```

2. **Protege tus rutas**:
```jsx
// AppRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute';

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route 
                path="/dashboard" 
                element={
                    <PrivateRoute>
                        <DashboardPage />
                    </PrivateRoute>
                } 
            />
        </Routes>
    );
}
```

3. **Usa el hook en tus componentes**:
```jsx
// LoginPage.jsx
import { useAuth } from '../hooks/useAuth';

function LoginPage() {
    const { login } = useAuth();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            // Redirigir después del login
        } catch (error) {
            // Manejar error
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Tu formulario de login */}
        </form>
    );
}
```

¿Te gustaría que te ayude a implementar esto en tu aplicación específica? Podríamos:
1. Ajustar las URLs a tu API
2. Personalizar el manejo de errores
3. Crear los componentes de login/logout
4. Configurar el sistema de rutas protegidas

¿Por cuál te gustaría empezar?

<hr> 
en mi express:

¡Claro! Vamos a implementar un sistema completo de autenticación en tu API REST. Necesitaremos definir los modelos y configurar todo el sistema.



```javascript
// models/User.js
import { DataTypes } from 'sequelize';

export const UserModel = (sequelize) => {
    return sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.INTEGER,
            defaultValue: 2, // 1: admin, 2: user
            allowNull: false
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    });
};

// models/RefreshToken.js
export const RefreshTokenModel = (sequelize) => {
    return sequelize.define('RefreshToken', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        isRevoked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        sessionId: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
};

// models/BlacklistedToken.js
export const BlacklistedTokenModel = (sequelize) => {
    return sequelize.define('BlacklistedToken', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        reason: {
            type: DataTypes.STRING,
            allowNull: true
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    });
};

```

```javascript
// config/database.js
import { Sequelize } from 'sequelize';
import { UserModel } from '../models/User.js';
import { RefreshTokenModel } from '../models/RefreshToken.js';
import { BlacklistedTokenModel } from '../models/BlacklistedToken.js';
import env from '../envConfig.js';

const sequelize = new Sequelize(env.ConnectDb, {
    dialect: 'postgres',
    logging: false
});

// Inicializar modelos
const User = UserModel(sequelize);
const RefreshToken = RefreshTokenModel(sequelize);
const BlacklistedToken = BlacklistedTokenModel(sequelize);

// Relaciones
User.hasMany(RefreshToken);
RefreshToken.belongsTo(User);

User.hasMany(BlacklistedToken);
BlacklistedToken.belongsTo(User);

// Sincronizar modelos
const syncDatabase = async () => {
    try {
        await sequelize.sync();
        console.log('Database synced successfully');
    } catch (error) {
        console.error('Error syncing database:', error);
    }
};

export { sequelize, User, RefreshToken, BlacklistedToken, syncDatabase };

// config/session.js
import session from 'express-session';
import connectSessionSequelize from 'connect-session-sequelize';
import { sequelize } from './database.js';
import env from '../envConfig.js';

const SequelizeStore = connectSessionSequelize(session.Store);

export const sessionStore = new SequelizeStore({
    db: sequelize,
    tableName: 'sessions',
    checkExpirationInterval: 10 * 60 * 1000,
    expiration: 24 * 60 * 60 * 1000
});

export const sessionConfig = session({
    secret: env.SecretKey,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    name: 'sessionId', // Nombre personalizado de la cookie
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
    }
});

// Sincronizar store de sesiones
sessionStore.sync();

```

```javascript
// controllers/authController.js
import bcrypt from 'bcrypt';
import { User, RefreshToken, BlacklistedToken } from '../config/database.js';
import { generateToken, verifyToken } from '../middleware/auth.js';
import pkg from 'jsonwebtoken';
import env from '../envConfig.js';

export const authController = {
    async register(req, res) {
        try {
            const { email, password } = req.body;
            
            // Verificar si el usuario ya existe
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: 'El email ya está registrado' });
            }

            // Hash de la contraseña
            const hashedPassword = await bcrypt.hash(password, 10);

            // Crear usuario
            const user = await User.create({
                email,
                password: hashedPassword
            });

            res.status(201).json({ message: 'Usuario registrado exitosamente' });
        } catch (error) {
            console.error('Error en registro:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Buscar usuario
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }

            // Verificar contraseña
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }

            // Generar tokens
            const accessToken = generateToken(user, req.session);

            // Generar refresh token
            const refreshToken = await RefreshToken.create({
                token: crypto.randomBytes(40).toString('hex'),
                UserId: user.id,
                sessionId: req.sessionID,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            });

            // Guardar información en la sesión
            req.session.user = {
                id: user.id,
                email: user.email,
                role: user.role,
                token: accessToken
            };

            res.json({
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role
                },
                accessToken,
                refreshToken: refreshToken.token
            });
        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    },

    async logout(req, res) {
        try {
            const token = req.headers.authorization?.replace('Bearer ', '');
            const userId = req.userInfo.userId;

            // Revocar el token actual
            if (token) {
                await BlacklistedToken.create({
                    token,
                    UserId: userId,
                    reason: 'logout',
                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
                });
            }

            // Revocar refresh tokens de esta sesión
            await RefreshToken.update(
                { isRevoked: true },
                { 
                    where: { 
                        UserId: userId,
                        sessionId: req.sessionID
                    }
                }
            );

            // Destruir sesión
            req.session.destroy(err => {
                if (err) {
                    console.error('Error al destruir sesión:', err);
                    return res.status(500).json({ message: 'Error al cerrar sesión' });
                }
                res.clearCookie('sessionId');
                res.json({ message: 'Sesión cerrada exitosamente' });
            });
        } catch (error) {
            console.error('Error en logout:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    },

    async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;

            // Verificar refresh token
            const savedToken = await RefreshToken.findOne({
                where: {
                    token: refreshToken,
                    isRevoked: false,
                    expiresAt: {
                        [Op.gt]: new Date()
                    }
                },
                include: User
            });

            if (!savedToken) {
                return res.status(401).json({ message: 'Refresh token inválido' });
            }

            // Generar nuevo access token
            const newAccessToken = generateToken(savedToken.User, req.session);

            // Actualizar sesión
            req.session.user = {
                ...req.session.user,
                token: newAccessToken
            };

            res.json({ accessToken: newAccessToken });
        } catch (error) {
            console.error('Error al renovar token:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    }
};

```

Para implementar este sistema en tu API:

1. **Configura las rutas**:
```javascript
// routes/auth.js
import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', verifyToken, authController.logout);
router.post('/refresh-token', authController.refreshToken);

export default router;
```

2. **Aplica los middlewares en tu app**:
```javascript
// app.js
import express from 'express';
import { sessionConfig } from './config/session.js';
import authRoutes from './routes/auth.js';
import { syncDatabase } from './config/database.js';

const app = express();

// Sincronizar base de datos
syncDatabase();

// Middlewares
app.use(express.json());
app.use(sessionConfig);

// Rutas
app.use('/auth', authRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Error interno del servidor' });
});
```

Este sistema proporciona:
1. Registro y login de usuarios
2. Manejo de sesiones con PostgreSQL
3. Sistema de tokens JWT con refresh tokens
4. Lista negra de tokens revocados
5. Gestión de múltiples sesiones

¿Te gustaría que profundicemos en alguna parte específica o que te ayude a implementarlo en tu proyecto actual?