import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import {
  errorResponse,
  internalErrorResponse,
  successResponse,
  validationErrorResponse,
} from '@/lib/api-response';
import { loginSchema } from '@/lib/validations/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          },
        },
      },
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return errorResponse('LOGIN_FAILED', '이메일 또는 비밀번호가 올바르지 않습니다', 401);
    }

    return successResponse({ user: { id: data.user.id, email: data.user.email } });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error);
    return internalErrorResponse();
  }
}
