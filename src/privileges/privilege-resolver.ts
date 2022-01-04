import { ShopwareMessageTypePrivileges } from '.';
import { ShopwareMessageTypes } from '../messages.types';

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

export function sendPrivileged(messageType: keyof ShopwareMessageTypes): Array<string> | null {
  const requiredPrivileges = getRequiredPrivilegesForMessage(messageType);
  const locationPriviliges = getLocationPrivileges(window.location);

  if (!requiredPrivileges || Object.keys(requiredPrivileges).length <= 0) {
    return null;
  }

  return getMissingPrivileges(requiredPrivileges, locationPriviliges);
}

export function handlePrivileged(messageType: keyof ShopwareMessageTypes, extensions: extensions, origin: string): Array<string> | null {
  const requiredPrivileges = getRequiredPrivilegesForMessage(messageType);
  const extension = findExtensionByBaseUrl(extensions, origin);

  if (!extension) {
    return null;
  }

  return getMissingPrivileges(requiredPrivileges, extension.permissions);
}

function getRequiredPrivilegesForMessage(messageType: keyof ShopwareMessageTypes): privileges  {
  return ShopwareMessageTypePrivileges[messageType];
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

function getMissingPrivileges(requiredPrivileges: privileges, privileges: privileges): null | Array<string> {
  const requiredRoles = Object.keys(requiredPrivileges) as Array<keyof privileges>;
  const missingPriviliges: Array<string> = [];

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

function findExtensionByBaseUrl(extensions: extensions, baseUrl: string): extension | null {
  let extension = null;
  Object.values(extensions).forEach((ext) => {
    if (ext.baseUrl === baseUrl) {
      extension = ext;
    }
  });

  return extension;
}