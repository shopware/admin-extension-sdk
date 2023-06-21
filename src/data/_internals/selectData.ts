import { toPath, get } from 'lodash';
import type { ShopwareMessageTypes } from '../../messages.types';
import MissingPrivilegesError from '../../privileges/missing-privileges-error';
import type { privilegeString } from '../../privileges/privilege-resolver';
import { findExtensionByBaseUrl } from '../../privileges/privilege-resolver';

export function selectData(
  sourceData: unknown,
  selectors?: string[],
  messageType: keyof ShopwareMessageTypes = 'datasetSubscribe',
  origin?: string,
): unknown {
  const extension = findExtensionByBaseUrl(origin ?? '');
  const permissionErrors: Array<privilegeString> = [];

  if (!selectors) {
    return sourceData;
  }

  const selectedData = selectors.reduce<{
      [key: string]: unknown,
    }>((acc, selector) => {
      // Check permissions for path entries
      ['', ...toPath(selector)].forEach((path) => {
        const value = path !== '' ? get(sourceData, path) as unknown : sourceData;
        let entityName = '';

        // @ts-expect-error - we just check if the value is an entity
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        if (value && value.__identifier__ && value.__identifier__() === 'Entity') {
          // @ts-expect-error - we know that the value is an entity
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
          entityName = value.getEntityName();
        }

        // @ts-expect-error - we just check if the value is an entityCollection
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        if (value && value.__identifier__ && value.__identifier__() === 'EntityCollection') {
          // @ts-expect-error - we know that the value is an entityCollection
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
          entityName = value.entity;
        }

        if (!entityName) {
          return;
        }

        const permissionsToCheck = ['read'] as const;

        permissionsToCheck.forEach((privilege) => {
          const permissionsForPrivilege = extension?.permissions[privilege];

          if (
            (
              !permissionsForPrivilege ||
              !permissionsForPrivilege.includes(entityName)
            )
            &&
            !permissionErrors.includes(`${privilege}:${entityName}`)
            &&
            !permissionsForPrivilege?.includes('*')
          ) {
            permissionErrors.push(`${privilege}:${entityName}`);
          }
        });
      });

      const value = get(sourceData, selector) as unknown;

      if (value !== undefined) {
        acc[selector] = value;
      }

      return acc;
    }, {});

  if (!extension) {
    console.warn(`No extension found for origin "${origin ?? ''}"`);
    return selectedData;
  }

  if (permissionErrors.length) {
    return new MissingPrivilegesError(messageType, permissionErrors);
  }

  return selectedData;
}
