// import { Button, Col, Form, Modal, Row, Select, Table, Tabs, message, notification } from "antd";
// import { isMobile } from "react-device-detect";
// import type { TabsProps } from 'antd';
// import { IResume, ISubscribers } from "@/types/backend";
// import { useState, useEffect } from 'react';
// import { callCreateSubscriber, callFetchAllSkill, callFetchResumeByUser, callGetSubscriberSkills, callUpdateSubscriber } from "@/config/api";
// import type { ColumnsType } from 'antd/es/table';
// import dayjs from 'dayjs';
// import { MonitorOutlined } from "@ant-design/icons";
// import { SKILLS_LIST } from "@/config/utils";
// import { useAppSelector } from "@/redux/hooks";

// interface IProps {
//     open: boolean;
//     onClose: (v: boolean) => void;
// }

// const UserResume = (props: any) => {
//     const [listCV, setListCV] = useState<IResume[]>([]);
//     const [isFetching, setIsFetching] = useState<boolean>(false);

//     useEffect(() => {
//         const init = async () => {
//             setIsFetching(true);
//             const res = await callFetchResumeByUser();
//             if (res && res.data) {
//                 setListCV(res.data.result as IResume[])
//             }
//             setIsFetching(false);
//         }
//         init();
//     }, [])

//     const columns: ColumnsType<IResume> = [
//         {
//             title: 'STT',
//             key: 'index',
//             width: 50,
//             align: "center",
//             render: (text, record, index) => {
//                 return (
//                     <>
//                         {(index + 1)}
//                     </>)
//             }
//         },
//         {
//             title: 'Công Ty',
//             dataIndex: "companyName",

//         },
//         {
//             title: 'Job title',
//             dataIndex: ["job", "name"],

//         },
//         {
//             title: 'Trạng thái',
//             dataIndex: "status",
//         },
//         {
//             title: 'Ngày rải CV',
//             dataIndex: "createdAt",
//             render(value, record, index) {
//                 return (
//                     <>{dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss')}</>
//                 )
//             },
//         },
//         {
//             title: '',
//             dataIndex: "",
//             render(value, record, index) {
//                 return (
//                     <a
//                         href={`${import.meta.env.VITE_BACKEND_URL}/storage/resume/${record?.url}`}
//                         target="_blank"
//                     >Chi tiết</a>
//                 )
//             },
//         },
//     ];

//     return (
//         <div>
//             <Table<IResume>
//                 columns={columns}
//                 dataSource={listCV}
//                 loading={isFetching}
//                 pagination={false}
//             />
//         </div>
//     )
// }

// const UserUpdateInfo = (props: any) => {
//     return (
//         <div>
//             //todo
//         </div>
//     )
// }

// const JobByEmail = (props: any) => {
//     const [form] = Form.useForm();
//     const user = useAppSelector(state => state.account.user);
//     const [optionsSkills, setOptionsSkills] = useState<{
//         label: string;
//         value: string;
//     }[]>([]);

//     const [subscriber, setSubscriber] = useState<ISubscribers | null>(null);

//     useEffect(() => {
//         const init = async () => {
//             await fetchSkill();
//             const res = await callGetSubscriberSkills();
//             if (res && res.data) {
//                 setSubscriber(res.data);
//                 const d = res.data.skills;
//                 const arr = d.map((item: any) => {
//                     return {
//                         label: item.name as string,
//                         value: item.id + "" as string
//                     }
//                 });
//                 form.setFieldValue("skills", arr);
//             }
//         }
//         init();
//     }, [])

//     const fetchSkill = async () => {
//         let query = `page=1&size=100&sort=createdAt,desc`;

//         const res = await callFetchAllSkill(query);
//         if (res && res.data) {
//             const arr = res?.data?.result?.map(item => {
//                 return {
//                     label: item.name as string,
//                     value: item.id + "" as string
//                 }
//             }) ?? [];
//             setOptionsSkills(arr);
//         }
//     }

//     const onFinish = async (values: any) => {
//         const { skills } = values;

