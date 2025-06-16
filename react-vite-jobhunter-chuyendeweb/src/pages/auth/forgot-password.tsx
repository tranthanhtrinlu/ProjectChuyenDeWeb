import { Button, Divider, Form, Input, message, notification } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { callForgotPassword, callResetPassword } from 'config/api';
import styles from 'styles/auth.module.scss';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);
    const [step, setStep] = useState(1); // 1: Enter email, 2: Enter code and new password

    const validatePassword = (password: string) => {
        const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
        return passwordRegex.test(password);
    };

    const onFinishEmail = async (values: any) => {
        const { email } = values;
        setIsSubmit(true);
        try {
            await callForgotPassword(email);
            setIsSubmit(false);
            setStep(2);
            message.success('Mã xác nhận đã được gửi đến email của bạn!');
        } catch (err) {
            setIsSubmit(false);
            notification.error({
                message: "Có lỗi xảy ra",
                description: "Email không tồn tại",
                duration: 5
            });
        }
    };

    const onFinishReset = async (values: any) => {
        const { resetCode, password, confirmPassword } = values;
        if (!validatePassword(password)) {
            notification.error({
                message: "Mật khẩu không hợp lệ",
                description: "Mật khẩu phải có ít nhất 8 ký tự, chứa ít nhất một chữ số và một ký tự đặc biệt",
                duration: 5
            });
            return;
        }
        if (password !== confirmPassword) {
            notification.error({
                message: "Mật khẩu không khớp",
                description: "Mật khẩu xác nhận không khớp với mật khẩu mới",
                duration: 5
            });
            return;
        }
        setIsSubmit(true);
        try {
            await callResetPassword(resetCode, password);
            setIsSubmit(false);
            message.success('Đặt lại mật khẩu thành công!');
            navigate('/login');
        } catch (err) {
            setIsSubmit(false);
            notification.error({
                message: "Có lỗi xảy ra",
                description: "Mã xác nhận không hợp lệ",
                duration: 5
            });
        }
    };

    return (
        <div className={styles["login-page"]}>
            <main className={styles.main}>
                <div className={styles.container}>
                    <section className={styles.wrapper}>
                        <div className={styles.heading}>
                            <h2 className={`${styles.text} ${styles["text-large"]}`}>
                                {step === 1 ? 'Quên Mật Khẩu' : 'Đặt Lại Mật Khẩu'}
                            </h2>
                            <Divider />
                        </div>
                        {step === 1 ? (
                            <Form
                                name="forgot-password"
                                onFinish={onFinishEmail}
                                autoComplete="off"
                            >
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Email"
                                    name="email"
                                    rules={[{ required: true, message: 'Email không được để trống!' }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={isSubmit}>
                                        Gửi Mã Xác Nhận
                                    </Button>
                                </Form.Item>
                                <p className="text text-normal">
                                    <Link to='/login'>Quay lại đăng nhập</Link>
                                </p>
                            </Form>
                        ) : (
                            <Form
                                name="reset-password"
                                onFinish={onFinishReset}
                                autoComplete="off"
                            >
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Mã Xác Nhận"
                                    name="resetCode"
                                    rules={[{ required: true, message: 'Mã xác nhận không được để trống!' }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Mật Khẩu Mới"
                                    name="password"
                                    rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                                >
                                    <Input.Password />
                                </Form.Item>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Xác Nhận Mật Khẩu"
                                    name="confirmPassword"
                                    rules={[{ required: true, message: 'Xác nhận mật khẩu không được để trống!' }]}
                                >
                                    <Input.Password />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={isSubmit}>
                                        Đặt Lại Mật Khẩu
                                    </Button>
                                </Form.Item>
                                <p className="text text-normal">
                                    <Link to='/login'>Quay lại đăng nhập</Link>
                                </p>
                            </Form>
                        )}
                    </section>
                </div>
            </main>
        </div>
    )
}

export default ForgotPasswordPage;