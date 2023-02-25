import { ObjectID } from 'mongodb';
/**
 * To use in @Transform decorator to tranform property value
 * @param value ObjectID or entity Object to transform
 */
export function transformEntity({ value }) {
  if (value?._id) value._id = new ObjectID(value._id).toHexString();
  // the value it's a entity object
  else if (value) value = new ObjectID(value).toHexString(); // the value it's just an id
  return value; // return the same passed value in case it's false
}
