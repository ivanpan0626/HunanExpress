import {Router} from 'express';
import {sample_users} from '../data.js';
import jwt from 'jsonwebtoken';
import {BAD_REQUEST} from '../constants/httpStatus.js';
import handler from 'express-async-handler';
import {UserModel} from '../models/user.model.js';
import bcrypt from 'bcryptjs';

const router = Router();

router.post('/login', handler(async  (req, res) => {
    const {email, password} = req.body;
    //const user = sample_users.find(
        //user => user.email === email && user.password === password
    //);
    const emailRegex = new RegExp(email, 'i');
    const user = await UserModel.findOne({email: {$regex: emailRegex}});

    if (user && (await bcrypt.compare(password, user.password))){
        res.send(generateTokenResponse(user));
        return;
    }

    res.status(BAD_REQUEST).send('Username or Password is invalid');
}));

const generateTokenResponse = user => {
    const token = jwt.sign({
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin
    }, process.env.JWT_SECRET,
    {
        expiresIn: '30d',
    });

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        isAdmin: user.isAdmin,
        token,
    };
};

export default router;