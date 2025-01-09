export default function flattenObject(obj, parentKey = '', result = {}) {
    // Itera sobre as chaves do objeto
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = parentKey ? `${parentKey}_${key}` : key;
  
        // Se o valor for um objeto, chamamos a função recursivamente
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
          flattenObject(obj[key], newKey, result);
        } else {
          // Se não for objeto, adicionamos ao resultado
          result[newKey] = obj[key];
        }
      }
    }
  
    return result;
}