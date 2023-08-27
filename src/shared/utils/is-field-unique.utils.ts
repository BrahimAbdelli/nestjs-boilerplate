import { ObjectLiteral, Repository } from 'typeorm';
import { throwError } from './throw-error.utils';

/**
 * Check if the given field is unique
 * @param repository  corresponding entity repository
 * @param field object containing a single field
 * @example {_id : "645ead8b586d13a6932d46dd" }
 * {title : "some title to check if exists"}
=
 * @returns boolean representing the uniqueness of the field
 */
export async function isFieldUnique<T>(repository: Repository<T>, field: object, id?: string): Promise<boolean> {
  // get name and value from object field
  const fieldKey: string = Object.keys(field)[0];
  const fieldValue: any = Object.values(field)[0];

  const condition = { [fieldKey]: new RegExp(`^${fieldValue}$`, 'i') };
  const entity: ObjectLiteral = await repository.findOne({ where: condition });

  let isUnique = false;

  if (id) {
    if (!entity) isUnique = true;
    else isUnique = entity._id.toHexString() === id && entity[fieldKey].toLowerCase() === fieldValue.toLowerCase();
  } else isUnique = !!!entity; // false if entity is not found

  if (!isUnique) throwError({ [`${fieldKey}isUnique`]: fieldKey + ' must be unique.' }, 'Input data validation failed');

  return isUnique;
}
