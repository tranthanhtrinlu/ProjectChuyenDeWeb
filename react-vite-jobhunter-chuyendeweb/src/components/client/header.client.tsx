// import { useState, useEffect } from 'react';
// import { CodeOutlined, ContactsOutlined, FireOutlined, LogoutOutlined, MenuFoldOutlined, RiseOutlined, TwitterOutlined } from '@ant-design/icons';
// import { Avatar, Drawer, Dropdown, MenuProps, Space, message } from 'antd';
// import { Menu, ConfigProvider } from 'antd';
// import styles from '@/styles/client.module.scss';
// import { isMobile } from 'react-device-detect';
// import { FaReact } from 'react-icons/fa';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Link } from 'react-router-dom';
// import { useAppDispatch, useAppSelector } from '@/redux/hooks';
// import { callLogout } from '@/config/api';
// import { setLogoutAction } from '@/redux/slice/accountSlide';
// import ManageAccount from './modal/manage.account';

// const Header = (props: any) => {
//     const navigate = useNavigate();
//     const dispatch = useAppDispatch();

//     const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);
//     const user = useAppSelector(state => state.account.user);
//     const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);

//     const [current, setCurrent] = useState('home');
//     const location = useLocation();

//     const [openMangeAccount, setOpenManageAccount] = useState<boolean>(false);

//     useEffect(() => {
//         setCurrent(location.pathname);
//     }, [location])

//     const items: MenuProps['items'] = [
//         {
//             label: <Link to={'/'}>Trang Chủ</Link>,
//             key: '/',
//             icon: <TwitterOutlined />,
//         },
//         {
//             label: <Link to={'/job'}>Việc Làm IT</Link>,
//             key: '/job',
//             icon: <CodeOutlined />,
//         },
//         {
//             label: <Link to={'/company'}>Top Công ty IT</Link>,
//             key: '/company',
//             icon: <RiseOutlined />,
//         }
//     ];



//     const onClick: MenuProps['onClick'] = (e) => {
//         setCurrent(e.key);
//     };

//     const handleLogout = async () => {
//     const res = await callLogout();
//     if (res && res && +res.status === 200) {
//         dispatch(setLogoutAction({}));
//         message.success('Đăng xuất thành công');
//         navigate('/');
//     }
// }

//     const itemsDropdown = [
//         {
//             label: <label
//                 style={{ cursor: 'pointer' }}
//                 onClick={() => setOpenManageAccount(true)}
//             >Quản lý tài khoản</label>,
//             key: 'manage-account',
//             icon: <ContactsOutlined />
//         },
//         ...(user.role?.permissions?.length ? [{
//             label: <Link
//                 to={"/admin"}
//             >Trang Quản Trị</Link>,
//             key: 'admin',
//             icon: <FireOutlined />
//         },] : []),

//         {
//             label: <label
//                 style={{ cursor: 'pointer' }}
//                 onClick={() => handleLogout()}
//             >Đăng xuất</label>,
//             key: 'logout',
//             icon: <LogoutOutlined />
//         },
//     ];

//     const itemsMobiles = [...items, ...itemsDropdown];

//     return (
//         <>
//             <div className={styles["header-section"]}>
//                 <div className={styles["container"]}>
//                     {!isMobile ?
//                         <div style={{ display: "flex", gap: 30 }}>
//                             <div className={styles['brand']} >
//                                 <FaReact onClick={() => navigate('/')} title='ThanhTri' />
//                             </div>
//                             <div className={styles['top-menu']}>
//                                 <ConfigProvider
//                                     theme={{
//                                         token: {
//                                             colorPrimary: '#fff',
//                                             colorBgContainer: '#222831',
//                                             colorText: '#a7a7a7',
//                                         },
//                                     }}
//                                 >

//                                     <Menu
//                                         // onClick={onClick}
//                                         selectedKeys={[current]}
//                                         mode="horizontal"
//                                         items={items}
//                                     />
//                                 </ConfigProvider>
//                                 <div className={styles['extra']}>
//                                     {isAuthenticated === false ?
//                                         <Link to={'/login'}>Đăng Nhập</Link>
//                                         :
//                                         <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
//                                             <Space style={{ cursor: "pointer" }}>
//                                                 <span>Welcome {user?.name}</span>
//                                                 <Avatar> {user?.name?.substring(0, 2)?.toUpperCase()} </Avatar>
//                                             </Space>
//                                         </Dropdown>
//                                     }

//                                 </div>

//                             </div>
//                         </div>
//                         :
//                         <div className={styles['header-mobile']}>
//                             <span>Your APP</span>
//                             <MenuFoldOutlined onClick={() => setOpenMobileMenu(true)} />
//                         </div>
//                     }
//                 </div>
//             </div>
//             <Drawer title="Chức năng"
//                 placement="right"
//                 onClose={() => setOpenMobileMenu(false)}
//                 open={openMobileMenu}
//             >
//                 <Menu
//                     onClick={onClick}
//                     selectedKeys={[current]}
//                     mode="vertical"
//                     items={itemsMobiles}
//                 />
//             </Drawer>
//             <ManageAccount
//                 open={openMangeAccount}
//                 onClose={setOpenManageAccount}
//             />
//         </>
//     )
// };