//         const arr = skills?.map((item: any) => {
//             if (item?.id) return { id: item.id };
//             return { id: item }
//         });

//         if (!subscriber?.id) {
//             //create subscriber
//             const data = {
//                 email: user.email,
//                 name: user.name,
//                 skills: arr
//             }

//             const res = await callCreateSubscriber(data);
//             if (res.data) {
//                 message.success("Cập nhật thông tin thành công");
//                 setSubscriber(res.data);
//             } else {
//                 notification.error({
//                     message: 'Có lỗi xảy ra',
//                     description: res.message
//                 });
//             }


//         } else {
//             //update subscriber
//             const res = await callUpdateSubscriber({
//                 id: subscriber?.id,
//                 skills: arr
//             });
//             if (res.data) {
//                 message.success("Cập nhật thông tin thành công");
//                 setSubscriber(res.data);
//             } else {
//                 notification.error({
//                     message: 'Có lỗi xảy ra',
//                     description: res.message
//                 });
//             }
//         }


//     }

//     return (
//         <>
//             <Form
//                 onFinish={onFinish}
//                 form={form}
//             >
//                 <Row gutter={[20, 20]}>
//                     <Col span={24}>
//                         <Form.Item
//                             label={"Kỹ năng"}
//                             name={"skills"}
//                             rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 skill!' }]}

//                         >
//                             <Select
//                                 mode="multiple"
//                                 allowClear
//                                 suffixIcon={null}
//                                 style={{ width: '100%' }}
//                                 placeholder={
//                                     <>
//                                         <MonitorOutlined /> Tìm theo kỹ năng...
//                                     </>
//                                 }
//                                 optionLabelProp="label"
//                                 options={optionsSkills}
//                             />
//                         </Form.Item>
//                     </Col>
//                     <Col span={24}>
//                         <Button onClick={() => form.submit()}>Cập nhật</Button>
//                     </Col>
//                 </Row>
//             </Form>
//         </>
//     )
// }

// const ManageAccount = (props: IProps) => {
//     const { open, onClose } = props;

//     const onChange = (key: string) => {
//         // console.log(key);
//     };

//     const items: TabsProps['items'] = [
//         {
//             key: 'user-resume',
//             label: `Rải CV`,
//             children: <UserResume />,
//         },
//         {
//             key: 'email-by-skills',
//             label: `Nhận Jobs qua Email`,
//             children: <JobByEmail />,
//         },
//         {
//             key: 'user-update-info',
//             label: `Cập nhật thông tin`,
//             children: <UserUpdateInfo />,
//         },
//         {
//             key: 'user-password',
//             label: `Thay đổi mật khẩu`,
//             children: `//todo`,
//         },
//     ];


//     return (
//         <>
//             <Modal
//                 title="Quản lý tài khoản"
//                 open={open}
//                 onCancel={() => onClose(false)}
//                 maskClosable={false}
//                 footer={null}
//                 destroyOnClose={true}
//                 width={isMobile ? "100%" : "1000px"}
//             >

//                 <div style={{ minHeight: 400 }}>
//                     <Tabs
//                         defaultActiveKey="user-resume"
//                         items={items}
//                         onChange={onChange}
//                     />
//                 </div>

//             </Modal>
//         </>
//     )
// }

// export default ManageAccount;

// import { Button, Col, Form, Input, Modal, Row, Select, Table, Tabs, message, notification } from "antd";
// import { isMobile } from "react-device-detect";
// import type { TabsProps } from 'antd';
// import { IBackendRes, IResume, ISubscribers } from "@/types/backend"; // Import IBackendRes
// import { useState, useEffect } from 'react';
// import { callCreateSubscriber, callFetchAllSkill, callFetchResumeByUser, callGetSubscriberSkills, callUpdateSubscriber, callSendEmail, callForgotPassword, callResetPassword } from "@/config/api";
// import type { ColumnsType } from 'antd/es/table';
// import dayjs from 'dayjs';
// import { MonitorOutlined } from "@ant-design/icons";
// import { SKILLS_LIST } from "@/config/utils";
// import { useAppSelector } from "@/redux/hooks";

