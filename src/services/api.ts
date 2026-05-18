const BASE_URL = 'https://dev.bhcjobs.com';
const STORAGE_URL = 'https://dev.bhcjobs.com/storage';

export const getIndustryImageUrl = (image: string | null | undefined): string | null =>
  image ? `${STORAGE_URL}/industry-image/${image}` : null;

export const getCompanyImageUrl = (image: string | null | undefined): string | null =>
  image ? `${STORAGE_URL}/company-image/${image}` : null;

export const getJobImageUrl = (image: string | null | undefined): string | null =>
  image ? `${STORAGE_URL}/company-image/${image}` : null;

interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

const request = async <T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
  const url = `${BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error((error as any).message || `HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
};

export const getIndustries = () => request('/api/industry/get');
export const getJobs = () => request('/api/job/get');
export const getCompanies = () => request('/api/company/get');

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
}

export interface VerifyData {
  phone: string;
  otp: string;
}

export interface LoginData {
  phone: string;
  password: string;
}

export const registerJobSeeker = (data: RegisterData) =>
  request('/api/job_seeker/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const verifyPhone = (data: VerifyData) =>
  request('/api/job_seeker/phone_verify', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const loginJobSeeker = (data: LoginData) =>
  request('/api/job_seeker/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
