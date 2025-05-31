import React, { useState } from "react";
import {
  Flex,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Alert,
  AlertIcon,
  FormErrorMessage,
  Text,
  InputGroup,
  InputRightElement,
  Link,
  useToast,
} from "@chakra-ui/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useFormik } from "formik";
import validationSchema from "./signinValidations";
import { fetchLogin } from "../../../api";
import { useAuth } from "../../../contexts/AuthContext";
import { Link as RouterLink, useNavigate } from "react-router-dom";

function Signin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setErrors, setSubmitting, setFieldError }) => {
      console.log("Form submitted with values:", values);
      
      try {
        setSubmitting(true);
        
        // Validate form trước khi gửi
        if (!values.email || !values.password) {
          if (!values.email) {
            setFieldError("email", "Email là bắt buộc");
          }
          if (!values.password) {
            setFieldError("password", "Mật khẩu là bắt buộc");
          }
          return;
        }

        console.log("Calling fetchLogin API...");
        const loginResponse = await fetchLogin({
          email: values.email,
          password: values.password,
        });
        
        console.log("Login response:", loginResponse);
        
        // Gọi login từ AuthContext
        await login(loginResponse);
        
        toast({
          title: "Đăng nhập thành công!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        
        // Chuyển hướng sau khi đăng nhập thành công
        navigate("/profile");
        
      } catch (error) {
        console.error("Login error:", error);
        
        let errorMessage = "Đăng nhập thất bại. Vui lòng thử lại.";
        
        if (error.response) {
          // Lỗi từ server
          const status = error.response.status;
          const data = error.response.data;
          
          switch (status) {
            case 400:
              errorMessage = "Thông tin đăng nhập không hợp lệ.";
              break;
            case 401:
              errorMessage = "Email hoặc mật khẩu không đúng.";
              break;
            case 404:
              errorMessage = "Tài khoản không tồn tại.";
              break;
            case 429:
              errorMessage = "Quá nhiều lần thử. Vui lòng thử lại sau.";
              break;
            case 500:
              errorMessage = "Lỗi server. Vui lòng thử lại sau.";
              break;
            default:
              errorMessage = data?.message || errorMessage;
          }
        } else if (error.request) {
          // Lỗi network
          errorMessage = "Không thể kết nối đến server. Kiểm tra kết nối mạng.";
        }
        
        setErrors({ general: errorMessage });
        
        toast({
          title: "Lỗi đăng nhập",
          description: errorMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div>
      <Flex align="center" width="full" justifyContent="center">
        <Box pt={10} px={4} w="full" maxW="md">
          <Box textAlign="center">
            <Heading>Đăng nhập</Heading>
          </Box>
          <Box my={5}>
            {formik.errors.general && (
              <Alert status="error">
                <AlertIcon />
                {formik.errors.general}
              </Alert>
            )}
          </Box>
          <Box my={5} textAlign="left">
            <form onSubmit={formik.handleSubmit}>
              <FormControl isInvalid={formik.touched.email && formik.errors.email}>
                <FormLabel>
                  Email
                  {formik.touched.email && formik.errors.email && (
                    <Text as="span" color="red.500">
                      *
                    </Text>
                  )}
                </FormLabel>
                <Input
                  name="email"
                  type="email"
                  placeholder="Nhập email của bạn"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  focusBorderColor="teal.500"
                />
                <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
              </FormControl>

              <FormControl mt="4" isInvalid={formik.touched.password && formik.errors.password}>
                <FormLabel>
                  Mật khẩu
                  {formik.touched.password && formik.errors.password && (
                    <Text as="span" color="red.500">
                      *
                    </Text>
                  )}
                </FormLabel>
                <InputGroup>
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    focusBorderColor="teal.500"
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="2rem"
                      w="2rem"
                      p={0}
                      borderRadius="full"
                      bg="gray.200"
                      _hover={{ bg: "gray.300" }}
                      _active={{ bg: "gray.400" }}
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
              </FormControl>

              <Box mt={2} textAlign="right">
                <Link as={RouterLink} to="/forgot-password" color="teal.500">
                  Quên mật khẩu?
                </Link>
              </Box>

              <Button 
                mt="4" 
                width="full" 
                type="submit"
                colorScheme="teal"
                isLoading={formik.isSubmitting}
                loadingText="Đang đăng nhập..."
                disabled={formik.isSubmitting}
              >
                Đăng nhập
              </Button>
            </form>
          </Box>
        </Box>
      </Flex>
    </div>
  );
}

export default Signin;