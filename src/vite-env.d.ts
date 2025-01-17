/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BACKEND_BASE_URL: string;
    readonly VITE_CONSULTANT_SIGN_UP_PATH: string;
    readonly VITE_PATIENT_SIGN_UP_PATH: string;
    readonly VITE_APP_USER_LOGIN_PATH: string;
    readonly VITE_GET_USER_PATH: string;
    readonly VITE_GET_MEDICAL_CATEGORIES: string;

}

interface ImportMeta {
    readonly env: ImportMetaEnv
}