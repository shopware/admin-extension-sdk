/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { privilegeString } from '../../privileges/privilege-resolver';
import type { privileges } from '../../privileges/privilege-resolver';
import type { ShopwareMessageTypes } from '../../messages.types';
import { findExtensionByBaseUrl } from '../../privileges/privilege-resolver';
import { traverseObject } from '../utils';
import MissingPrivilegesError from '../../privileges/missing-privileges-error';

export default function validate({
  serializedData,
  origin,
  type,
  privilegesToCheck = [],
}: {
  serializedData: any,
  origin: string,
  type: keyof ShopwareMessageTypes,
  privilegesToCheck: (keyof privileges)[],
}): Error|null {
  if (origin === undefined) {
    return null;
  }

  const extension = findExtensionByBaseUrl(origin);

  if (!extension) {
    console.warn(`No extension found for origin "${origin}"`);
    return null;
  }

  // Check privileges for entity
  const privilegeErrors: privilegeString[] = [];

  traverseObject(serializedData, (parentEntry, key, value) => {
    if (key === '__type__' && ['__EntityCollection__', '__Entity__'].includes(value as string)) {
      const entityName = parentEntry.__entityName__ as string;

      if (!entityName) {
        return;
      }

      [...privilegesToCheck].sort().forEach(privilege => {
        const permissionsForPrivilege = extension.permissions[privilege];
        if (
          (
            !permissionsForPrivilege ||
            !permissionsForPrivilege.includes(entityName)
          )
          &&
          !privilegeErrors.includes(`${privilege}:${entityName}`)
          &&
          !permissionsForPrivilege?.includes('*')
        ) {
          privilegeErrors.push(`${privilege}:${entityName}`);
        }
      });
    }
  });

  if (privilegeErrors.length > 0) {
    return new MissingPrivilegesError(type, privilegeErrors);
  }

  return null;
}
