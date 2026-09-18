import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: any;
}

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode = 200,
  meta?: any
): Response => {
  const responsePayload: ApiResponse<T> = {
    success: true,
    message,
    data,
    meta,
  };
  return res.status(statusCode).json(responsePayload);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 500,
  errors?: any
): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
