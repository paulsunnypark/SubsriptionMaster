// API 클라이언트 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// API 응답 타입
export interface ApiResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// API 클라이언트 클래스
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  // 토큰 설정
  setToken(token: string) {
    this.token = token;
  }

  // 토큰 제거
  clearToken() {
    this.token = null;
  }

  // HTTP 요청 헤더 생성
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // HTTP 요청 메서드
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
    const baseHeaders = this.getHeaders();
    if (isFormData && 'Content-Type' in baseHeaders) {
      delete (baseHeaders as any)['Content-Type'];
    }
    const config: RequestInit = {
      ...options,
      headers: {
        ...baseHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return {
          ok: false,
          error: data.error || data.message || `HTTP ${response.status}`,
        };
      }

      return {
        ok: true,
        data,
      };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // GET 요청
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST 요청
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    return this.request<T>(endpoint, {
      method: 'POST',
      body: isFormData ? data : data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT 요청
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: isFormData ? data : data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE 요청
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // PATCH 요청
  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: isFormData ? data : data ? JSON.stringify(data) : undefined,
    });
  }
}

// API 클라이언트 인스턴스 생성
export const apiClient = new ApiClient(API_BASE_URL);

// 인증 관련 API
export const authAPI = {
  // 로그인
  login: (credentials: { email: string; password: string }) =>
    apiClient.post('/auth/login', credentials),

  // 회원가입
  register: (userData: { email: string; password: string; name: string }) =>
    apiClient.post('/auth/register', userData),

  // 로그아웃
  logout: () => apiClient.post('/auth/logout'),

  // 토큰 갱신
  refresh: (refreshToken: string) => apiClient.post('/auth/refresh', { refreshToken }),
  // 프로필 조회
  profile: () => apiClient.get('/users/profile'),
};

// 사용자 관련 API
export const usersAPI = {
  // 사용자 프로필 조회
  getProfile: () => apiClient.get('/users/profile'),
  
  // 사용자 프로필 업데이트
  updateProfile: (data: any) => apiClient.put('/users/profile', data),
  
  // 사용자 통계
  getStats: () => apiClient.get('/users/profile/stats'),
};

// 구독 관련 API
export const subscriptionsAPI = {
  // 구독 목록 조회
  getAll: () => apiClient.get('/subscriptions'),
  
  // 구독 상세 조회
  getById: (id: string) => apiClient.get(`/subscriptions/${id}`),
  
  // 구독 생성
  create: (data: any) => apiClient.post('/subscriptions', data),
  
  // 구독 수정
  update: (id: string, data: any) => apiClient.put(`/subscriptions/${id}`, data),
  
  // 구독 삭제
  delete: (id: string) => apiClient.delete(`/subscriptions/${id}`),
  
  // 구독 일시정지
  pause: (id: string) => apiClient.post(`/subscriptions/${id}/pause`),
  
  // 구독 재개
  resume: (id: string) => apiClient.post(`/subscriptions/${id}/resume`),
  
  // 구독 취소
  cancel: (id: string) => apiClient.post(`/subscriptions/${id}/cancel`),
  
  // 사용자별 구독 조회
  getByUser: (userId: string) => apiClient.get(`/subscriptions/user/${userId}`),
};

// 데이터 수집 관련 API
export const ingestAPI = {
  // CSV 파일 업로드
  uploadCSV: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/ingest/csv', formData);
  },
  
  // 거래 내역 조회
  getTransactions: () => apiClient.get('/ingest/transactions'),
  
  // 거래 통계
  getStats: () => apiClient.get('/ingest/transactions/stats'),
};

// 알림 관련 API
export const alertsAPI = {
  // 알림 목록 조회
  getAll: () => apiClient.get('/alerts'),
  
  // 알림 상세 조회
  getById: (id: string) => apiClient.get(`/alerts/${id}`),
  
  // 알림 읽음 처리
  markAsRead: (id: string) => apiClient.post(`/alerts/${id}/read`),
  
  // 알림 무시 처리
  dismiss: (id: string) => apiClient.post(`/alerts/${id}/dismiss`),
  
  // 알림 통계
  getStats: () => apiClient.get('/alerts/stats'),
};

// 절감 관련 API
export const savingsAPI = {
  // 절감 목록 조회
  getAll: () => apiClient.get('/savings'),
  
  // 절감 상세 조회
  getById: (id: string) => apiClient.get(`/savings/${id}`),
  
  // 절감 통계
  getStats: () => apiClient.get('/savings/stats'),
  
  // 목표 달성률
  getAchievement: () => apiClient.get('/savings/achievement'),
  
  // 자동 절감 생성
  autoGenerate: () => apiClient.post('/savings/auto-generate'),
};

// 머천트 관련 API
export const merchantsAPI = {
  // 머천트 목록 조회
  getAll: () => apiClient.get('/merchants'),
  
  // 머천트 상세 조회
  getById: (id: string) => apiClient.get(`/merchants/${id}`),
  
  // 머천트 생성
  create: (data: any) => apiClient.post('/merchants', data),
  
  // 머천트 수정
  update: (id: string, data: any) => apiClient.put(`/merchants/${id}`, data),
  
  // 머천트 삭제
  delete: (id: string) => apiClient.delete(`/merchants/${id}`),
};
