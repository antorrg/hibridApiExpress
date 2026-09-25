import {v7 as uuidV7} from 'uuid'

export class UuidHandler{
    static createUuid = () => {
        return uuidV7()
    }
    static uuidRegex  = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-7][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    static uuidValidator = (value) => {
    // Acepta UUIDs desde versión 1 hasta versión 7 (incluyendo v4 y v7)
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-7][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
    if (!UUID_REGEX) throw new Error('UUID invalid format');
    return value;
  }
}