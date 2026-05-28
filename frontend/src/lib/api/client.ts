const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

// ============ Types ============

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: number;
  cv_id: number;
  company: string;
  position: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  location: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: number;
  cv_id: number;
  institution: string;
  degree: string;
  field_of_study: string | null;
  description: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  grade: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: number;
  cv_id: number;
  name: string;
  category: string | null;
  proficiency: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Language {
  id: number;
  cv_id: number;
  name: string;
  proficiency: "basic" | "intermediate" | "advanced" | "native";
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CVTemplate {
  id: number;
  cv_id: number;
  template_id: number;
  custom_colors: Record<string, string> | null;
  custom_fonts: string[] | null;
  layout_style: string | null;
  created_at: string;
  updated_at: string;
  template?: Template;
}

export interface CV {
  id: number;
  user_id: number;
  title: string;
  full_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  website: string | null;
  linkedin: string | null;
  github: string | null;
  professional_summary: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
  experiences?: Experience[];
  education?: Education[];
  skills?: Skill[];
  languages?: Language[];
  cv_template?: CVTemplate | null;
}

export interface Template {
  id: number;
  name: string;
  description: string | null;
  preview_url: string | null;
  category: string | null;
  is_premium: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ============ Payload Types ============

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface CreateCVPayload {
  title: string;
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  professional_summary?: string;
  photo_url?: string;
}

export type UpdateCVPayload = Partial<CreateCVPayload>;

export interface ExperiencePayload {
  company: string;
  position: string;
  description?: string;
  start_date: string;
  end_date?: string;
  is_current?: boolean;
  location?: string;
  sort_order?: number;
}

export interface EducationPayload {
  institution: string;
  degree: string;
  field_of_study?: string;
  description?: string;
  start_date: string;
  end_date?: string;
  is_current?: boolean;
  grade?: string;
  sort_order?: number;
}

export interface SkillPayload {
  name: string;
  category?: string;
  proficiency?: number;
  sort_order?: number;
}

export interface LanguagePayload {
  name: string;
  proficiency: "basic" | "intermediate" | "advanced" | "native";
  sort_order?: number;
}

export interface AssignTemplatePayload {
  template_id: number;
  custom_colors?: Record<string, string>;
  custom_fonts?: string[];
  layout_style?: string;
}

// AI Payloads
export interface GenerateWithAIPayload {
  title: string;
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  professional_summary?: string;
  photo_url?: string;
  experiences?: Omit<ExperiencePayload, "sort_order">[];
  education?: Omit<EducationPayload, "sort_order">[];
  skills?: Omit<SkillPayload, "sort_order">[];
  languages?: LanguagePayload[];
}

export interface ImproveSectionPayload {
  section: "professional_summary" | "experience_description" | "education_description";
  content: string;
  context?: string;
}

// ============ Response Types ============

export interface AuthResponse {
  user: User;
  token: string;
}

export interface MessageResponse {
  message: string;
}

export interface ImproveSectionResponse {
  message: string;
  improved_content: string;
}

export interface GenerateCVResponse {
  message: string;
  cv: CV;
}

// ============ API Client ============

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Network error" }));
    throw new Error(error.message || error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  // ============ Auth ============
  register: (data: RegisterPayload) =>
    request<AuthResponse>("/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: LoginPayload) =>
    request<AuthResponse>("/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: () =>
    request<MessageResponse>("/logout", {
      method: "POST",
    }),

  user: () => request<User>("/user"),

  // ============ Templates ============
  getTemplates: () => request<Template[]>("/templates"),

  getTemplate: (id: number) => request<Template>(`/templates/${id}`),

  // ============ CVs ============
  getCVs: () => request<CV[]>("/cvs"),

  getCV: (id: number) => request<CV>(`/cvs/${id}`),

  createCV: (data: CreateCVPayload) =>
    request<CV>("/cvs", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateCV: (id: number, data: UpdateCVPayload) =>
    request<CV>(`/cvs/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteCV: (id: number) =>
    request<MessageResponse>(`/cvs/${id}`, {
      method: "DELETE",
    }),

  // ============ AI - Deepseek Integration ============
  generateCVWithAI: (data: GenerateWithAIPayload) =>
    request<GenerateCVResponse>("/cvs/generate-with-ai", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  improveSection: (cvId: number, data: ImproveSectionPayload) =>
    request<ImproveSectionResponse>(`/cvs/${cvId}/improve-section`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // ============ Experiences ============
  storeExperience: (cvId: number, data: ExperiencePayload) =>
    request<Experience>(`/cvs/${cvId}/experiences`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateExperience: (cvId: number, experienceId: number, data: Partial<ExperiencePayload>) =>
    request<Experience>(`/cvs/${cvId}/experiences/${experienceId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteExperience: (cvId: number, experienceId: number) =>
    request<MessageResponse>(`/cvs/${cvId}/experiences/${experienceId}`, {
      method: "DELETE",
    }),

  // ============ Education ============
  storeEducation: (cvId: number, data: EducationPayload) =>
    request<Education>(`/cvs/${cvId}/education`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateEducation: (cvId: number, educationId: number, data: Partial<EducationPayload>) =>
    request<Education>(`/cvs/${cvId}/education/${educationId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteEducation: (cvId: number, educationId: number) =>
    request<MessageResponse>(`/cvs/${cvId}/education/${educationId}`, {
      method: "DELETE",
    }),

  // ============ Skills ============
  storeSkill: (cvId: number, data: SkillPayload) =>
    request<Skill>(`/cvs/${cvId}/skills`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateSkill: (cvId: number, skillId: number, data: Partial<SkillPayload>) =>
    request<Skill>(`/cvs/${cvId}/skills/${skillId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteSkill: (cvId: number, skillId: number) =>
    request<MessageResponse>(`/cvs/${cvId}/skills/${skillId}`, {
      method: "DELETE",
    }),

  // ============ Languages ============
  storeLanguage: (cvId: number, data: LanguagePayload) =>
    request<Language>(`/cvs/${cvId}/languages`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateLanguage: (cvId: number, languageId: number, data: Partial<LanguagePayload>) =>
    request<Language>(`/cvs/${cvId}/languages/${languageId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteLanguage: (cvId: number, languageId: number) =>
    request<MessageResponse>(`/cvs/${cvId}/languages/${languageId}`, {
      method: "DELETE",
    }),

  // ============ Template Assignment ============
  assignTemplate: (cvId: number, data: AssignTemplatePayload) =>
    request<CVTemplate>(`/cvs/${cvId}/template`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