// interface IProps {
//     open: boolean;
//     onClose: (v: boolean) => void;
// }

// const UserResume = (props: any) => {
//     const [listCV, setListCV] = useState<IResume[]>([]);
//     const [isFetching, setIsFetching] = useState<boolean>(false);

//     useEffect(() => {
//         const init = async () => {
//             setIsFetching(true);
//             const res = await callFetchResumeByUser();
//             if (res && res.data) {
//                 setListCV(res.data.result as IResume[])
//             }
//             setIsFetching(false);
//         }
//         init();
//     }, [])

//     const columns: ColumnsType<IResume> = [
//         {
//             title: 'STT',
//             key: 'index',
//             width: 50,
//             align: "center",
//             render: (text, record, index) => {
//                 return (
//                     <>
//                         {(index + 1)}
//                     </>)
//             }
//         },
//         {
//             title: 'Công Ty',
//             dataIndex: "companyName",
//         },
//         {
//             title: 'Job title',
//             dataIndex: ["job", "name"],
//         },
//         {
//             title: 'Trạng thái',
//             dataIndex: "status",
//         },
//         {
//             title: 'Ngày rải CV',
//             dataIndex: "createdAt",
//             render(value, record, index) {
//                 return (
//                     <>{dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss')}</>
//                 )
//             },
//         },
//         {
//             title: '',
//             dataIndex: "",
//             render(value, record, index) {
//                 return (
//                     <a
//                         href={`${import.meta.env.VITE_BACKEND_URL}/storage/resume/${record?.url}`}
//                         target="_blank"
//                     >Chi tiết</a>
//                 )
//             },
//         },
//     ];

//     return (
//         <div>
//             <Table<IResume>
//                 columns={columns}
//                 dataSource={listCV}
//                 loading={isFetching}
//                 pagination={false}
//             />
//         </div>
//     )
// }

// const UserUpdateInfo = (props: any) => {
//     return (
//         <div>
//             //todo
//         </div>
//     )
// }

// const JobByEmail = (props: any) => {
//     const [form] = Form.useForm();
//     const user = useAppSelector(state => state.account.user);
//     const [optionsSkills, setOptionsSkills] = useState<{
//         label: string;
//         value: string;
//     }[]>([]);

//     const [subscriber, setSubscriber] = useState<ISubscribers | null>(null);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         const init = async () => {
//             await fetchSkill();
//             const res = await callGetSubscriberSkills();
//             if (res && res.data) {
//                 setSubscriber(res.data);
//                 const d = res.data.skills;
//                 const arr = d.map((item: any) => {
//                     return {
//                         label: item.name as string,
//                         value: item.id + "" as string
//                     }
//                 });
//                 form.setFieldValue("skills", arr);
//             }
//         }
//         init();
//     }, [])

//     const fetchSkill = async () => {
//         let query = `page=1&size=100&sort=createdAt,desc`;

//         const res = await callFetchAllSkill(query);
//         if (res && res.data) {
//             const arr = res?.data?.result?.map(item => {
//                 return {
//                     label: item.name as string,
//                     value: item.id + "" as string
//                 }
//             }) ?? [];
//             setOptionsSkills(arr);
//         }
//     }

//     const onFinish = async (values: any) => {
//         const { skills } = values;
//         setLoading(true);

//         try {
//             const arr = skills?.map((item: any) => {
//                 if (item?.id) return { id: item.id };
//                 return { id: item }
//             });

//             let subscriberResult = null;

//             if (!subscriber?.id) {
//                 //create subscriber
//                 const data = {
//                     email: user.email,
//                     name: user.name,
//                     skills: arr
//                 }

