export const combineObjects = (...objects: any[]) => {
  return objects.reduce((acc, obj) => {
    return { ...acc, ...obj };
  }, {});
};
