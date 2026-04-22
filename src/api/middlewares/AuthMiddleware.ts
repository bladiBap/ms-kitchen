// import { container } from "tsyringe";
// import { Request, Response, NextFunction } from "express";
// import { JsonWebToken } from "@infrastructure/servicios/JsonWebToken";
// import { ISecurity, Payload } from "@shared/jwt/ISecurity";
// import { Result } from "@core/results/Result";
// import { CommonError } from "@application/common/Errors/CommonErrors";

// export const AuthMiddleware = () => {
// 	return async (req: Request, res: Response, next: NextFunction) => {
// 		const jwt: ISecurity = container.resolve(JsonWebToken);
// 		const authHeader = req.headers.authorization;

// 		if (!authHeader || !authHeader.startsWith("Bearer ")) {
// 			return res.status(401).json(Result.failure(CommonError.tokenRequerido()));
// 		}

// 		const token = authHeader.split(" ")[1];

// 		try {
// 			const decoded: Payload | null = await jwt.obtenerPayload(token ?? "");

// 			if (!decoded) {
// 				return res.status(401).json(Result.failure(CommonError.tokenInvalido()));
// 			}

// 			req.usuario = decoded;

// 			return next();
// 		} catch (error) {
// 			console.error("\x1b[31m%s\x1b[0m", "[AuthMiddleware Error]:", error);
// 			return res.status(401).json(Result.failure(CommonError.tokenInvalido()));
// 		}
// 	};
// };