//                 const res = await callCreateSubscriber(data);
//                 if (res.data) {
//                     subscriberResult = res.data;
//                     setSubscriber(res.data);
//                 } else {
//                     notification.error({
//                         message: 'Có lỗi xảy ra',
//                         description: res.message
//                     });
//                     return;
//                 }
//             } else {
//                 //update subscriber
//                 const res = await callUpdateSubscriber({
//                     id: subscriber?.id,
//                     skills: arr
//                 });
//                 if (res.data) {
//                     subscriberResult = res.data;
//                     setSubscriber(res.data);
//                 } else {
//                     notification.error({
//                         message: 'Có lỗi xảy ra',
//                         description: res.message
//                     });
//                     return;
//                 }
//             }

//             // Gửi email sau khi cập nhật thành công
//             if (subscriberResult) {
//                 const emailRes = await callSendEmail();
//                 if (emailRes) {
//                     message.success("Cập nhật thông tin thành công!");
//                 } else {
//                     message.warning("Cập nhật thông tin thành công nhưng có lỗi xảy ra");
//                 }
//             }

//         } catch (error) {
//             console.error('Error:', error);
//             notification.error({
//                 message: 'Có lỗi xảy ra',
//                 description: 'Vui lòng thử lại sau'
//             });
//         } finally {
//             setLoading(false);
//         }
//     }

//     return (
//         <>
//             <Form
//                 onFinish={onFinish}
//                 form={form}
//             >
//                 <Row gutter={[20, 20]}>
//                     <Col span={24}>
//                         <Form.Item
//                             label={"Kỹ năng"}
//                             name={"skills"}
//                             rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 skill!' }]}
//                         >
//                             <Select
//                                 mode="multiple"
//                                 allowClear
//                                 suffixIcon={null}
//                                 style={{ width: '100%' }}
//                                 placeholder={
//                                     <>
//                                         <MonitorOutlined /> Tìm theo kỹ năng...
//                                     </>
//                                 }
//                                 optionLabelProp="label"
//                                 options={optionsSkills}
//                             />
//                         </Form.Item>
//                     </Col>
//                     <Col span={24}>
//                         <Button 
//                             onClick={() => form.submit()}
//                             loading={loading}
//                             type="primary"
//                         >
//                             {loading ? 'Đang xử lý...' : 'Cập nhật'}
//                         </Button>
//                     </Col>
//                 </Row>
//             </Form>
//         </>
//     )
// }

// const UserChangePassword = () => {
//     const [form] = Form.useForm();
//     const user = useAppSelector(state => state.account.user);
//     const [loading, setLoading] = useState(false);
//     const [step, setStep] = useState(1); // 1: Gửi mã, 2: Nhập mã và mật khẩu

//     const onFinishStep1 = async (values: any) => {
//         const { email } = values;
//         setLoading(true);
//         try {
//             console.log("Sending forgot password request for email:", email); // Debug log
//             const res = await callForgotPassword(email) as IBackendRes<any>;
//             console.log("Full response from callForgotPassword:", JSON.stringify(res, null, 2)); // Log chi tiết
//             if (res && res.status === 200) {
//                 message.success("Mã xác nhận đã được gửi đến email của bạn!");
//                 setStep(2);
//             } else {
//                 notification.error({
//                     message: 'Có lỗi xảy ra',
//                     description: res.error || res.message || 'Không thể gửi mã xác nhận. Trạng thái: ' + (res.status || 'Không xác định')
//                 });
//             }
//         } catch (error: any) { // Ép kiểu error thành any để truy cập message
//             console.error('Error sending reset code:', error);
//             notification.error({
//                 message: 'Có lỗi xảy ra',
//                 description: 'Vui lòng thử lại sau. Chi tiết: ' + (error.message || 'Không xác định')
//             });
//         } finally {
//             setLoading(false);
//         }
//     };