// export default Header;
import { useState, useEffect } from 'react';
import { 
    CodeOutlined, 
    ContactsOutlined, 
    FireOutlined, 
    LogoutOutlined, 
    MenuFoldOutlined, 
    RiseOutlined, 
    TwitterOutlined 
} from '@ant-design/icons';
import { Avatar, Button, ConfigProvider, Drawer, Dropdown, Menu, MenuProps, Space, message, notification } from 'antd';
import { FaReact } from 'react-icons/fa';
import { isMobile } from 'react-device-detect';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { callLogout } from '@/config/api';
import { setLogoutAction } from '@/redux/slice/accountSlide';
import ManageAccount from './modal/manage.account';
import styles from '@/styles/client.module.scss';

const handleLogout = async (dispatch: any, navigate: any) => {
    try {
        console.log("Attempting to logout...");
        const res = await callLogout();
        console.log("Logout response:", res);

        if (res && res.status === 200) {
            dispatch(setLogoutAction());
            message.success(res.message || 'Đăng xuất thành công');
            navigate('/');
        } else if (res && res.status) {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.error || res.message || `Không thể đăng xuất. Trạng thái: ${res.status}`
            });
        } else {
            throw new Error('Không nhận được phản hồi từ server');
        }
    } catch (error: any) {
        console.error('Logout error:', error.response ? error.response.data : error.message);
        notification.error({
            message: 'Có lỗi xảy ra',
            description: 'Vui lòng thử lại sau. Chi tiết: ' + (error.response?.data?.message || error.message || 'Không xác định')
        });
    }
};

const Header = (props: any) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state: any) => state.account.isAuthenticated);
    const user = useSelector((state: any) => state.account.user);
    const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);
    const [current, setCurrent] = useState('home');
    const location = useLocation();
    const [openManageAccount, setOpenManageAccount] = useState<boolean>(false);

    useEffect(() => {
        setCurrent(location.pathname);
    }, [location]);

    const items: MenuProps['items'] = [
        { label: <Link to={'/'}>Trang Chủ</Link>, key: '/', icon: <TwitterOutlined /> },
        { label: <Link to={'/job'}>Việc Làm IT</Link>, key: '/job', icon: <CodeOutlined /> },
        { label: <Link to={'/company'}>Top Công ty IT</Link>, key: '/company', icon: <RiseOutlined /> },
    ];

    const itemsDropdown: MenuProps['items'] = [
        {
            label: <label style={{ cursor: 'pointer' }} onClick={() => setOpenManageAccount(true)}>Quản lý tài khoản</label>,
            key: 'manage-account',
            icon: <ContactsOutlined />,
        },
        ...(user.role?.permissions?.length ? [{
            label: <Link to={'/admin'}>Trang Quản Trị</Link>,
            key: 'admin',
            icon: <FireOutlined />,
        }] : []),
        {
            label: <label style={{ cursor: 'pointer' }} onClick={() => handleLogout(dispatch, navigate)}>Đăng xuất</label>,
            key: 'logout',
            icon: <LogoutOutlined />,
        },
    ];

    const itemsMobiles: MenuProps['items'] = [...items, ...itemsDropdown];

    return (
        <>
            <div className={styles["header-section"]}>
                <div className={styles["container"]}>
                    {!isMobile ? (
                        <div style={{ display: "flex", gap: 30 }}>
                            <div className={styles['brand']}>
                                <FaReact onClick={() => navigate('/')} title='ThanhTri' />
                            </div>
                            <div className={styles['top-menu']}>
                                <ConfigProvider
                                    theme={{
                                        token: {
                                            colorPrimary: '#fff',
                                            colorBgContainer: '#222831',
                                            colorText: '#a7a7a7',
                                        },
                                    }}
                                >
                                    <Menu
                                        selectedKeys={[current]}
                                        mode="horizontal"
                                        items={items}
                                    />
                                </ConfigProvider>
                                <div className={styles['extra']}>
                                    {isAuthenticated === false ? (
                                        <Link to={'/login'}>Đăng Nhập</Link>
                                    ) : (
                                        <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                                            <Space style={{ cursor: "pointer" }}>
                                                <span>Welcome {user?.name}</span>
                                                <Avatar>{user?.name?.substring(0, 2)?.toUpperCase()}</Avatar>
                                            </Space>
                                        </Dropdown>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={styles['header-mobile']}>
                            <span>Your APP</span>
                            <MenuFoldOutlined onClick={() => setOpenMobileMenu(true)} />
                        </div>
                    )}
                </div>
            </div>
            <Drawer
                title="Chức năng"
                placement="right"
                onClose={() => setOpenMobileMenu(false)}
                open={openMobileMenu}
            >
                <Menu
                    selectedKeys={[current]}
                    mode="vertical"
                    items={itemsMobiles}
                />
            </Drawer>
            <ManageAccount
                open={openManageAccount}
                onClose={setOpenManageAccount}
            />
        </>
    );
};

export default Header;