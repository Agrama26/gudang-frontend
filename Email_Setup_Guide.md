# 📧 Email Notification Setup Guide

## Overview
Sistem email notification akan mengirim email otomatis saat:
- ✅ User baru dibuat (Welcome email dengan credentials)
- ✅ Admin mendapat notifikasi tentang user baru
- ✅ User status diubah (Activated/Deactivated)
- ✅ Password reset (Optional - untuk implementasi selanjutnya)

---

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install nodemailer
```

### 2. Create Email Service File

Buat folder dan file baru:
```bash
mkdir -p backend/services
# Copy emailService.js ke backend/services/
```

### 3. Configure Environment Variables

Edit file `backend/.env`:

```env
# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=PT. Medianusa Permana <noreply@medianusapermana.com>

# Email Feature Toggle
ENABLE_EMAIL_NOTIFICATIONS=true

# Application URL
APP_URL=http://localhost:5173
ADMIN_EMAIL=admin@medianusapermana.com
```

---

## 📮 Gmail Setup (Recommended)

### Option 1: Using Gmail with App Password (Most Secure)

1. **Enable 2-Step Verification:**
   - Go to https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Create App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Select app: "Mail"
   - Select device: "Other (Custom name)" → Enter "Warehouse System"
   - Click "Generate"
   - **Copy the 16-character password** (format: xxxx xxxx xxxx xxxx)

3. **Update .env:**
   ```env
   EMAIL_USER=youremail@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # paste app password here
   ```

### Option 2: Using Gmail with Less Secure Apps (Not Recommended)

```env
EMAIL_USER=youremail@gmail.com
EMAIL_PASSWORD=your-gmail-password
```

Then enable "Less secure app access" at:
https://myaccount.google.com/lesssecureapps

⚠️ **Warning:** This method is less secure and may be disabled by Google.

---

## 📮 Alternative Email Providers

### Outlook/Office365

```env
EMAIL_SERVICE=outlook
EMAIL_HOST=smtp.office365.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

### Custom SMTP Server

```env
EMAIL_SERVICE=custom
EMAIL_HOST=mail.yourcompany.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=noreply@yourcompany.com
EMAIL_PASSWORD=your-password
```

### SendGrid

```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
```

### Mailgun

```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=postmaster@yourdomain.mailgun.org
EMAIL_PASSWORD=your-mailgun-smtp-password
```

---

## 🧪 Testing Email System

### 1. Run Test Script

```bash
cd backend
node testEmail.js
```

Expected output:
```
🧪 Testing Email Service...

1️⃣ Testing connection...
Result: { success: true, message: 'Email server connection successful' }

2️⃣ Sending test user created email...
✅ Email sent successfully: <message-id>
Result: { success: true, messageId: '...' }

3️⃣ Sending admin notification...
✅ Email sent successfully: <message-id>
Result: { success: true, messageId: '...' }

✅ Email tests completed!
Check your inbox: your-email@gmail.com
```

### 2. Test from Admin Dashboard

1. Login sebagai admin
2. Go to Admin Panel → Statistics tab
3. Click "🧪 Test Email Connection" button
4. Should show success toast notification

### 3. Test User Creation

1. Login sebagai admin
2. Go to Admin Panel → Users tab
3. Click "Add New User"
4. Fill form dengan email address
5. Check "Send welcome email to new user"
6. Click "Create User"
7. Check email inbox (both user and admin email)

---

## 📧 Email Templates

### Welcome Email Features:
- ✅ Beautiful HTML template
- ✅ Login credentials (username & temporary password)
- ✅ Security warnings
- ✅ Direct login button
- ✅ Role-specific permissions list
- ✅ Company branding

### Admin Notification Features:
- ✅ New user details
- ✅ Created by information
- ✅ Timestamp
- ✅ Quick summary

### Status Change Email:
- ✅ Activation/Deactivation notification
- ✅ Clear status message
- ✅ Action guidance

---

## 🔐 Security Best Practices

1. **Never commit .env file:**
   ```bash
   # Add to .gitignore
   .env
   .env.local
   .env.production
   ```

2. **Use App Passwords:**
   - Always use app-specific passwords
   - Never use main account password

3. **Rotate Credentials:**
   - Change email passwords regularly
   - Revoke old app passwords

4. **Monitor Email Logs:**
   - Check email sending logs regularly
   - Watch for failed deliveries

5. **Rate Limiting:**
   - Implement rate limiting for email sending
   - Prevent abuse and spam

---

## 🐛 Troubleshooting

### Issue: "Error: Invalid login"

**Solution:**
- Check EMAIL_USER and EMAIL_PASSWORD are correct
- For Gmail, use App Password (not regular password)
- Enable "Less secure app access" if not using App Password

### Issue: "Error: Connection timeout"

**Solution:**
- Check EMAIL_HOST and EMAIL_PORT
- Check firewall/network settings
- Try EMAIL_PORT=465 with EMAIL_SECURE=true

### Issue: "Email sent but not received"

**Solution:**
- Check spam/junk folder
- Verify recipient email address
- Check email server logs
- Test with different email provider

### Issue: "Error: self signed certificate"

**Solution:**
Add to email transporter config:
```javascript
tls: {
  rejectUnauthorized: false
}
```

### Issue: "Rate limit exceeded"

**Solution:**
- Gmail: 500 emails/day (free), 2000/day (GSuite)
- Implement email queue system
- Use professional email service (SendGrid, Mailgun)

---

## 📊 Monitoring & Logs

### Email Logs Location:
```
Backend console will show:
✅ Email sent successfully: <message-id>
❌ Error sending email: <error-message>
```

### Database Activity Logs:
All email-related activities are logged in `activity_logs` table:
- USER_CREATED → Email sent
- USER_UPDATED → Email sent (if status changed)

---

## 🚀 Production Deployment

### Recommended for Production:

1. **Use Professional Email Service:**
   - SendGrid (99.5% delivery rate)
   - Mailgun (High deliverability)
   - AWS SES (Cost effective)

2. **Setup Email Queue:**
   - Use Bull/BullMQ for job queues
   - Retry failed emails automatically
   - Handle large email volumes

3. **Monitor Email Metrics:**
   - Delivery rate
   - Open rate
   - Bounce rate
   - Spam reports

4. **Implement Email Templates Manager:**
   - Store templates in database
   - Admin can edit templates
   - Version control for templates

---

## 📝 Configuration Examples

### Development (.env.development)
```env
ENABLE_EMAIL_NOTIFICATIONS=true
EMAIL_SERVICE=gmail
EMAIL_USER=dev-test@gmail.com
EMAIL_PASSWORD=dev-app-password
APP_URL=http://localhost:5173
```

### Production (.env.production)
```env
ENABLE_EMAIL_NOTIFICATIONS=true
EMAIL_SERVICE=custom
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=SG.xxxxxxxx
APP_URL=https://warehouse.medianusapermana.com
ADMIN_EMAIL=admin@medianusapermana.com
```

### Testing (.env.test)
```env
ENABLE_EMAIL_NOTIFICATIONS=false
# Emails disabled in test environment
```

---

## ✅ Checklist

Before going live:

- [ ] Email credentials configured in .env
- [ ] Test email connection successful
- [ ] Welcome email template reviewed
- [ ] Admin notification working
- [ ] Status change emails tested
- [ ] Email logs monitored
- [ ] Spam folder checked
- [ ] Production email service setup (SendGrid/Mailgun)
- [ ] Email rate limits configured
- [ ] Backup email server configured

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review backend console logs
3. Test with `node testEmail.js`
4. Check email provider documentation

---

**Last Updated:** January 2025  
**Version:** 1.0.0