//     const onFinishStep2 = async (values: any) => {
//         const { resetCode, newPassword, confirmPassword } = values;
//         if (newPassword !== confirmPassword) {
//             notification.error({
//                 message: 'Có lỗi xảy ra',
//                 description: 'Mật khẩu mới và xác nhận mật khẩu không khớp!'
//             });
//             return;
//         }
//         setLoading(true);
//         try {
//             console.log("Sending reset password request with resetCode:", resetCode); // Debug log
//             const res = await callResetPassword(resetCode, newPassword) as IBackendRes<any>;
//             console.log("Response from callResetPassword:", res); // Debug log
//             if (res && res.status === 200) {
//                 message.success("Đổi mật khẩu thành công!");
//                 form.resetFields();
//                 setStep(1); // Quay lại bước 1 sau khi thành công
//             } else {
//                 notification.error({
//                     message: 'Có lỗi xảy ra',
//                     description: res.error || res.message || 'Mã xác nhận không hợp lệ'
//                 });
//             }
//         } catch (error: any) { // Ép kiểu error thành any
//             console.error('Error resetting password:', error);
//             notification.error({
//                 message: 'Có lỗi xảy ra',
//                 description: 'Vui lòng thử lại sau. Chi tiết: ' + (error.message || 'Không xác định')
//             });
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Form
//             form={form}
//             layout="vertical"
//             onFinish={step === 1 ? onFinishStep1 : onFinishStep2}
//         >
//             {step === 1 && (
//                 <Row gutter={[20, 20]}>
//                     <Col span={24}>
//                         <Form.Item
//                             label="Email"
//                             name="email"
//                             initialValue={user?.email}
//                             rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
//                         >
//                             <Input placeholder="Nhập email" disabled />
//                         </Form.Item>
//                     </Col>
//                     <Col span={24}>
//                         <Button 
//                             type="primary"
//                             htmlType="submit"
//                             loading={loading}
//                         >
//                             {loading ? 'Đang gửi...' : 'Gửi mã xác nhận'}
//                         </Button>
//                     </Col>
//                 </Row>
//             )}
//             {step === 2 && (
//                 <Row gutter={[20, 20]}>
//                     <Col span={24}>
//                         <Form.Item
//                             label="Mã xác nhận"
//                             name="resetCode"
//                             rules={[{ required: true, message: 'Vui lòng nhập mã xác nhận!' }]}
//                         >
//                             <Input placeholder="Nhập mã xác nhận từ email" />
//                         </Form.Item>
//                     </Col>
//                     <Col span={24}>
//                         <Form.Item
//                             label="Mật khẩu mới"
//                             name="newPassword"
//                             rules={[
//                                 { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
//                                 { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' },
//                                 { pattern: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/, message: 'Mật khẩu phải chứa ít nhất một số và một ký tự đặc biệt!' }
//                             ]}
//                         >
//                             <Input.Password placeholder="Nhập mật khẩu mới" />
//                         </Form.Item>
//                     </Col>
//                     <Col span={24}>
//                         <Form.Item
//                             label="Xác nhận mật khẩu"
//                             name="confirmPassword"
//                             dependencies={['newPassword']}
//                             rules={[
//                                 { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
//                                 ({ getFieldValue }) => ({
//                                     validator(_, value) {
//                                         if (!value || getFieldValue('newPassword') === value) {
//                                             return Promise.resolve();
//                                         }
//                                         return Promise.reject(new Error('Mật khẩu không khớp!'));
//                                     },
//                                 }),
//                             ]}
//                         >
//                             <Input.Password placeholder="Xác nhận mật khẩu" />
//                         </Form.Item>
//                     </Col>
//                     <Col span={24}>
//                         <Button 
//                             type="primary"
//                             htmlType="submit"
//                             loading={loading}
//                         >
//                             {loading ? 'Đang xử lý...' : 'Xác nhận và đổi mật khẩu'}
//                         </Button>
//                         <Button 
//                             style={{ marginLeft: 8 }}
//                             onClick={() => setStep(1)}
//                         >
//                             Quay lại
//                         </Button>
//                     </Col>
//                 </Row>
//             )}
//         </Form>
//     );
// };

// const ManageAccount = (props: IProps) => {
//     const { open, onClose } = props;

//     const onChange = (key: string) => {
//         // console.log(key);
//     };

