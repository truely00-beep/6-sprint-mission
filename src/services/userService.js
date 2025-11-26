import { CustomError } from '../libs/Handler/errorHandler.js';
import userRepository from '../repositories/userRepository.js';
import bcrypt from 'bcrypt';

async function hashingPassword(password) { // 함수 추가
    return bcrypt.hash(password, 12);
}


class UserService {
    async createUser(user) {
        const existedUser = await userRepository.findByEmail(user.email);
        if (existedUser) {
            throw new CustomError(422, 'User already exists', { email: user.email });
        }
        const hashedPassword = await hashingPassword(user.password);
        const createdUser = await userRepository.save({ ...user, password: hashedPassword });
        return this.filterSensitivceUserData(createdUser);
    }

    filterSensitivceUserData(user) {
        const { password, ...rest } = user;
        return rest;
    }

    async getUser(email, password) {
        const user = await userRepository.findByEmail(email);
        if (!user) throw new CustomError(401, 'Unauthorized');

        await this.verifyPassword(password, user.password);
        return this.filterSensitivceUserData(user);
    }

    async verifyPassword(inputPassword, savedPassword) {
        const isValid = await bcrypt.compare(inputPassword, savedPassword);
        if (!isValid) throw new CustomError(401, 'Unauthorized');

    }
}

export const userService = new UserService();