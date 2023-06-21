import { ShopwareMessageTypePrivileges } from '.';
import type { ShopwareMessageTypes } from '../messages.types';
import { adminExtensions } from '../channel';

export type privilegeString = `${keyof privileges}:${string}`;

export type privileges = {
  additional?: Array<string>,
  create?: Array<string>,
  read?: Array<string>,
  update?: Array<string>,
  delete?: Array<string>,
}

export type extension = {
  baseUrl: string,
  permissions: privileges,
}

export function sendPrivileged(messageType: keyof ShopwareMessageTypes): Array<privilegeString> | null {
  const requiredPrivileges = getRequiredPrivilegesForMessage(messageType);
  const locationPrivileges = getLocationPrivileges(window.location);

  if (!requiredPrivileges || Object.keys(requiredPrivileges).length <= 0) {
    return null;
  }

  return getMissingPrivileges(requiredPrivileges, locationPrivileges);
}

export function handlePrivileged(messageType: keyof ShopwareMessageTypes, origin: string): Array<privilegeString> | null {
  const requiredPrivileges = getRequiredPrivilegesForMessage(messageType);
  const extension = findExtensionByBaseUrl(origin);

  if (!extension) {
    return null;
  }

  return getMissingPrivileges(requiredPrivileges, extension.permissions);
}

function getRequiredPrivilegesForMessage<MESSAGE_TYPE extends keyof ShopwareMessageTypes>(messageType: MESSAGE_TYPE): typeof ShopwareMessageTypePrivileges[MESSAGE_TYPE]
function getRequiredPrivilegesForMessage(messageType: string): privileges
function getRequiredPrivilegesForMessage<MESSAGE_TYPE extends keyof ShopwareMessageTypes>(messageType: MESSAGE_TYPE | string): typeof ShopwareMessageTypePrivileges[MESSAGE_TYPE] | privileges {
  return ShopwareMessageTypePrivileges[messageType] ?? {};
}

function getLocationPrivileges(location: Location): privileges {
  const params = new URLSearchParams(location.search);
  const privilegeString = params.get('privileges');

  if (!privilegeString) {
    return {};
  }

  return JSON.parse(privilegeString) as privileges;
}

function getMissingPrivileges(requiredPrivileges: privileges, privileges: privileges): null | Array<privilegeString> {
  const requiredRoles = Object.keys(requiredPrivileges) as Array<keyof privileges>;
  const missingPriviliges: Array<privilegeString> = [];

  // Compare detailed priviliges of each role and add missing to stack
  requiredRoles.forEach((requiredRole) => {
    requiredPrivileges[requiredRole]?.forEach((privilege) => {
      if (!privileges[requiredRole]?.includes(privilege)) {
        missingPriviliges.push(`${requiredRole}:${privilege}`);
      }
    });
  });

  return missingPriviliges.length >= 1 ? missingPriviliges : null;
}

export function findExtensionByBaseUrl(baseUrl: string): extension | undefined {
  if (typeof baseUrl !== 'string') {
    return undefined;
  }

  if (baseUrl === '') {
    return undefined;
  }

  const comparedBaseUrl = new URL(baseUrl);

  /*
   * Check if baseUrl is the same as the current window location
   * If so, return the dummy extension with all privileges available
   */
  if (comparedBaseUrl.origin === window.location.origin) {
    return {
      baseUrl: comparedBaseUrl.hostname,
      permissions: {
        additional: ['*'],
        create: ['*'],
        read: ['*'],
        update: ['*'],
        delete: ['*'],
      },
    };
  }

  return Object.values(adminExtensions)
    .find((ext) => {
      const extensionBaseUrl = new URL(ext.baseUrl);
      
      return extensionBaseUrl.hostname === comparedBaseUrl.hostname;
    });
}
