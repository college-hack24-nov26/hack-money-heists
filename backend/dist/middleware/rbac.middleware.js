"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = requireRole;
exports.requirePermission = requirePermission;
exports.requireTenantIsolation = requireTenantIsolation;
const security_config_1 = require("../security/security.config");
const audit_logger_1 = require("../security/audit-logger");
/**
 * Role-Based Access Control (RBAC) Middleware
 * Verifies that the authenticated user possesses one of the required enterprise roles.
 */
function requireRole(allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication Required', message: 'Valid enterprise session token is required.' });
            return;
        }
        // Super Admin has universal operational clearance
        if (req.user.role === 'Super Admin' || allowedRoles.includes(req.user.role)) {
            return next();
        }
        const clientIp = req.ip || (req.socket && req.socket.remoteAddress) || 'unknown';
        audit_logger_1.auditLogger.log({
            eventType: 'RBAC_ACCESS_DENIED',
            userId: req.user.id,
            userEmail: req.user.email,
            organizationId: req.user.organizationId,
            role: req.user.role,
            ipAddress: clientIp,
            resourcePath: req.originalUrl,
            outcome: 'BLOCKED',
            details: {
                userRole: req.user.role,
                requiredRoles: allowedRoles
            }
        });
        res.status(403).json({
            error: 'Forbidden Operation',
            message: `Role '${req.user.role}' lacks sufficient privileges for this financial operation.`,
            requiredRoles: allowedRoles
        });
    };
}
/**
 * Permission-Based Access Control
 * Maps high-level financial operations to the defined enterprise permission matrix.
 */
function requirePermission(permission) {
    const authorizedRoles = security_config_1.SECURITY_CONFIG.PERMISSIONS[permission];
    return requireRole(authorizedRoles);
}
/**
 * Tenant Isolation Guard (Anti-IDOR)
 * Ensures that a user cannot query, mutate, or download data belonging to another tenant/organization.
 */
function requireTenantIsolation(paramKey = 'organizationId') {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication Required' });
            return;
        }
        // Super Admin can inspect cross-tenant records
        if (req.user.role === 'Super Admin') {
            return next();
        }
        const requestedOrgId = (req.params[paramKey] || req.body[paramKey] || req.query[paramKey] || (req.headers && req.headers['x-tenant-id']));
        if (requestedOrgId && requestedOrgId !== req.user.organizationId) {
            const clientIp = req.ip || (req.socket && req.socket.remoteAddress) || 'unknown';
            audit_logger_1.auditLogger.log({
                eventType: 'CROSS_TENANT_ACCESS_ATTEMPT',
                userId: req.user.id,
                userEmail: req.user.email,
                organizationId: req.user.organizationId,
                ipAddress: clientIp,
                resourcePath: req.originalUrl,
                outcome: 'BLOCKED',
                details: {
                    userOrg: req.user.organizationId,
                    attemptedTargetOrg: requestedOrgId
                }
            });
            res.status(403).json({
                error: 'Tenant Security Violation',
                message: 'Access denied: Cross-company direct object references are strictly prohibited by ARTHIQ Tenant Isolation.'
            });
            return;
        }
        next();
    };
}
