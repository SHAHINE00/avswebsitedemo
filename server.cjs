const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const zlib = require('zlib');

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');

// Enhanced MIME types for comprehensive file type coverage
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.zip': 'application/zip',
  '.gz': 'application/gzip'
};

// Get common headers for web content
const getCommonHeaders = (mimeType, isCompressible = false) => {
  const headers = {
    'Content-Type': mimeType,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Cache-Control': mimeType.includes('html') ? 'no-cache, no-store, must-revalidate' : 'public, max-age=31536000'
  };
  
  if (isCompressible) {
    headers['Vary'] = 'Accept-Encoding';
  }
  
  return headers;
};

// Check if content should be compressed
const shouldCompress = (mimeType) => {
  return mimeType.includes('text/') || 
         mimeType.includes('application/javascript') || 
         mimeType.includes('application/json') || 
         mimeType.includes('image/svg');
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname;
  
  // Log requests for debugging
  console.log(`Request: ${req.method} ${pathname}`);
  
  // Remove leading slash and default to index.html
  if (pathname === '/') {
    pathname = 'index.html';
  } else {
    pathname = pathname.substring(1);
  }
  
  // Security: prevent directory traversal
  if (pathname.includes('..') || pathname.includes('~')) {
    res.writeHead(403, getCommonHeaders('text/plain; charset=utf-8', false));
    res.end('Forbidden');
    return;
  }
  
  const filePath = path.join(DIST_DIR, pathname);
  const ext = path.extname(filePath).toLowerCase();
  const mimeType = mimeTypes[ext] || 'text/html; charset=utf-8'; // Default to HTML instead of octet-stream
  const isCompressible = shouldCompress(mimeType);
  const acceptsGzip = req.headers['accept-encoding'] && req.headers['accept-encoding'].includes('gzip');
  
  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File doesn't exist, serve index.html for SPA routing with proper headers
      const indexPath = path.join(DIST_DIR, 'index.html');
      fs.readFile(indexPath, (err, content) => {
        if (err) {
          console.error('Error loading index.html:', err);
          const headers = getCommonHeaders('text/html; charset=utf-8', false);
          res.writeHead(500, headers);
          res.end('<!DOCTYPE html><html><head><title>Error</title></head><body><h1>500 - Server Error</h1><p>Unable to load application</p></body></html>');
        } else {
          const headers = getCommonHeaders('text/html; charset=utf-8', isCompressible);
          
          if (isCompressible && acceptsGzip) {
            headers['Content-Encoding'] = 'gzip';
            zlib.gzip(content, (err, compressed) => {
              if (err) {
                res.writeHead(200, getCommonHeaders('text/html; charset=utf-8', false));
                res.end(content);
              } else {
                res.writeHead(200, headers);
                res.end(compressed);
              }
            });
          } else {
            res.writeHead(200, headers);
            res.end(content);
          }
        }
      });
    } else {
      // File exists, serve it with proper headers
      fs.readFile(filePath, (err, content) => {
        if (err) {
          console.error('Error loading file:', filePath, err);
          const headers = getCommonHeaders('text/html; charset=utf-8', false);
          res.writeHead(500, headers);
          res.end('<!DOCTYPE html><html><head><title>Error</title></head><body><h1>500 - Server Error</h1><p>Unable to load file</p></body></html>');
        } else {
          const headers = getCommonHeaders(mimeType, isCompressible);
          
          if (isCompressible && acceptsGzip) {
            headers['Content-Encoding'] = 'gzip';
            zlib.gzip(content, (err, compressed) => {
              if (err) {
                res.writeHead(200, getCommonHeaders(mimeType, false));
                res.end(content);
              } else {
                res.writeHead(200, headers);
                res.end(compressed);
              }
            });
          } else {
            res.writeHead(200, headers);
            res.end(content);
          }
        }
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});