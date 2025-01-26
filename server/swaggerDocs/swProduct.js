// Documentación de la API con Swagger
/**
 * @swagger
 * tags:
 *   - name: Product
 *     description: Operaciones relacionadas con Posteos
 */
/**
 * @swagger
 * /api/v1/product:
 *   get:
 *     summary: Posteos de jsonplaceholder
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Lista de posts
 */

/**
 * @swagger
 * /api/v1/product/{id}:
 *   get:
 *     summary: Detalle de un producto
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