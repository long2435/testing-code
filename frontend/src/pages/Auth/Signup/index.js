import React, { useState } from "react";
import {
  Flex,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Alert,
  Text,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import validationSchema from "./validations";
import { fetcRegister } from "../../../api"; // Changed to fetcRegister
import { useAuth } from "../../../contexts/AuthContext";

function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordVisibility = () => setShowPassword(!showPassword);
  const handlePasswordConfirmVisibility = () =>
    setShowPasswordConfirm(!showPasswordConfirm);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      passwordConfirm: "",
    },
    validationSchema,
    onSubmit: async (values, { setErrors }) => {
      setIsSubmitting(true);
      try {
        const registerResponse = await fetcRegister({
          email: values.email,
          password: values.password,
        });
        login(registerResponse);
        navigate("/profile");
      } catch (e) {
        setErrors({
          general:
            e.response?.data?.message ||
            "Đăng ký thất bại. Vui lòng thử lại.",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Flex align="center" justifyContent="center" minH="100vh">
      <Box p={10} maxW="md" w="full">
        <Box textAlign="center">
          <Heading>Đăng Ký</Heading>
        </Box>
        {formik.errors.general && (
          <Alert status="error" my={5}>
            {formik.errors.general}
          </Alert>
        )}
        <Box my={5} textAlign="left">
          <form onSubmit={formik.handleSubmit}>
            <FormControl isInvalid={!!formik.errors.email && formik.touched.email}>
              <FormLabel>E-mail</FormLabel>
              <Input
                name="email"
                type="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                isDisabled={isSubmitting}
                placeholder="Nhập email của bạn"
              />
              {formik.touched.email && formik.errors.email && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {formik.errors.email}
                </Text>
              )}
            </FormControl>

            <FormControl
              mt={4}
              isInvalid={!!formik.errors.password && formik.touched.password}
            >
              <FormLabel>Mật khẩu</FormLabel>
              <InputGroup>
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  isDisabled={isSubmitting}
                  placeholder="Nhập mật khẩu"
                />
                <InputRightElement>
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={handlePasswordVisibility}
                    isDisabled={isSubmitting}
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
                  >
                    {showPassword ? "Ẩn" : "Hiển thị"}
                  </Button>
                </InputRightElement>
              </InputGroup>
              {formik.touched.password && formik.errors.password && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {formik.errors.password}
                </Text>
              )}
            </FormControl>

            <FormControl
              mt={4}
              isInvalid={
                !!formik.errors.passwordConfirm && formik.touched.passwordConfirm
              }
            >
              <FormLabel>Xác nhận mật khẩu</FormLabel>
              <InputGroup>
                <Input
                  name="passwordConfirm"
                  type={showPasswordConfirm ? "text" : "password"}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.passwordConfirm}
                  isDisabled={isSubmitting}
                  placeholder="Nhập lại mật khẩu"
                />
                <InputRightElement>
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={handlePasswordConfirmVisibility}
                    isDisabled={isSubmitting}
                    aria-label={
                      showPasswordConfirm ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"
                    }
                  >
                    {showPasswordConfirm ? "Ẩn" : "Hiển thị"}
                  </Button>
                </InputRightElement>
              </InputGroup>
              {formik.touched.passwordConfirm && formik.errors.passwordConfirm && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {formik.errors.passwordConfirm}
                </Text>
              )}
            </FormControl>

            <Button
              mt={6}
              w="full"
              type="submit"
              colorScheme="blue"
              isLoading={isSubmitting}
              isDisabled={isSubmitting}
            >
              Đăng Ký
            </Button>
          </form>
        </Box>
      </Box>
    </Flex>
  );
}

export default Signup;