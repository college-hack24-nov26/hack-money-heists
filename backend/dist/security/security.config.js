"use strict";
/**
 * ARTHIQ Central Enterprise Security Configuration
 * Governs authentication parameters, cryptographic salt iterations, session durations,
 * rate limit policies, and enterprise Role-Based Access Control (RBAC).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECURITY_CONFIG = void 0;
exports.SECURITY_CONFIG = {
    APP_ENV: process.env.NODE_ENV || 'development',
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
    // Cryptographic & Session Parameters
    AUTH: {
        TOKEN_SECRET: process.env.JWT_SECRET || 'arthiq_enterprise_master_key_99384729184719283749182374918273',
        TOKEN_EXPIRATION_HOURS: 24,
        REFRESH_TOKEN_EXPIRATION_DAYS: 7,
        PASSWORD_SALT_ROUNDS: 12,
        MAX_FAILED_LOGIN_ATTEMPTS: 5,
        LOCKOUT_DURATION_MINUTES: 15,
        PASSWORD_REQUIREMENTS: {
            MIN_LENGTH: 8,
            MAX_LENGTH: 64,
            REQUIRE_UPPERCASE: true,
            REQUIRE_LOWERCASE: true,
            REQUIRE_NUMBER: true,
            REQUIRE_SPECIAL: true,
        }
    },
    // Role-Based Access Control (RBAC) Definitions
    ROLES: {
        SUPER_ADMIN: 'Super Admin',
        COMPANY_ADMIN: 'Company Admin',
        FINANCE_MANAGER: 'Finance Manager',
        ACCOUNTANT: 'Accountant',
        EMPLOYEE: 'Employee',
        READ_ONLY_AUDITOR: 'Read-Only Auditor'
    },
    // Permission Matrix
    PERMISSIONS: {
        MANAGE_ORGANIZATION: ['Super Admin', 'Company Admin'],
        MANAGE_USERS: ['Super Admin', 'Company Admin'],
        VIEW_FINANCIALS: ['Super Admin', 'Company Admin', 'Finance Manager', 'Accountant', 'Read-Only Auditor'],
        MANAGE_EXPENSES: ['Super Admin', 'Company Admin', 'Finance Manager', 'Accountant'],
        VERIFY_INVOICES: ['Super Admin', 'Company Admin', 'Finance Manager'],
        RESOLVE_LEAKAGE: ['Super Admin', 'Company Admin', 'Finance Manager'],
        DOWNLOAD_DATASETS: ['Super Admin', 'Company Admin', 'Finance Manager', 'Accountant', 'Read-Only Auditor'],
        TRIGGER_ML_TRAINING: ['Super Admin', 'Company Admin', 'Finance Manager'],
        VIEW_AUDIT_LOGS: ['Super Admin', 'Company Admin', 'Read-Only Auditor']
    },
    // Rate Limiting Rules
    RATE_LIMITS: {
        LOGIN: {
            WINDOW_MS: 60 * 1000, // 1 minute
            MAX_REQUESTS: 5
        },
        API_STANDARD: {
            WINDOW_MS: 60 * 1000,
            MAX_REQUESTS: 120
        },
        FILE_UPLOAD: {
            WINDOW_MS: 60 * 1000,
            MAX_REQUESTS: 15
        },
        ML_TRAINING: {
            WINDOW_MS: 60 * 1000,
            MAX_REQUESTS: 5
        }
    },
    // File Upload Security
    FILE_SECURITY: {
        MAX_SIZE_BYTES: 15 * 1024 * 1024, // 15 MB
        ALLOWED_MIME_TYPES: [
            'application/pdf',
            'text/csv',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
            'image/png',
            'image/jpeg'
        ],
        ALLOWED_EXTENSIONS: ['.pdf', '.csv', '.xlsx', '.xls', '.png', '.jpg', '.jpeg']
    },
    // Trusted Origins for CORS
    ALLOWED_ORIGINS: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:4000',
        'http://127.0.0.1:4000'
    ]
};
