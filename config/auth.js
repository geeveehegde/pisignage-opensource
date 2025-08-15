// Authentication middleware
export const requireAuth = (req, res, next) => {
    // Check if user is authenticated
    if (req.isAuthenticated()) {
        console.log(`✅ Authenticated request to ${req.method} ${req.path} by user: ${req.user?.email}`);
        return next();
    }
    
    console.log(`❌ Unauthenticated request to ${req.method} ${req.path}`);
    
    // If not authenticated, return 401 Unauthorized
    res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'User not authenticated'
    });
};

// Optional auth middleware (for routes that can work with or without auth)
export const optionalAuth = (req, res, next) => {
    // Always continue, but req.user will be undefined if not authenticated
    next();
};

// Admin auth middleware (for admin-only routes)
export const requireAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user && req.user.role === 'admin') {
        return next();
    }
    
    res.status(403).json({
        success: false,
        message: 'Admin access required',
        error: 'Insufficient permissions'
    });
}; 