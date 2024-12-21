import { v4 as id } from 'uuid'

export const generateRoomId = (): string => {
    return id();
}