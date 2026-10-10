export const generateTemplate = (otp) =>
  `<!-- activation-email.html -->
<!doctype html>
<html lang="ar">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>تفعيل الحساب</title>
</head>
<body style="margin:0;padding:0;background:#f2f4f6;">
  <!-- wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center" style="padding:30px 10px;">
        <!-- main card -->
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;">
          
          <!-- header -->
          <tr>
            <td style="padding:24px 24px 8px;text-align:center;background:#0b74de;">
              <h1 style="margin:0;color:#ffffff;font-family:Arial, sans-serif;font-size:22px;font-weight:600;">
                مرحباً بـ {{name}} 👋
              </h1>
            </td>
          </tr>

          <!-- body -->
          <tr>
            <td style="padding:28px 30px 20px;font-family:Arial, sans-serif;color:#333333;font-size:16px;line-height:1.45;">
              <p style="margin:0 0 14px;">
                شكراً لتسجيلك في <strong>[اسم الخدمة]</strong> — فقط خطوة واحدة لتفعيل حسابك.
              </p>

              <p style="margin:0 0 20px;">
                لتفعيل حسابك اضغط على الزر أدناه. الرابط صالح لمدة 24 ساعة (يمكنك ضبط المهلة عند توليد الرابط).
              </p>

              <!-- CTA button -->
              <table cellpadding="0" cellspacing="0" role="presentation" style="margin:0 auto 20px;">
                <tr>
                  <td align="center" bgcolor="#1a73e8" style="border-radius:6px;">
                    <a href="{{activation_link}}"
                       target="_blank"
                       style="display:inline-block;padding:12px 22px;font-family:Arial, sans-serif;color:#ffffff;text-decoration:none;font-size:16px;font-weight:600;">
                 ${otp}
                 
                       </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 12px;font-size:14px;color:#666666;">
                إن لم يعمل الزر، انسخ الرابط التالي والصقه في متصفحك:
              </p>
              <p style="word-break:break-all;margin:0 0 18px;font-size:13px;color:#0066cc;">
                <a href="{{activation_link}}" target="_blank" style="color:#0066cc;text-decoration:none;">{{activation_link}}</a>
              </p>

              <p style="margin:0;font-size:13px;color:#666666;">
                إن لم تطلب هذا التسجيل، تجاهل هذه الرسالة وسيتم تجاهل الرابط تلقائياً.
              </p>
            </td>
          </tr>

          <!-- footer -->
          <tr>
            <td style="padding:18px 30px 30px;background:#f7f9fb;font-family:Arial, sans-serif;color:#888888;font-size:13px;">
              <p style="margin:0 0 8px;">تحياتنا — فريق <strong>[اسم الخدمة]</strong></p>
              <p style="margin:0;">هل تحتاج مساعدة؟ راسلنا على <a href="mailto:support@example.com" style="color:#0066cc;text-decoration:none;">support@example.com</a></p>
            </td>
          </tr>

        </table>
        <!-- end main card -->

        <!-- small footer note -->
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;margin-top:12px;">
          <tr>
            <td style="text-align:center;font-family:Arial, sans-serif;color:#aaaaaa;font-size:12px;">
              هذه الرسالة مرسلة تلقائياً. لا ترد على هذا الإيميل.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`