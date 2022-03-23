import { ShopwareMessageTypePrivileges } from '.';
import type { ShopwareMessageTypes } from '../messages.types';

export type privilegeString = `${keyof privileges}:${string}`;

export type privileges = {
    create?: Array<string>,
    read?: Array<string>,
    update?: Array<string>,
    delete?: Array<string>,
}

export type extension = {
  baseUrl: string,
  permissions: privileges,
}

export type extensions = {
  [key: string]: extension,
}

export function sendPrivileged(messageType: keyof ShopwareMessageTypes): Array<privilegeString> | null {
  const requiredPrivileges = getRequiredPrivilegesForMessage(messageType);
  const locationPriviliges = getLocationPrivileges(window.location);

  if (!requiredPrivileges || Object.keys(requiredPrivileges).length <= 0) {
    return null;
  }

  return getMissingPrivileges(requiredPrivileges, locationPriviliges);
}

export function handlePrivileged(messageType: keyof ShopwareMessageTypes, extensions: extensions, origin: string): Array<privilegeString> | null {
  const requiredPrivileges = getRequiredPrivilegesForMessage(messageType);
  const extension = findExtensionByBaseUrl(extensions, origin);

  if (!extension) {
    return null;
  }

  return getMissingPrivileges(requiredPrivileges, extension.permissions);
}

function getRequiredPrivilegesForMessage<MESSAGE_TYPE extends keyof ShopwareMessageTypes>(messageType: MESSAGE_TYPE): typeof ShopwareMessageTypePrivileges[MESSAGE_TYPE]
function getRequiredPrivilegesForMessage(messageType: string): privileges
function getRequiredPrivilegesForMessage<MESSAGE_TYPE extends keyof ShopwareMessageTypes>(messageType: MESSAGE_TYPE | string): typeof ShopwareMessageTypePrivileges[MESSAGE_TYPE] | privileges  {
  return ShopwareMessageTypePrivileges[messageType] ?? {};
}

function getLocationPrivileges(location: Location): privileges {
  const params = new URLSearchParams(location.search);
  const privilegeString = params.get('privileges');

  if (!privilegeString) {
    return {};
  }

  const privileges = JSON.parse(privilegeString) as privileges;

  return privileges;
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

export function findExtensionByBaseUrl(extensions: extensions, baseUrl: string): extension | null {
  let extension = null;
  Object.values(extensions).forEach((ext) => {
    if (ext.baseUrl === baseUrl) {
      extension = ext;
    }
  });

  return extension;
}