//     const items: TabsProps['items'] = [
//         {
//             key: 'user-resume',
//             label: `Rải CV`,
//             children: <UserResume />,
//         },
//         {
//             key: 'email-by-skills',
//             label: `Nhận Jobs qua Email`,
//             children: <JobByEmail />,
//         },
//         {
//             key: 'user-update-info',
//             label: `Cập nhật thông tin`,
//             children: <UserUpdateInfo />,
//         },
//         {
//             key: 'user-password',
//             label: `Thay đổi mật khẩu`,
//             children: <UserChangePassword />,
//         },
//     ];

//     return (
//         <>
//             <Modal
//                 title="Quản lý tài khoản"
//                 open={open}
//                 onCancel={() => onClose(false)}
//                 maskClosable={false}
//                 footer={null}
//                 destroyOnClose={true}
//                 width={isMobile ? "100%" : "1000px"}
//             >
//                 <div style={{ minHeight: 400 }}>
//                     <Tabs
//                         defaultActiveKey="user-resume"
//                         items={items}
//                         onChange={onChange}
//                     />
//                 </div>
//             </Modal>
//         </>
//     );
// };

// export default ManageAccount;

import { Button, Col, Form, Input, Modal, Row, Select, Table, Tabs, message, notification } from "antd";
import { isMobile } from "react-device-detect";
import type { TabsProps } from 'antd';
import { IBackendRes, IResume, ISubscribers } from "@/types/backend"; // Import IBackendRes
import { useState, useEffect } from 'react';
import { callCreateSubscriber, callFetchAllSkill, callFetchResumeByUser, callGetSubscriberSkills, callUpdateSubscriber, callSendEmail, callForgotPassword, callResetPassword, callLogout } from "@/config/api";
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { MonitorOutlined } from "@ant-design/icons";
import { SKILLS_LIST } from "@/config/utils";
import { useAppSelector } from "@/redux/hooks";
import { useAppDispatch } from '@/redux/hooks';
import { setLogoutAction } from '@/redux/slice/accountSlide'; 
interface IProps {
    open: boolean;
    onClose: (v: boolean) => void;
}

