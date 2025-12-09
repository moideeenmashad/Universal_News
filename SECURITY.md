# Security Implementation Guide

## 🔒 Security Features Implemented

### 1. **HTTP Security Headers**
Located in: `next.config.ts`

#### Headers Implemented:
- **Strict-Transport-Security (HSTS)**: Forces HTTPS connections
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-Content-Type-Options**: Prevents MIME-type sniffing
- **X-XSS-Protection**: Enables browser XSS protection
- **Content-Security-Policy (CSP)**: Controls resource loading
- **Referrer-Policy**: Controls referrer information
- **Permissions-Policy**: Restricts browser features

### 2. **Bot Protection & Rate Limiting**
Located in: `middleware.ts`

#### Features:
- **Bot Detection**: Identifies and blocks malicious bots
- **Rate Limiting**: 60 requests per minute per IP
- **Legitimate Bot Allowlist**: Allows Google, Bing, etc.
- **Suspicious Pattern Detection**: Blocks XSS and SQL injection attempts
- **Path Traversal Protection**: Prevents directory traversal attacks

### 3. **Input Validation & Sanitization**
Located in: `src/lib/utils/security.ts`

#### Functions:
- `sanitizeInput()`: Removes dangerous characters
- `sanitizeSearchQuery()`: Cleans search inputs
- `hasXSS()`: Detects XSS patterns
- `hasSQLInjection()`: Detects SQL injection
- `escapeHtml()`: Escapes HTML entities
- `isValidUrl()`: Validates URLs
- `isValidCategory()`: Validates route parameters

### 4. **Image Security**
Located in: `next.config.ts`

#### Protections:
- **Restricted Image Sources**: Only allows trusted domains
- **SVG Sandboxing**: Prevents malicious SVG execution
- **Content Disposition**: Forces download for untrusted content

### 5. **API Security**
Located in: `src/lib/api/news.ts`

#### Best Practices:
- API keys stored in environment variables
- Never exposed to client-side code
- Rate limiting on API calls
- Error handling without exposing internals

---

## 🛡️ Security Best Practices

### Environment Variables
```bash
# Never commit .env to Git
# Use .env.example as template
# Store secrets in hosting platform
```

### API Keys
- ✅ Store in `.env` file
- ✅ Use `NEXT_PUBLIC_` prefix only for client-safe values
- ✅ Rotate keys regularly
- ❌ Never hardcode in source code
- ❌ Never commit to Git

### Content Security Policy (CSP)
Current policy allows:
- Scripts from same origin
- Styles from same origin + Google Fonts
- Images from HTTPS sources
- API calls to NewsAPI and NewsData

To add new domains:
1. Update `next.config.ts` CSP header
2. Add to `remotePatterns` for images

### Rate Limiting
Current limits:
- **60 requests/minute** per IP
- Applies to all routes except static files
- Returns `429 Too Many Requests` when exceeded

To adjust:
```typescript
// In middleware.ts
const MAX_REQUESTS_PER_WINDOW = 100; // Increase limit
const RATE_LIMIT_WINDOW = 60 * 1000; // Time window
```

---

## 🚨 Common Attack Vectors & Protections

### 1. Cross-Site Scripting (XSS)
**Protection:**
- CSP headers block inline scripts
- Input sanitization removes `<script>` tags
- HTML escaping in user content
- React's built-in XSS protection

### 2. SQL Injection
**Protection:**
- No direct database queries (using APIs)
- Input validation detects SQL patterns
- Parameterized queries if database added

### 3. Cross-Site Request Forgery (CSRF)
**Protection:**
- SameSite cookies (if implemented)
- Origin validation
- CSRF tokens for forms (if needed)

### 4. Clickjacking
**Protection:**
- `X-Frame-Options: SAMEORIGIN`
- `frame-ancestors 'self'` in CSP

### 5. Man-in-the-Middle (MITM)
**Protection:**
- HSTS forces HTTPS
- Secure cookie flags
- Certificate pinning (production)

### 6. Bot Attacks
**Protection:**
- User-agent detection
- Rate limiting
- robots.txt configuration
- Honeypot fields (can be added)

### 7. DDoS Attacks
**Protection:**
- Rate limiting per IP
- CDN usage (Vercel/Cloudflare)
- Request throttling
- Consider: Cloudflare DDoS protection

---

## 📋 Security Checklist

### Before Deployment:
- [ ] All API keys in environment variables
- [ ] `.env` file in `.gitignore`
- [ ] HTTPS enabled on hosting
- [ ] Security headers verified
- [ ] Rate limiting tested
- [ ] CSP policy tested
- [ ] Error messages don't expose internals
- [ ] Dependencies updated (`npm audit`)
- [ ] robots.txt configured
- [ ] Sitemap.xml created

### Regular Maintenance:
- [ ] Update dependencies monthly
- [ ] Run `npm audit fix` regularly
- [ ] Rotate API keys quarterly
- [ ] Review security logs
- [ ] Monitor rate limit hits
- [ ] Check for new vulnerabilities

---

## 🔧 Testing Security

### Test Rate Limiting:
```bash
# Send 100 requests quickly
for i in {1..100}; do curl http://localhost:3000; done
```

### Test Bot Detection:
```bash
# Should be blocked
curl -A "BadBot/1.0" http://localhost:3000

# Should be allowed
curl -A "Googlebot/2.1" http://localhost:3000
```

### Test XSS Protection:
Try searching for:
```
<script>alert('XSS')</script>
javascript:alert('XSS')
```
Should be sanitized.

### Test SQL Injection:
Try searching for:
```
' OR '1'='1
UNION SELECT * FROM users
```
Should be blocked.

---

## 🚀 Production Recommendations

### 1. Use a CDN
- Cloudflare (DDoS protection)
- Vercel Edge Network
- AWS CloudFront

### 2. Add WAF (Web Application Firewall)
- Cloudflare WAF
- AWS WAF
- Imperva

### 3. Implement Monitoring
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for traffic
- Custom logging for security events

### 4. Add CAPTCHA
For forms/search:
- Google reCAPTCHA v3
- hCaptcha
- Cloudflare Turnstile

### 5. Database Security (if added)
- Use ORMs with parameterized queries
- Encrypt sensitive data
- Regular backups
- Principle of least privilege

### 6. Session Security (if added)
- HttpOnly cookies
- Secure flag in production
- SameSite=Strict
- Short expiration times

---

## 📞 Security Incident Response

If you detect a security issue:

1. **Immediate Actions:**
   - Block the attacking IP
   - Rotate compromised API keys
   - Review logs for extent of breach

2. **Investigation:**
   - Check middleware logs
   - Review rate limit violations
   - Analyze attack patterns

3. **Remediation:**
   - Patch vulnerability
   - Update security rules
   - Deploy fixes

4. **Prevention:**
   - Update this documentation
   - Add new security tests
   - Improve monitoring

---

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Security Headers](https://securityheaders.com/)

---

## ✅ Security Score

Test your deployment:
- https://securityheaders.com/
- https://observatory.mozilla.org/
- https://www.ssllabs.com/ssltest/

Target Score: **A+**
