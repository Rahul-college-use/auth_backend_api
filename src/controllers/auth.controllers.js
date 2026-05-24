import userModel from "../models/user.model.js";
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import config from "../config/config.js";
import sessionModel from "../models/session.model.js";
import { sendEmail } from "../services/email.service.js";
import { generateOtp , getOtpHtml } from "../utils/utils.js";
import otpModel from "../models/otp.model.js";


export async function register(req, res) {

    const { username, email, password } = req.body;
    const IsAlreadyRegister = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (IsAlreadyRegister) {
        res.status(409).json({
            massage: "Username or email  already taken"
        })
    }

    //set hashed password created
    const hashedPassword = crypto.createHash("sha512").update(password).digest('hex')
    //user created in import bd
    const user = await userModel.create({
        username,
        email,
        password: hashedPassword
    })

    const otp = generateOtp();
    const html = getOtpHtml(otp);
    const otpHash = crypto.createHash("sha512").update(otp).digest('hex')
    await otpModel.create({
        email,
        user: user._id,
        otpHash
    })

    await sendEmail(user.email, "Welcome to Registration", "Thank you for registering with us!", html)

  

    res.status(201).json({
        message: "User register successfully ",
        user: {
            username: user.username,
            email: user.email,
            verified: user.verified

        },
    })




}

export async function get_me(req, res) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            massage: "Token not found"
        })
    }
    const decoded = jwt.verify(token, config.JWT_SECRET);

    const user = await userModel.findById(decoded.id)

    res.status(200).json({
        message: "Data retrived successfully ",
        user: {
            username: user.username,
            email: user.email
        }
    })

}

export async function refreshToken(req, res) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.status(401).json({
            message: "Refresh Token Not Yet"
        })
    }
    const decoded = jwt.verify(refreshToken, config.JWT_SECRET)

    const refreshTokenHash = crypto.createHash("sha512").update(refreshToken).digest('hex')
    const session = await sessionModel.findOne({
        refreshTokenHash,
        revoked: false
    })
    if (!session) {
        return res.status(401).json({
            message: "Invalid Refresh Token"
        })
    }

    const accessToken = jwt.sign({
        id: decoded.id
    }, config.JWT_SECRET,
        {
            expiresIn: "15m"
        }
    )

    const newRefreshToken = jwt.sign({
        id: decoded.id
    }, config.JWT_SECRET, {
        expiresIn: "7d"
    })

    const newRefreshTokenHash = crypto.createHash("sha512").update(newRefreshToken).digest('hex')
    session.refreshTokenHash = newRefreshTokenHash;
    await session.save();

    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    res.status(200).json({
        message: "Access Token Refresh sucessfully ",
        accessToken
    })
}

export async function logout(req, res) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.status(401).json({
            message: "Refresh Token Not Yet"
        })
    }
    const refreshTokenHash = crypto.createHash("sha512").update(refreshToken).digest('hex')
    const session = await sessionModel.findOne({
        refreshTokenHash,
        revoked: false
    })
    if (!session) {
        res.status(401).json({
            message: "Invalid Refresh Token"
        })
    }

    session.revoked = true;
    await session.save();
    res.clearCookie("refreshToken")
    res.status(200).json({
        message: "Logout successfully"
    })
}

export async function logoutAll(req, res) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({
            message: "Refresh Token not found"
        })
    }
    const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

    await sessionModel.updateMany({
        userId: decoded.id,
        revoked: false
    }, {
        revoked: true
    })
    res.clearCookie("refreshToken")
    res.status(200).json({
        message: "All sessions logged out successfully"
    })
}

export async function login(req, res) {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password"
        })
    }

    if (!user.verified) {
        return res.status(401).json({
            message: "Please verify your email to login"
        })
    }
    const hashedPassword = crypto.createHash("sha512").update(password).digest('hex')
    if (hashedPassword !== user.password) {
        return res.status(401).json({
            message: "Invalid email or password"
        })
    }
    
    const refreshToken = jwt.sign({
        id: user._id
    }, config.JWT_SECRET, {
        expiresIn: "7d"
    })

    const refreshTokenHash = crypto.createHash("sha512").update(refreshToken).digest('hex')
    const session = await sessionModel.create({
        userId: user._id,
        refreshTokenHash: refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers['user-agent']
    })  

    const accessToken = jwt.sign({
        id: user._id,
        sessionId: session._id
    }, config.JWT_SECRET, {
        expiresIn: "15m"
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({
        message: "Login successfully",
        user: {
            username: user.username,
            email: user.email,
            verified: user.verified
        },
        accessToken
    })
}

export async function verifyEmail(req, res) {
    const { email, otp } = req.body;
    const otpHash = crypto.createHash("sha512").update(otp).digest('hex')
    const otpDoc = await otpModel.findOne({ email, otpHash })
    if (!otpDoc) {
        return res.status(400).json({
            message: "Invalid OTP"
        })
    }
    const user = await userModel.findByIdAndUpdate(otpDoc.user, {
        verified: true
    }, {
        new: true
    })
    await otpModel.findByIdAndDelete(otpDoc._id)

    res.status(200).json({
        message: "Email verified successfully",
        user: {
            username: user.username,
            email: user.email,
            verified: user.verified
        }
    })
}