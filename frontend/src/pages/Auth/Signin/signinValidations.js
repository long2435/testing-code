// src/pages/Auth/Signup/signupValidations.js
// src/pages/Auth/Signin/signinValidations.js
import * as yup from "yup";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Email là bắt buộc"),
  password: yup
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự.")
    .required("Mật khẩu là bắt buộc"),
});

export default validationSchema;

