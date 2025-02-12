
/**
 * @swagger
 * tags:
 *   - name: Landing
 *     description: Operaciones relacionadas con con la página principal.
 */

/**
 * @swagger
 * /api/v1/land:
 *   get:
 *     summary: Recibe la informacion de la portada incluyendo la metadata.
 *     tags: [Landing]
 *     responses:
 *       200:
 *         description: Un arreglo con la portada
 * 
 */

/**
 * @swagger
 * /api/v1/product/{id}:
 *   get:
 *     summary: Detalle de un producto
 *     security:
 *       - bearerAuth: []  # 🔐 Indica que esta ruta requiere autenticación
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del post
 *         example: 1
 *     responses:
 *       200:
 *         description: Respuesta exitosa
 *       404:
 *         description: Post no encontrado
 */