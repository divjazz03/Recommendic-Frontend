/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BACKEND_BASE_URL: string;
    readonly VITE_APP_USER_LOGIN: string;
    readonly VITE_GET_USER_PATH: string;
    readonly VITE_GET_MEDICAL_CATEGORIES: string;
    readonly VITE_RETRY_EMAIL:string
    
    readonly VITE_PATIENT_SIGN_UP: string;
    readonly VITE_PATIENT_GET_ALL: string
    readonly VITE_PATIENT_DELETE: string
    readonly VITE_PATIENT_ONBOARDING: string

    readonly VITE_CONSULTANT_SIGN_UP: string
    readonly VITE_CONSULTANT_GET_ALL: string
    readonly VITE_CONSULTANT_DELETE: string
    readonly VITE_CONSULTANT_ONBOARDING: string

    readonly VITE_ADMIN_CREATE: string
    readonly VITE_ADMIN_GET_ALL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}