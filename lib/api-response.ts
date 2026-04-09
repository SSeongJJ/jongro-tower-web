import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function errorResponse(
  code: string,
  message: string,
  status: number,
) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export function validationErrorResponse(error: ZodError) {
  const message = error.errors.map((e) => e.message).join(', ');
  return errorResponse('VALIDATION_ERROR', message, 400);
}

export function unauthorizedResponse() {
  return errorResponse('UNAUTHORIZED', '인증이 필요합니다', 401);
}

export function notFoundResponse(resource = '리소스') {
  return errorResponse('NOT_FOUND', `${resource}을(를) 찾을 수 없습니다`, 404);
}

export function internalErrorResponse(message = '서버 오류가 발생했습니다') {
  return errorResponse('INTERNAL_ERROR', message, 500);
}
