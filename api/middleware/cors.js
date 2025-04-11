// CORS middleware for API endpoints
// Use this middleware to handle CORS headers consistently

/**
 * CORS middleware function
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {Boolean} - true if the request was a preflight that was handled
 */
function handleCors(req, res) {
  // Always handle OPTIONS preflight requests
  if (req.method === 'OPTIONS') {
    // Set CORS headers for preflight requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours cache for preflight requests
    
    // End the request with 204 No Content
    res.status(204).end();
    return true; // Signal that the request was handled
  }
  
  // Set CORS headers for regular requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return false; // Signal that the request should proceed to the handler
}

module.exports = handleCors; 