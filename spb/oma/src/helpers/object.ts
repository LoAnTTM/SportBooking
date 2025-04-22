export const combineObjects = (...objects: any[]) => {
  return objects.reduce((acc, obj) => {
    return { ...acc, ...obj };
  }, {});
};

export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

export const compare = <T>(
  obj1: T,
  obj2: T,
  ignore: string[] = []
): boolean => {
  if (obj1 === obj2) return true;
  if (!obj1 || !obj2) return false;

  const objCopy1 = deepClone(obj1);
  const objCopy2 = deepClone(obj2);

  for (const path of ignore) {
    removeProperty(objCopy1, path);
    removeProperty(objCopy2, path);
  }

  return JSON.stringify(objCopy1) === JSON.stringify(objCopy2);
};

const removeProperty = (obj: any, path: string): void => {
  if (!obj || typeof obj !== 'object') return;

  const parts = path.split('.');
  const lastPart = parts.pop();

  let current = obj;
  for (const part of parts) {
    if (current[part] === undefined || current[part] === null) return;
    current = current[part];
    if (typeof current !== 'object') return;
  }

  if (lastPart && current) {
    delete current[lastPart];
  }
};
