import type { AxiosError } from 'axios';

interface ResolvedError {
  message: string;
  code: string;
}

export function useAuthForm() {
  const api = useApi();
  const authStore = useAuthStore();
  const router = useRouter();

  const error = ref<string>('');
  const errorCode = ref<string>('');
  const loading = ref<boolean>(false);

  function resolveError(e: unknown): ResolvedError {
    const axiosErr = e as AxiosError<{ message?: string; code?: string }>;
    const status = axiosErr.response?.status;
    const serverMsg = axiosErr.response?.data?.message;
    const code = axiosErr.response?.data?.code;

    if (status === 401) return { message: serverMsg || 'Неверный email или пароль', code: 'UNAUTHORIZED' };
    if (status === 400 && code === 'BAD_REQUEST') return { message: serverMsg || 'Некорректные данные', code };
    if (status === 429) return { message: 'Слишком много попыток. Подождите минуту.', code: 'RATE_LIMIT' };
    if (!axiosErr.response) return { message: 'Сервер недоступен. Проверьте соединение.', code: 'NETWORK' };
    return { message: serverMsg || 'Ошибка. Попробуйте ещё раз.', code: code || 'UNKNOWN' };
  }

  function clearError(): void {
    error.value = '';
    errorCode.value = '';
  }

  async function login(email: string, password: string): Promise<boolean> {
    loading.value = true;
    clearError();
    try {
      const { data } = await api.post<{ user: User; token: string; refreshToken: string }>('/auth/login', { email, password });
      authStore.login(data.user, data.token, data.refreshToken);
      router.push('/editor');
      return true;
    } catch (e) {
      const resolved = resolveError(e);
      error.value = resolved.message;
      errorCode.value = resolved.code;
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function register(name: string, email: string, password: string): Promise<{ success: boolean; message?: string }> {
    loading.value = true;
    clearError();
    try {
      const { data } = await api.post<{ user: User; token: string; refreshToken: string }>('/auth/register', { name, email, password });
      authStore.login(data.user, data.token, data.refreshToken);
      router.push('/editor');
      return { success: true, message: 'Аккаунт создан! Переход в редактор...' };
    } catch (e) {
      const resolved = resolveError(e);
      error.value = resolved.message;
      errorCode.value = resolved.code;
      return { success: false };
    } finally {
      loading.value = false;
    }
  }

  return reactive({
    error,
    errorCode,
    loading,
    clearError,
    login,
    register,
  });
}
