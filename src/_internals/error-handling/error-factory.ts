import HandleError from './HandleError';
import {hasOwnProperty} from '../utils';
import MissingPrivilegesError from '../../privileges/missing-privileges-error';
import type {ShopwareMessageTypes} from '../../messages.types';
import type { privilegeString } from '../../privileges/privilege-resolver';

export default function createError(type: keyof ShopwareMessageTypes, e: unknown): Error {
  if (typeof e === 'string') {
    return new HandleError(e);
  }

  if (!(e instanceof Error)) {
    return new HandleError('An unknown error occurred.');
  }

  /* eslint-disable */
  if (hasOwnProperty(e, 'response.data.errors.0.code') && (e as any).response.data.errors.length) {
    const missingPrivilegeErrors = (e as any).response.data.errors
      .filter((error: { code: string }) => error.code === 'FRAMEWORK__MISSING_PRIVILEGE_ERROR') as { detail: string }[];

    const missingPrivileges: privilegeString[] = [];

    missingPrivilegeErrors.forEach((mpe) => {
      const data = JSON.parse(mpe.detail) as { message: string, missingPrivileges: privilegeString[]};

      missingPrivileges.push(...data.missingPrivileges);
    });

    if (missingPrivileges.length) {
      return new MissingPrivilegesError(type, missingPrivileges);
    }

    return new HandleError((e as any).response.data.errors[0].code, (e as any).response.data.errors[0].status);
  }

  return new HandleError(e.message);
}
