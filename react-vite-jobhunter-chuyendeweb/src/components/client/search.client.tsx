// import { Button, Col, Form, Row, Select, notification } from 'antd';
// import { EnvironmentOutlined, MonitorOutlined } from '@ant-design/icons';
// import { LOCATION_LIST } from '@/config/utils';
// import { ProForm } from '@ant-design/pro-components';
// import { useEffect, useState } from 'react';
// import { callFetchAllSkill } from '@/config/api';
// import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

// const SearchClient = () => {
//     const navigate = useNavigate();
//     const location = useLocation();

//     const optionsLocations = LOCATION_LIST;
//     const [form] = Form.useForm();
//     const [optionsSkills, setOptionsSkills] = useState<{
//         label: string;
//         value: string;
//     }[]>([]);

//     const [searchParams, setSearchParams] = useSearchParams();

//     useEffect(() => {
//         if (location.search) {
//             const queryLocation = searchParams.get("location");
//             const querySkills = searchParams.get("skills")
//             if (queryLocation) {
//                 form.setFieldValue("location", queryLocation.split(","))
//             }
//             if (querySkills) {
//                 form.setFieldValue("skills", querySkills.split(","))
//             }
//         }
//     }, [location.search])

//     useEffect(() => {
//         fetchSkill();
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
//         let query = "";
//         if (values?.location?.length) {
//             query = `location=${values?.location?.join(",")}`;
//         }
//         if (values?.skills?.length) {
//             query = values.location?.length ? query + `&skills=${values?.skills?.join(",")}`
//                 :
//                 `skills=${values?.skills?.join(",")}`;
//         }

//         if (!query) {
//             notification.error({
//                 message: 'Có lỗi xảy ra',
//                 description: "Vui lòng chọn tiêu chí để search"
//             });
//             return;
//         }
//         navigate(`/job?${query}`);
//     }

//     return (
//         <ProForm
//             form={form}
//             onFinish={onFinish}
//             submitter={
//                 {
//                     render: () => <></>
//                 }
//             }
//         >
//             <Row gutter={[20, 20]}>
//                 <Col span={24}><h2>Việc Làm IT Cho Developer "Chất"</h2></Col>
//                 <Col span={24} md={16}>
//                     <ProForm.Item
//                         name="skills"
//                     >
//                         <Select
//                             mode="multiple"
//                             allowClear
//                             suffixIcon={null}
//                             style={{ width: '100%' }}
//                             placeholder={
//                                 <>
//                                     <MonitorOutlined /> Tìm theo kỹ năng...
//                                 </>
//                             }
//                             optionLabelProp="label"
//                             options={optionsSkills}
//                         />
//                     </ProForm.Item>
//                 </Col>
//                 <Col span={12} md={4}>
//                     <ProForm.Item
//                         name="location"
//                     >
//                         <Select
//                             mode="multiple"
//                             allowClear
//                             suffixIcon={null}
//                             style={{ width: '100%' }}
//                             placeholder={
//                                 <>
//                                     <EnvironmentOutlined /> Địa điểm...
//                                 </>
//                             }
//                             optionLabelProp="label"
//                             options={optionsLocations}
//                         />
//                     </ProForm.Item>
//                 </Col>
//                 <Col span={12} md={4}>
//                     <Button type='primary' onClick={() => form.submit()}>Search</Button>
//                 </Col>
//             </Row>
//         </ProForm>
//     )
// }
// export default SearchClient;
import { Button, Col, Form, Row, Select, notification } from 'antd';
import { EnvironmentOutlined, MonitorOutlined } from '@ant-design/icons';
import { LOCATION_LIST } from '@/config/utils';
import { ProForm } from '@ant-design/pro-components';
import { useEffect, useState, useCallback } from 'react';
import { callFetchAllSkill } from '@/config/api';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import debounce from 'lodash/debounce';

const SearchClient = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const optionsLocations = LOCATION_LIST;
    const [form] = Form.useForm();
    const [optionsSkills, setOptionsSkills] = useState<{
        label: string;
        value: string;
    }[]>([]);

    const [searchParams, setSearchParams] = useSearchParams();

    // Auto search function
    const performSearch = useCallback((values: any) => {
        let query = "";
        if (values?.location?.length) {
            query = `location=${values?.location?.join(",")}`;
        }
        if (values?.skills?.length) {
            query = values.location?.length ? query + `&skills=${values?.skills?.join(",")}`
                :
                `skills=${values?.skills?.join(",")}`;
        }

        // If both fields are empty, navigate to /job without query
        if (!query) {
            navigate('/job');
            return;
        }

        navigate(`/job?${query}`);
    }, [navigate]);

    // Debounced search to avoid too frequent API calls
    const debouncedSearch = useCallback(
        debounce((values: any) => {
            performSearch(values);
        }, 500), // 500ms delay
        [performSearch]
    );

    useEffect(() => {
        if (location.search) {
            const queryLocation = searchParams.get("location");
            const querySkills = searchParams.get("skills")
            if (queryLocation) {
                form.setFieldValue("location", queryLocation.split(","))
            }
            if (querySkills) {
                form.setFieldValue("skills", querySkills.split(","))
            }
        }
    }, [location.search, form, searchParams]);

    useEffect(() => {
        fetchSkill();
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
        performSearch(values);
    }

    // Handle field changes for auto search
    const handleFieldChange = (changedFields: any, allFields: any) => {
        const formValues = form.getFieldsValue();
        debouncedSearch(formValues);
    };

    // Handle skills change
    const handleSkillsChange = (value: string[]) => {
        form.setFieldValue('skills', value);
        const formValues = form.getFieldsValue();
        debouncedSearch(formValues);
    };

    // Handle location change  
    const handleLocationChange = (value: string[]) => {
        form.setFieldValue('location', value);
        const formValues = form.getFieldsValue();
        debouncedSearch(formValues);
    };

    return (
        <ProForm
            form={form}
            onFinish={onFinish}
            onFieldsChange={handleFieldChange}
            submitter={
                {
                    render: () => <></>
                }
            }
        >
            <Row gutter={[20, 20]}>
                <Col span={24}><h2>Việc Làm IT Cho Developer "Chất"</h2></Col>
                <Col span={24} md={16}>
                    <ProForm.Item
                        name="skills"
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
                            onChange={handleSkillsChange}
                            showSearch
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                        />
                    </ProForm.Item>
                </Col>
                <Col span={12} md={4}>
                    <ProForm.Item
                        name="location"
                    >
                        <Select
                            mode="multiple"
                            allowClear
                            suffixIcon={null}
                            style={{ width: '100%' }}
                            placeholder={
                                <>
                                    <EnvironmentOutlined /> Địa điểm...
                                </>
                            }
                            optionLabelProp="label"
                            options={optionsLocations}
                            onChange={handleLocationChange}
                            showSearch
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                        />
                    </ProForm.Item>
                </Col>
                <Col span={12} md={4}>
                    <Button type='primary' onClick={() => form.submit()}>Search</Button>
                </Col>
            </Row>
        </ProForm>
    )
}
export default SearchClient;