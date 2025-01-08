function resolveAll(obj, defaultClassName) {
    if (!obj || obj === '0000') {
      return null;
    }
  
    for (const prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        if (typeof obj[prop] === 'object' && prop !== '_neighbours') {
          obj[prop] = resolveAll(obj[prop]);
        }
      }
    }
  
    const className = obj.className || defaultClassName;
  
    if (className) {
      switch (className) {
        case 'LinkedList':
          return Array.isArray(obj.data) ? obj.data : obj;
        case 'HashSet':
          return Array.isArray(obj.data) ? [...new Set(obj.data)] : obj;
        default:
          return obj;
      }
    }
  
    if (Array.isArray(obj) && obj.length === 2 && typeof obj[0] === 'string') {
      const possibleClassName = obj[0];
      const data = obj[1];
  
      switch (possibleClassName) {
        case 'LinkedList':
        case 'ArrayList':
          return Array.isArray(data) ? data : obj;
        case 'HashSet':
          return Array.isArray(data) ? [...new Set(data)] : obj;
        default:
          console.error(`Unresolved class name: ${possibleClassName}`);
          return obj;
      }
    }
  
    return obj;
  }
  
  module.exports = {
    resolveAll
  };
  