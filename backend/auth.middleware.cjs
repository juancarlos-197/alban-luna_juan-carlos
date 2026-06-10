// Middleware simple para validar token (en un proyecto real, usarías Firebase Admin SDK)
// Este es un middleware básico que verifica la presencia del token
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado o formato inválido' });
  }

  // En producción, aquí verificarías el token con Firebase Admin SDK
  // Por ahora, simplemente verificamos que exista
  const token = authHeader.substring(7);
  
  if (!token) {
    return res.status(401).json({ error: 'Token inválido' });
  }

  // Guardar el token en la request para uso posterior
  req.token = token;
  next();
};

module.exports = { authMiddleware };
