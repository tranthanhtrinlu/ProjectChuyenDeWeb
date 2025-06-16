// import { Button, Divider, Form, Input, Row, Select, message, notification } from 'antd';
// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { callRegister } from 'config/api';
// import styles from 'styles/auth.module.scss';
// import { IUser } from '@/types/backend';
// const { Option } = Select;


// const RegisterPage = () => {
//     const navigate = useNavigate();
//     const [isSubmit, setIsSubmit] = useState(false);

//     const onFinish = async (values: IUser) => {
//         const { name, email, password, age, gender, address } = values;
//         setIsSubmit(true);
//         const res = await callRegister(name, email, password as string, +age, gender, address);
//         setIsSubmit(false);
//         if (res?.data?.id) {
//             message.success('Đăng ký tài khoản thành công!');
//             navigate('/login')
//         } else {
//             notification.error({
//                 message: "Có lỗi xảy ra",
//                 description:
//                     res.message && Array.isArray(res.message) ? res.message[0] : res.message,
//                 duration: 5
//             })
//         }
//     };


//     return (
//         <div className={styles["register-page"]} >

//             <main className={styles.main} >
//                 <div className={styles.container} >
//                     <section className={styles.wrapper} >
//                         <div className={styles.heading} >
//                             <h2 className={`${styles.text} ${styles["text-large"]}`}> Đăng Ký Tài Khoản </h2>
//                             < Divider />
//                         </div>
//                         < Form<IUser>
//                             name="basic"
//                             // style={{ maxWidth: 600, margin: '0 auto' }}
//                             onFinish={onFinish}
//                             autoComplete="off"
//                         >
//                             <Form.Item
//                                 labelCol={{ span: 24 }} //whole column
//                                 label="Họ tên"
//                                 name="name"
//                                 rules={[{ required: true, message: 'Họ tên không được để trống!' }]}
//                             >
//                                 <Input />
//                             </Form.Item>


//                             <Form.Item
//                                 labelCol={{ span: 24 }
//                                 } //whole column
//                                 label="Email"
//                                 name="email"
//                                 rules={[{ required: true, message: 'Email không được để trống!' }]}
//                             >
//                                 <Input type='email' />
//                             </Form.Item>

//                             <Form.Item
//                                 labelCol={{ span: 24 }} //whole column
//                                 label="Mật khẩu"
//                                 name="password"
//                                 rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
//                             >
//                                 <Input.Password />
//                             </Form.Item>
//                             <Form.Item
//                                 labelCol={{ span: 24 }} //whole column
//                                 label="Tuổi"
//                                 name="age"
//                                 rules={[{ required: true, message: 'Tuổi không được để trống!' }]}
//                             >
//                                 <Input type='number' />
//                             </Form.Item>


//                             <Form.Item
//                                 labelCol={{ span: 24 }} //whole column
//                                 name="gender"
//                                 label="Giới tính"
//                                 rules={[{ required: true, message: 'Giới tính không được để trống!' }]}
//                             >
//                                 <Select
//                                     // placeholder="Select a option and change input text above"
//                                     // onChange={onGenderChange}
//                                     allowClear
//                                 >
//                                     <Option value="MALE">Nam</Option>
//                                     <Option value="FEMALE">Nữ</Option>
//                                     <Option value="OTHER">Khác</Option>
//                                 </Select>
//                             </Form.Item>


//                             <Form.Item
//                                 labelCol={{ span: 24 }} //whole column
//                                 label="Địa chỉ"
//                                 name="address"
//                                 rules={[{ required: true, message: 'Địa chỉ không được để trống!' }]}
//                             >
//                                 <Input />
//                             </Form.Item>

//                             < Form.Item
//                             // wrapperCol={{ offset: 6, span: 16 }}
//                             >
//                                 <Button type="primary" htmlType="submit" loading={isSubmit} >
//                                     Đăng ký
//                                 </Button>
//                             </Form.Item>
//                             <Divider> Or </Divider>
//                             <p className="text text-normal" > Đã có tài khoản ?
//                                 <span>
//                                     <Link to='/login' > Đăng Nhập </Link>
//                                 </span>
//                             </p>
//                         </Form>
//                     </section>
//                 </div>
//             </main>
//         </div>
//     )
// }

// export default RegisterPage;
import { Button, Divider, Form, Input, Row, Select, message, notification } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { callRegister } from 'config/api';
import styles from 'styles/auth.module.scss';
import { IUser } from '@/types/backend';
const { Option } = Select;

const RegisterPage = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);

    const validatePassword = (password: string) => {
        const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
        console.log("Validating password:", password, "Result:", passwordRegex.test(password)); // Thêm log
        return passwordRegex.test(password);
    };

    const onFinish = async (values: any) => {
        const { name, email, password, age, gender, address, confirmPassword } = values;
        console.log("Form values:", { name, email, password, age, gender, address, confirmPassword }); // Thêm log
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
        const res = await callRegister(name, email, password, +age, gender, address);
        setIsSubmit(false);
        if (res?.data?.id) {
            message.success('Đăng ký tài khoản thành công!');
            navigate('/login');
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            });
        }
    };

    return (
        <div className={styles["register-page"]}>
            <main className={styles.main}>
                <div className={styles.container}>
                    <section className={styles.wrapper}>
                        <div className={styles.heading}>
                            <h2 className={`${styles.text} ${styles["text-large"]}`}>Đăng Ký Tài Khoản</h2>
                            <Divider />
                        </div>
                        <Form<IUser>
                            name="basic"
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Họ tên"
                                name="name"
                                rules={[{ required: true, message: 'Họ tên không được để trống!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Email"
                                name="email"
                                rules={[{ required: true, message: 'Email không được để trống!' }]}
                            >
                                <Input type='email' />
                            </Form.Item>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Mật khẩu"
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
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Tuổi"
                                name="age"
                                rules={[{ required: true, message: 'Tuổi không được để trống!' }]}
                            >
                                <Input type='number' />
                            </Form.Item>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                name="gender"
                                label="Giới tính"
                                rules={[{ required: true, message: 'Giới tính không được để trống!' }]}
                            >
                                <Select
                                    allowClear
                                >
                                    <Option value="MALE">Nam</Option>
                                    <Option value="FEMALE">Nữ</Option>
                                    <Option value="OTHER">Khác</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Địa chỉ"
                                name="address"
                                rules={[{ required: true, message: 'Địa chỉ không được để trống!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={isSubmit}>
                                    Đăng ký
                                </Button>
                            </Form.Item>
                            <Divider>Or</Divider>
                            <p className="text text-normal">Đã có tài khoản?
                                <span>
                                    <Link to='/login'>Đăng Nhập</Link>
                                </span>
                            </p>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default RegisterPage;