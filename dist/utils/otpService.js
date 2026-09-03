"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOtpEmailTemplate = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
let initialized = false;
function ensureInitialized() {
    if (initialized)
        return;
    const apiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.SENDGRID_FROM_EMAIL;
    if (!apiKey) {
        throw new Error("SENDGRID_API_KEY is not defined");
    }
    if (!fromEmail) {
        throw new Error("SENDGRID_FROM_EMAIL is not defined");
    }
    mail_1.default.setApiKey(apiKey);
    initialized = true;
}
const getOtpEmailTemplate = (otp) => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#f4f4f5; font-family:Arial, Helvetica, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f5; padding:40px 15px;">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:12px;">

          <!-- HEADER -->
          <tr>
            <td align="center" style="background-color:#111827; padding:30px;">
              <h1 style="margin:0; color:#ffffff; font-size:28px;">CircleSpace</h1>
              <p style="margin:8px 0 0; color:#d1d5db; font-size:14px;">Connect. Share. Belong.</p>
            </td>
          </tr>

          <!-- CONTENT -->
          <tr>
            <td align="center" style="padding:40px 30px;">
              <h2 style="margin:0 0 20px; color:#111827; font-size:24px;">Verify Your Email</h2>
              <p style="margin:0; color:#6b7280; font-size:16px; line-height:24px;">
                Use the verification code below to complete your request.
              </p>

              <table cellpadding="0" cellspacing="0" border="0" style="margin:30px auto; background-color:#f3f4f6; border-radius:10px;">
                <tr>
                  <td align="center" style="padding:18px 35px;">
                    <span style="font-size:32px; font-weight:bold; letter-spacing:8px; color:#111827;">
                      ${otp}
                    </span>
                  </td>
                </tr>
              </table>

              <p style="margin:0; color:#6b7280; font-size:14px; line-height:22px;">
                This verification code will expire in <strong>10 minutes</strong>.
              </p>

              <p style="margin:30px 0 0; color:#9ca3af; font-size:13px; line-height:20px;">
                If you didn't request this code, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td align="center" style="border-top:1px solid #e5e7eb; padding:20px;">
              <p style="margin:0; color:#9ca3af; font-size:12px;">
                &copy; ${new Date().getFullYear()} CircleSpace. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `;
};
exports.getOtpEmailTemplate = getOtpEmailTemplate;
const sendOtpToEmail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    ensureInitialized();
    const msg = {
        to: options.email,
        from: "Circle Space <no-reply@em3576.mentoonsmythos.com>",
        subject: "Your CircleSpace Verification Code",
        html: (0, exports.getOtpEmailTemplate)(options.otp),
    };
    try {
        const [response] = yield mail_1.default.send(msg);
        console.log("Email sent successfully:", response.statusCode);
        return response;
    }
    catch (err) {
        console.error("Error while sending email:", (_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.body) !== null && _b !== void 0 ? _b : err.message);
        throw new Error(((_f = (_e = (_d = (_c = err.response) === null || _c === void 0 ? void 0 : _c.body) === null || _d === void 0 ? void 0 : _d.errors) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.message) ||
            err.message ||
            "Failed to send email");
    }
});
exports.default = sendOtpToEmail;
