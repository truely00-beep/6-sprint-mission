import { assert } from 'superstruct';
import { CustomError } from '../libs/Handler/errorHandler.js';
import userRepository from '../repositories/userRepository.js';
import productRepository from '../repositories/productRepository.js';
import productLikeRepository from '../repositories/productLikeRepository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PatchUser, ChangePassword } from '../structs/userStructs.js';

async function hashingPassword(password) {
    // 함수 추가
    return bcrypt.hash(password, 12);
}

class UserService {
    async createUser(user) {
        const existedUser = await userRepository.findByEmail(user.email);
        if (existedUser) {
            throw new CustomError(422, 'User already exists', {
                email: user.email,
            });
        }
        const hashedPassword = await hashingPassword(user.password);
        const createdUser = await userRepository.save({
            ...user,
            password: hashedPassword,
        });
        return this.filterSensitivceUserData(createdUser);
    }

    filterSensitivceUserData(user) {
        const { password, refreshToken, ...rest } = user;
        return rest;
    }

    async getUser(email, password) {
        const user = await userRepository.findByEmail(email);
        if (!user) throw new CustomError(401, 'Unauthorized');

        await this.verifyPassword(password, user.password);
        return this.filterSensitivceUserData(user);
    }


    async getUserById(id) {
        const user = await userRepository.findById(id);
        if (!user) {
            throw new CustomError(404, 'User not found');
        }
        return this.filterSensitivceUserData(user);
    }

    async updateProfile(id, data) {
        assert(data, PatchUser);
        const user = await userRepository.update(id, data);
        return this.filterSensitivceUserData(user);
    }

    async updatePassword(id, data) {
        assert(data, ChangePassword);
        const { currentPassword, newPassword, confirmNewPassword } = data;
        if (newPassword !== confirmNewPassword) {
            throw new CustomError(400, "Passwords don't match");
        }
        const user = await userRepository.findById(id);
        await this.verifyPassword(currentPassword, user.password);

        const hashedPassword = await hashingPassword(newPassword);
        const updatedUser = await userRepository.update(id, { password: hashedPassword });
        return this.filterSensitivceUserData(updatedUser);
    }

    async getProductsByUserId(id) {
        const products = await productRepository.findByUserId(id);
        return products;
    }

    async getLikedProductsByUserId(id) {
        const products = await productLikeRepository.findLikedProductsByUserId(id);
        return products;
    }


    async updateUser(id, data) {
        return await userRepository.update(id, data);
    }
    async verifyPassword(inputPassword, savedPassword) {
        const isValid = await bcrypt.compare(inputPassword, savedPassword);
        if (!isValid) throw new CustomError(401, 'Unauthorized');
    }
    createToken(user, type) {
        const payload = { userId: user.id };
        const options = {
            expiresIn: type === 'refresh' ? '1d' : '10m',
        };
        return jwt.sign(payload, process.env.JWT_SECRET, options);
    }
    async refreshToken(userId, refreshToken) {
        const user = await userRepository.findById(userId);
        if (!user || user.refreshToken !== refreshToken) {
            throw new CustomError(401, 'Unauthorized');
        }
        const accessToken = this.createToken(user); // 변경
        const newRefreshToken = this.createToken(user, 'refresh'); // 추가
        return { accessToken, newRefreshToken }; // 변경
    }
}

export const userService = new UserService();