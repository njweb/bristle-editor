import { ObjKey, ObjEntry, StdObj } from '../common.types';

type RebuildMapFn = (entry: ObjEntry) => [ObjKey, unknown];
type RebuildFilterFn = (entry: ObjEntry) => boolean;

export const rebuild = (
  obj: StdObj,
  mapFn: RebuildMapFn,
  filterFn: RebuildFilterFn|undefined = undefined,
): StdObj => {
  const entries = Object.entries(obj);
  const mapped = entries.map(mapFn);
  if (filterFn) {
    return Object.fromEntries(mapped.filter(filterFn));
  }
  return Object.fromEntries(mapped);
};

export const buildObjProperties = (() => {
  const defaultPropertySettings = {
    configurable: false,
    writable: true,
    enumerable: true,
  }
  return (obj: StdObj, propertySettings = defaultPropertySettings) => {
    return rebuild(obj, ([key, value]) => [key, { ...propertySettings, value }]);
  };
})();
