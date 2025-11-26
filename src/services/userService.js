import { CustomError } from '../libs/Handler/errorHandler.js';
import userRepository from '../repositories/userRepository.js';


class UserService {
    async createUser(user) {
        const existedUser = await userRepository.findByEmail(user.email);
        if (existedUser) {
            throw new CustomError(422, 'User already exists', { email: user.email });
        }
        const createdUser = await userRepository.save({ ...user });
        return this.filterSensitivceUserData(createdUser);
    }

    filterSensitivceUserData(user) {
        const { password, ...rest } = user;
        return rest;
    }

    async getUser(email, password) {
        const user = await userRepository.findByEmail(email);
        if (!user) throw new CustomError(401, 'Unauthorized');

        this.verifyPassword(password, user.password);
        return this.filterSensitivceUserData(user);
    }

    verifyPassword(inputPassword, password) {
        const isMatch = inputPassword === password;
        if (!isMatch) {
            const error = new Error('Unauthorized');
            error.code = 401;
            throw error;
        }
    }
}

export const userService = new UserService();