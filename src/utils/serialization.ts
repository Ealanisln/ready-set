// src/utils/serialization.ts
type SerializableObject = { [key: string]: any };

export const serializeBigInt = <T extends SerializableObject>(obj: T): SerializableObject => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (typeof value === 'bigint') {
      acc[key] = value.toString();
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      acc[key] = serializeBigInt(value);
    } else if (Array.isArray(value)) {
      acc[key] = value.map(item => 
        typeof item === 'object' ? serializeBigInt(item) : item
      );
    } else {
      acc[key] = value;
    }
    return acc;
  }, {} as SerializableObject);
};
