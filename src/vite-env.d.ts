/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BACKEND_BASE_URL: string;
    readonly VITE_APP_USER_LOGIN: string;
    readonly VITE_APP_USER_LOGOUT: string;
    readonly VITE_CURRENT_AUTH_USER: string;

    readonly VITE_EMAIL_CONFIRMATION: string;

    readonly VITE_GET_USER_PATH: string;
    readonly VITE_GET_MEDICAL_CATEGORIES: string;
    readonly VITE_RETRY_EMAIL:string;
    readonly VITE_GET_ARTICLES: string;
    
    readonly VITE_PATIENT_BASE: string;

    readonly VITE_CONSULTANT_BASE: string;

    readonly VITE_ADMIN_BASE: string;

    readonly VITE_SCHEDULE_BASE: string;
    readonly VITE_CONSULTATION_BASE:string;

    readonly VITE_NOTIFICATION_BASE:string;

    readonly VITE_APPOINTMENT_BASE:string;
    readonly VITE_DASHBOARD_BASE:string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}