const UserResume = (props: any) => {
    const [listCV, setListCV] = useState<IResume[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(false);

    useEffect(() => {
        const init = async () => {
            setIsFetching(true);
            const res = await callFetchResumeByUser();
            if (res && res.data) {
                setListCV(res.data.result as IResume[])
            }
            setIsFetching(false);
        }
        init();
    }, [])

    const columns: ColumnsType<IResume> = [
        {
            title: 'STT',
            key: 'index',
            width: 50,
            align: "center",
            render: (text, record, index) => {
                return (
                    <>
                        {(index + 1)}
                    </>)
            }
        },
        {
            title: 'Công Ty',
            dataIndex: "companyName",
        },
        {
            title: 'Job title',
            dataIndex: ["job", "name"],
        },
        {
            title: 'Trạng thái',
            dataIndex: "status",
        },
        {
            title: 'Ngày rải CV',
            dataIndex: "createdAt",
            render(value, record, index) {
                return (
                    <>{dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss')}</>
                )
            },
        },
        {
            title: '',
            dataIndex: "",
            render(value, record, index) {
                return (
                    <a
                        href={`${import.meta.env.VITE_BACKEND_URL}/storage/resume/${record?.url}`}
                        target="_blank"
                    >Chi tiết</a>
                )
            },
        },
    ];

    return (
        <div>
            <Table<IResume>
                columns={columns}
                dataSource={listCV}
                loading={isFetching}
                pagination={false}
            />
        </div>
    )
}

const UserUpdateInfo = (props: any) => {
    return (
        <div>
            //todo
        </div>
    )
}

const JobByEmail = (props: any) => {
    const [form] = Form.useForm();
    const user = useAppSelector(state => state.account.user);
    const [optionsSkills, setOptionsSkills] = useState<{
        label: string;
        value: string;
    }[]>([]);

    const [subscriber, setSubscriber] = useState<ISubscribers | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const init = async () => {
            await fetchSkill();
            const res = await callGetSubscriberSkills();
            if (res && res.data) {
                setSubscriber(res.data);
                const d = res.data.skills;
                const arr = d.map((item: any) => {
                    return {
                        label: item.name as string,
                        value: item.id + "" as string
                    }
                });
                form.setFieldValue("skills", arr);
            }
        }
        init();
    }, [])

    const fetchSkill = async () => {
        let query = `page=1&size=100&sort=createdAt,desc`;

        const res = await callFetchAllSkill(query);
        if (res && res.data) {
            const arr = res?.data?.result?.map(item => {
                return {
                    label: item.name as string,
                    value: item.id + "" as string
                }
            }) ?? [];
            setOptionsSkills(arr);
        }
    }

    const onFinish = async (values: any) => {
        const { skills } = values;
        setLoading(true);

        try {
            const arr = skills?.map((item: any) => {
                if (item?.id) return { id: item.id };
                return { id: item }
            });

            let subscriberResult = null;

            if (!subscriber?.id) {
                //create subscriber
                const data = {
                    email: user.email,
                    name: user.name,
                    skills: arr
                }

                const res = await callCreateSubscriber(data);
                if (res.data) {
                    subscriberResult = res.data;
                    setSubscriber(res.data);
                } else {
                    notification.error({
                        message: 'Có lỗi xảy ra',
                        description: res.message
                    });
                    return;
                }
            } else {
                //update subscriber
                const res = await callUpdateSubscriber({
                    id: subscriber?.id,
                    skills: arr
                });
                if (res.data) {
                    subscriberResult = res.data;
                    setSubscriber(res.data);
                } else {
                    notification.error({
                        message: 'Có lỗi xảy ra',
                        description: res.message
                    });
                    return;
                }
            }

            // Gửi email sau khi cập nhật thành công
            if (subscriberResult) {
                const emailRes = await callSendEmail();
                if (emailRes) {
                    message.success("Cập nhật thông tin thành công!");
                } else {
                    message.warning("Cập nhật thông tin thành công nhưng có lỗi xảy ra");
                }
            }

        } catch (error) {
            console.error('Error:', error);
            notification.error({
                message: 'Có lỗi xảy ra',
                description: 'Vui lòng thử lại sau'
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Form
                onFinish={onFinish}
                form={form}
            >
                <Row gutter={[20, 20]}>
                    <Col span={24}>
                        <Form.Item
                            label={"Kỹ năng"}
                            name={"skills"}
                            rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 skill!' }]}
                        >
                            <Select
                                mode="multiple"
                                allowClear
                                suffixIcon={null}
                                style={{ width: '100%' }}
                                placeholder={
                                    <>
                                        <MonitorOutlined /> Tìm theo kỹ năng...
                                    </>
                                }
                                optionLabelProp="label"
                                options={optionsSkills}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Button 
                            onClick={() => form.submit()}
                            loading={loading}
                            type="primary"
                        >
                            {loading ? 'Đang xử lý...' : 'Cập nhật'}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

const UserChangePassword = () => {
    const [form] = Form.useForm();
    const user = useAppSelector(state => state.account.user);
    const [loading, setLoading] = useState(false);

    const onFinishSendCode = async () => {
        const values = await form.validateFields(['email']);
        const { email } = values;
        setLoading(true);
        try {
            console.log("Sending forgot password request for email:", email);
            const res = await callForgotPassword(email) as IBackendRes<any>;
            console.log("Full response from callForgotPassword:", JSON.stringify(res, null, 2));
            if (res && res.status === 200) {
                message.success("Mã xác nhận đã được gửi đến email của bạn!");
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.error || res.message || 'Không thể gửi mã xác nhận. Trạng thái: ' + (res.status || 'Không xác định')
                });
            }
        } catch (error: any) {
            console.error('Error sending reset code:', error);
            notification.error({
                message: 'Có lỗi xảy ra',
                description: 'Vui lòng thử lại sau. Chi tiết: ' + (error.message || 'Không xác định')
            });
        } finally {
            setLoading(false);
        }
    };

    const onFinishResetPassword = async (values: any) => {
        const { resetCode, newPassword, confirmPassword } = values;
        if (newPassword !== confirmPassword) {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: 'Mật khẩu mới và xác nhận mật khẩu không khớp!'
            });
            return;
        }
        setLoading(true);
        try {
            console.log("Sending reset password request with resetCode:", resetCode);
            const res = await callResetPassword(resetCode, newPassword) as IBackendRes<any>;
            console.log("Response from callResetPassword:", res);
            if (res && res.status === 200) {
                message.success("Đổi mật khẩu thành công!");
                form.resetFields();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.error || res.message || 'Mã xác nhận không hợp lệ'
                });
            }
        } catch (error: any) {
            console.error('Error resetting password:', error);
            notification.error({
                message: 'Có lỗi xảy ra',
                description: 'Vui lòng thử lại sau'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinishResetPassword}
        >
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <Form.Item
                        label="Email"
                        name="email"
                        initialValue={user?.email}
                        rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                    >
                        <Input placeholder="Nhập email" disabled />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Button 
                        type="primary"
                        htmlType="button"
                        loading={loading}
                        onClick={onFinishSendCode}
                    >
                        {loading ? 'Đang gửi...' : 'Gửi mã xác nhận'}
                    </Button>
                </Col>
                <Col span={24}>
                    <Form.Item
                        label="Mã xác nhận"
                        name="resetCode"
                        rules={[{ required: true, message: 'Vui lòng nhập mã xác nhận!' }]}
                    >
                        <Input placeholder="Nhập mã xác nhận từ email" />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        label="Mật khẩu mới"
                        name="newPassword"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                            { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' },
                            { pattern: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/, message: 'Mật khẩu phải chứa ít nhất một số và một ký tự đặc biệt!' }
                        ]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu mới" />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        label="Xác nhận mật khẩu"
                        name="confirmPassword"
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu không khớp!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Xác nhận mật khẩu" />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Button 
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                    >
                        {loading ? 'Đang xử lý...' : 'Hoàn thành'}
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

const UserLogout = () => {
    const dispatch = useAppDispatch();

    const handleLogout = async () => {
        try {
            await callLogout();
            dispatch(setLogoutAction());
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout failed:', error);
            notification.error({
                message: 'Có lỗi xảy ra',
                description: 'Đăng xuất không thành công. Vui lòng thử lại.'
            });
        }
    };

    return (
        <div>
            <Button type="primary" onClick={handleLogout} danger>
                Đăng xuất
            </Button>
        </div>
    );
};

const ManageAccount = (props: IProps) => {
    const { open, onClose } = props;

    const onChange = (key: string) => {
        // console.log(key);
    };

    const items: TabsProps['items'] = [
        {
            key: 'user-resume',
            label: `Rải CV`,
            children: <UserResume />,
        },
        {
            key: 'email-by-skills',
            label: `Nhận Jobs qua Email`,
            children: <JobByEmail />,
        },
        {
            key: 'user-update-info',
            label: `Cập nhật thông tin`,
            children: <UserUpdateInfo />,
        },
        {
            key: 'user-password',
            label: `Thay đổi mật khẩu`,
            children: <UserChangePassword />,
        },
        {
            key: 'user-logout',
            label: `Đăng xuất`,
            children: <UserLogout />,
        },
    ];

    return (
        <>
            <Modal
                title="Quản lý tài khoản"
                open={open}
                onCancel={() => onClose(false)}
                maskClosable={false}
                footer={null}
                destroyOnClose={true}
                width={isMobile ? "100%" : "1000px"}
            >
                <div style={{ minHeight: 400 }}>
                    <Tabs
                        defaultActiveKey="user-resume"
                        items={items}
                        onChange={onChange}
                    />
                </div>
            </Modal>
        </>
    );
};

export default ManageAccount;