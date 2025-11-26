import { userService } from '../services/userService.js';


export async function register(req, res, next) {
    try {
        const user = await userService.createUser(req.body);
        return res.status(201).json(user);
    }
    catch (err) { next(err); }
}

export async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const user = await userService.getUser(email, password);
        return res.status(200).json(user);
    }
    catch (err) { next(err); }
}    
