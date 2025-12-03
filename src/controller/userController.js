import { userService } from '../services/userService.js';

export default class UserServiceController {
    async register(req, res) {
        const user = await userService.createUser(req.body);
        return res.status(201).json(user);
    }

    async login(req, res) {
        const { email, password } = req.body;
        const user = await userService.getUser(email, password);
        const accessToken = userService.createToken(user);
        const refreshToken = userService.createToken(user, 'refresh');
        await userService.updateUser(user.id, { refreshToken });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true
        });
        return res.status(200).json({ accessToken });
    }
    async refresh(req, res) {
        const { refreshToken } = req.cookies;
        const { userId } = req.auth;
        const { accessToken, newRefreshToken } = await userService.refreshToken(userId, refreshToken); // 변경
        await userService.updateUser(userId, { refreshToken: newRefreshToken }); // 추가
        res.cookie('refreshToken', newRefreshToken, { // 추가
            path: '/token/refresh',
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        });
        return res.json({ accessToken });
    }
    async GetMe(req, res) {
        const userId = req.user.userId;
        const user = await userService.getUserById(userId);
        return res.status(200).json(user);
    }
    async updateMe(req, res) {
        const userId = req.user.userId;
        const updatedUser = await userService.updateProfile(userId, req.body);
        return res.status(200).json(updatedUser);
    }

    async updateMyPassword(req, res) {
        const userId = req.user.userId;
        const updatedUser = await userService.updatePassword(userId, req.body);
        return res.status(200).json(updatedUser);
    }

    async getMyProducts(req, res) {
        const userId = req.user.userId;
        const products = await userService.getProductsByUserId(userId);
        return res.status(200).json(products);
    }

    async getMyLikedProducts(req, res) {
        const userId = req.user.userId;
        const products = await userService.getLikedProductsByUserId(userId);
        return res.status(200).json(products);
    }
}
