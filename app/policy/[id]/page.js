'use client';

// CustomerForm.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession, getSession } from 'next-auth/react'; // Import getSession for fetching session details
import { useRouter } from 'next/navigation';
import '@/app/style/updateCustomerForm.css';


async function fetchpolicy(params) {
    try {
        const response = await fetch(`/api/dataSale/Customer/Policy?id=${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('ไม่สามารถดึงข้อมูลกรมธรรม์ได้');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
        return null; // ถ้ามีข้อผิดพลาดให้ส่งคืนเป็น null
    }
}

async function fetchthai_provinces() {
    try {
        const response = await fetch(`/api/datainweb/thai/thai_provinces`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error', error);
        return null;
    }
}

async function fetchthai_amphures(id) {
    try {
        const response = await fetch(`/api/datainweb/thai/thai_amphures/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error', error);
        return null;
    }
}

async function fetchthai_tambons(id) {
    try {
        const response = await fetch(`/api/datainweb/thai/thai_tambons/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error', error);
        return null;
    }
}

async function fetchbrand() {
    try {
        const response = await fetch(`/api/datainweb/vehicle/brand`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error', error);
        return null;
    }
}

async function fetchmodel(brand) {
    try {
        const response = await fetch(`/api/datainweb/vehicle/model/${brand}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error', error);
        return null;
    }
}

function updateCustomerForm({ params }) {
    const router = useRouter();
    const { data: session, status } = useSession();
    const routeParams = useParams();
    const [showSecondPersonFields, setShowSecondPersonFields] = useState(false);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedSubdistrict, setSelectedSubdistrict] = useState("");
    const [districts, setDistricts] = useState([]);
    const [subdistricts, setSubdistricts] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [brands, setBrands] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState("");
    const [models, setModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState("");
    const [responseMessage, setResponseMessage] = useState('');
    const [formData, setFormData] = useState({
        customerID: '',
        vehicleID: '',
        policyID: '',
        FirstName: '',
        LastName: '',
        DateOfBirth: '',
        PhoneNumber: '',
        EmailAddress: '',
        Address: '',
        RegistrationDate: '',
        LicensePlate: '',
        Brand: '',
        Model: '',
        Registration: '',
        VIN: '',
        PolicyType: '',
        RenewOrNew: '',
        CoverageAmount: '',
        TypeOfUse: '',
        StartDate: '',
        EndDate: '',
        CarDashCam: '',
        Deductible: '',
        GarageType: '',
        ndperson: '',
        DateOfBirth2: '',
        PhoneNumber2: ''
    });
      

    const checkEmptyFields = (formData) => {
        const fieldsToIgnore = ['ndperson', 'DateOfBirth2', 'PhoneNumber2']; // ฟิลด์ที่ไม่ต้องการตรวจสอบ

        const emptyFields = Object.entries(formData)
            .filter(([key, value]) => !fieldsToIgnore.includes(key) && value === '');

        if (emptyFields.length === 0) {
            console.log("No empty fields, all fields are filled.");
            return true; // ไม่มีฟิลด์ไหนที่ว่าง
        } else {
            const emptyFieldNames = emptyFields.map(([key]) => key);
            console.log("Empty fields: ", emptyFieldNames);
            return false; // มีฟิลด์ที่ว่าง
        }
    };


    const handleProvinceChange = async (e) => {
        const provinceId = e.target.value;
        setSelectedProvince(provinceId);
        setSelectedDistrict("");
        setSubdistricts([]);
        if (provinceId) {
            const amphures = await fetchthai_amphures(provinceId);
            if (amphures) {
                const amphuresOptions = amphures.thai_amphures.map((amphure, index) => ({
                    name: amphure,
                    id: amphures.id[index]
                }));
                setDistricts(amphuresOptions);
            }
            setFormData((prevData) => ({
                ...prevData,
                Address: provinceId,
            }));
        } else {
            setDistricts([]);
        }
    };

    const handleDistrictChange = async (e) => {
        const districtId = e.target.value;
        setSelectedDistrict(districtId);

        if (districtId) {
            const tambons = await fetchthai_tambons(districtId);
            setSubdistricts(tambons ? tambons.thai_tambons : []);
            setFormData((prevData) => ({
                ...prevData,
                Address: `${selectedProvince} ${districtId}`, // Update address with district
            }));
        } else {
            setSubdistricts([]);
        }

    };

    const handleSubdistrictChange = (e) => {
        const subdistrict = e.target.value;
        setSelectedSubdistrict(subdistrict);
        setFormData((prevData) => ({
            ...prevData,
            Address: `${selectedProvince} ${selectedDistrict} ${subdistrict}`, // Update full address
        }));

    };

    const handleSecondPersonChange = (event) => {
        setShowSecondPersonFields(event.target.value === "yes");
    };

    const handleBrandChange = async (e) => {
        const brand = e.target.value;
        setSelectedBrand(brand);
        setModels([]);
        setSelectedModel("");
        setFormData((prevData) => ({
            ...prevData,
            Brand: brand,
        }));
        if (brand) {
            const modelsData = await fetchmodel(brand);
            if (modelsData) {
                setModels(modelsData.model);
            }
        }
    };

    const handleModelChange = (e) => {
        const model = e.target.value;
        setSelectedModel(model);
        setFormData((prevData) => ({
            ...prevData,
            Model: model,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!checkEmptyFields(formData)) {
            alert('กรุณากรอกข้อมูล')
            return;
        }

        try {
            const response = await fetch('/api/dataSale/Customer/update', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const result = await response.json();
                setResponseMessage(result.message || 'Customer and vehicle updated successfully.');
            } else {
                alert("รถยน1คันมีได้แค่1กรมธรรม์");
            }
        } catch (error) {
            console.error('Error:', error);
            setResponseMessage('Error updating customer/vehicle.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const deletePolicy = async (policyId) => {
        try {
            if (!policyId) {
                console.error('Policy ID is missing.');
                return;
            }
            console.log('Policy ID to delete:', policyId);
    
            const res = await fetch(`/api/dataSale/Customer/delete/${policyId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            const data = await res.json();
    
            if (res.ok) {
                console.log('Policy deleted successfully:', data.deletedPolicy);
                router.push('/login');  // ถ้าลบสำเร็จให้ redirect ไปที่หน้า login
            } else {
                console.error('Error deleting policy:', data.message);  // แสดงข้อผิดพลาดที่ได้รับ
            }
        } catch (error) {
            console.error('Error:', error);  // แสดงข้อผิดพลาดจากระบบ
        }
    };
    

    useEffect(() => {

        if (status === 'loading') {
            console.log("Session is loading...");
            return; // รอให้สถานะโหลดเสร็จ
        }

        if (status === 'unauthenticated') {
            console.log("User is unauthenticated, redirecting to login...");
            router.push('/login'); // ถ้าไม่มีการยืนยันตัวตน, ไปที่หน้า login
        }

        const checkSession = async () => {
            const currentSession = await getSession(); // ดึงข้อมูลเซสชัน
            console.log("Session data:", currentSession);

            if (currentSession && currentSession.user) {
                console.log("User position ID:", currentSession.user.positionID);
                if (!(currentSession.user.positionID === 'P015' || currentSession.user.positionID === 'P013' || currentSession.user.positionID === 'P017')) {
                    console.log("User is not a head, redirecting to login...");
                    router.push('/login'); // ถ้าไม่ใช่ผู้จัดการ, ส่งไปหน้า login
                }
            }
        };

        checkSession();
        const fetchData = async () => {
            try {
                const provincesData = await fetchthai_provinces();
                if (provincesData) {
                    const provinceOptions = provincesData.thai_provinces.map((province, index) => ({
                        name: province,
                        id: provincesData.id[index]
                    }));
                    setProvinces(provinceOptions);
                }

                const brandsData = await fetchbrand();
                if (brandsData) {
                    setBrands(brandsData.brand);
                }

                const data = await fetchpolicy(routeParams.id);
                if (data) {
                    setFormData({
                        customerID: data.policydata.customer.CustomerID,
                        vehicleID: data.policydata.VehicleID,
                        policyID: data.policydata.PolicyID,
                        FirstName: data.policydata.customer.FirstName,
                        LastName: data.policydata.customer.LastName,
                        DateOfBirth: data.policydata.customer.DateOfBirth, // Format date to YYYY-MM-DD
                        PhoneNumber: data.policydata.customer.PhoneNumber,
                        EmailAddress: data.policydata.customer.EmailAddress,
                        Address: data.policydata.customer.Address,
                        PostalCode: data.policydata.customer.PostalCode,
                        RegistrationDate: data.policydata.customer.RegistrationDate, // Format date
                        LicensePlate: data.policydata.vehicle.LicensePlate,
                        Brand: data.policydata.vehicle.Brand,
                        Model: data.policydata.vehicle.Model,
                        Registration: data.policydata.vehicle.Registration,
                        VIN: data.policydata.vehicle.VIN,
                        PolicyType: data.policydata.PolicyType,
                        RenewOrNew: data.policydata.RenewOrNew,
                        CoverageAmount: data.policydata.CoverageAmount,
                        TypeOfUse: data.policydata.TypeOfUse,
                        StartDate: data.policydata.StartDate, // Format date
                        EndDate: data.policydata.EndDate, // Format date
                        CarDashCam: data.policydata.CarDashCam,
                        Deductible: data.policydata.Deductible,
                        GarageType: data.policydata.GarageType,
                        ndperson: data.policydata.ndperson,
                        DateOfBirth2: data.policydata.DateOfBirth,
                        PhoneNumber2: data.policydata.PhoneNumber
                    });
                }
                if (data.policydata.ndperson) {
                    setShowSecondPersonFields('yes')
                }
                const [province, district, subdistrict] = data.policydata.customer.Address.split(' ');
                console.log(subdistrict)
                setSelectedProvince(province);
                setSelectedDistrict(district)
                setSelectedSubdistrict(subdistrict)
                await handleProvinceChange({ target: { value: province } });
                await handleDistrictChange({ target: { value: district } });
                setSelectedBrand(data.policydata.vehicle.Brand)
                setSelectedModel(data.policydata.vehicle.Model)
                await handleBrandChange({ target: { value: data.policydata.vehicle.Brand } });
                await handleModelChange({ target: { value: data.policydata.vehicle.Model } });
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);  // ใช้ params.id เป็น dependency


    return (
        <div>
        <form onSubmit={handleSubmit}>
            <div className="customer-form">
                {/* ส่วนที่หนึ่ง */}
                <div className="section-one">
                    <h3>ส่วนที่หนึ่ง: ข้อมูลส่วนตัวลูกค้า</h3>
                    <div className="form-group-CTF">
                        <div className='next'>
                            <label>ชื่อจริง</label>
                            <input type="text" name="FirstName"
                                value={formData.FirstName}
                                onChange={handleInputChange} />

                            <label>นามสกุล</label>
                            <input type="text" name="LastName"
                                value={formData.LastName}
                                onChange={handleInputChange} />
                        </div>
                        <div className='next'>
                            <label>วันเดือนปีเกิด</label>
                            <input type="date" name="DateOfBirth"
                                value={formData.DateOfBirth}
                                onChange={handleInputChange} />
                            <label>เบอร์โทรศัพท์</label>
                            <input type="tel" name="PhoneNumber"
                                value={formData.PhoneNumber}
                                onChange={handleInputChange} />
                        </div>
                        <div className='next'>
                            <label>อีเมลล์</label>
                            <input type="email" name="EmailAddress"
                                value={formData.EmailAddress}
                                onChange={handleInputChange} />

                            <label>จังหวัด</label>
                            <select onChange={handleProvinceChange} value={selectedProvince}>
                                <option value="">เลือกจังหวัด</option>
                                {provinces.map((province) => (
                                    <option key={province.id} value={province.name}>
                                        {province.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='next'>
                            <label>อำเภอ</label>
                            <select onChange={handleDistrictChange} value={selectedDistrict} disabled={!selectedProvince}>
                                <option value="">เลือกอำเภอ</option>
                                {districts.map((district) => (
                                    <option key={district.id} value={district.name}>
                                        {district.name}
                                    </option>
                                ))}
                            </select>

                            <label>ตำบล</label>
                            <select onChange={handleSubdistrictChange} disabled={!selectedDistrict} value={selectedSubdistrict}>
                                <option value="">เลือกตำบล</option>
                                {subdistricts.map((subdistrict, index) => (
                                    <option key={index} value={subdistrict}>
                                        {subdistrict}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <label>วันที่เข้าใช้บริการ</label>
                        <input type="date" name="RegistrationDate" value={formData.RegistrationDate}
                            onChange={handleInputChange} />
                    </div>
                </div>

                {/* ส่วนที่สอง */}
                <div className="section-two">
                    <h3>ส่วนที่สอง: ข้อมูลรถยนต์</h3>
                    <div className="form-group-CTF">
                        <label>ทะเบียนรถยนต์</label>
                        <input type="text" name="LicensePlate" value={formData.LicensePlate}
                            onChange={handleInputChange} />

                        <label>ประเภทรถ</label>
                        <select name="TypeOfUse" value={formData.TypeOfUse}
                            onChange={handleInputChange}>
                            <option value="">เลือก</option>
                            <option value="รย1">รย.1 - รถยนต์นั่งส่วนบุคคลไม่เกิน 7 คน</option>
                            <option value="รย2">รย.2 - รถยนต์นั่งส่วนบุคคลเกิน 7 คน</option>
                            <option value="รย3">รย.3 - รถยนต์บรรทุกส่วนบุคคล</option>
                            <option value="รย4">รย.4 - รถยนต์สามล้อส่วนบุคคล</option>
                            <option value="รย5">รย.5 - รถยนต์รับจ้างระหว่างจังหวัด</option>
                            <option value="รย6">รย.6 - รถยนต์รับจ้างบรรทุกคนโดยสารไม่เกิน 7 คน</option>
                            <option value="รย7">รย.7 - รถยนต์สี่ล้อเล็กรับจ้าง</option>
                            <option value="รย8">รย.8 - รถยนต์รับจ้างสามล้อ</option>
                            <option value="รย9">รย.9 - รถยนต์บริหารธุรกิจ</option>
                            <option value="รย10">รย.10 - รถยนต์ให้บริการทัศนาจร</option>
                            <option value="รย11">รย.11 - รถยนต์บริการให้เช่า</option>
                            <option value="รย12">รย.12 - รถจักรยานยนต์ส่วนบุคคล</option>
                        </select>
                        <div className='next'>
                            <label>ยี่ห้อรถ</label>
                            <select onChange={handleBrandChange} value={selectedBrand}>
                                <option value="">เลือกยี่ห้อรถ</option>
                                {brands.map((brand, index) => (
                                    <option key={index} value={brand}>
                                        {brand}
                                    </option>
                                ))}
                            </select>
                            <label>รุ่นรถ</label>
                            <select onChange={handleModelChange} value={selectedModel} disabled={!selectedBrand}>
                                <option value="">เลือกรุ่นรถ</option>
                                {models.map((model, index) => (
                                    <option key={index} value={model}>
                                        {model}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='next'>
                            <label>ปีที่จดทะเบียน</label>
                            <input type="month" name="Registration" value={formData.Registration}
                                onChange={handleInputChange} />

                            <label>หมายเลขตัวถัง</label>
                            <input type="text" name="VIN" value={formData.VIN}
                                onChange={handleInputChange} />
                        </div>
                    </div>
                </div>

                {/* ส่วนที่สาม */}
                <div className="section-three">
                    <h3>ส่วนที่สาม: ข้อมูลกรมธรรม์</h3>
                    <div className="form-group-CTF">
                        <div className='next'>
                            <label>ต่ออายุ/ประกันใหม่</label>
                            <select name="RenewOrNew" value={formData.RenewOrNew} onChange={handleInputChange}>
                                <option value="">เลือก</option>
                                <option value="Renew">ต่ออายุ</option>
                                <option value="New">ประกันใหม่</option>
                            </select>

                            <label>แผนประกันรถยนต์</label>
                            <select name="PolicyType" value={formData.PolicyType} onChange={handleInputChange}>
                                <option value="">เลือก</option>
                                <option value="1">1</option>
                                <option value="2+">2+</option>
                                <option value="2">2</option>
                                <option value="3+">3+</option>
                                <option value="3">3</option>
                            </select>
                        </div>
                        <div className='next'>
                            <label>เบี้ยประกัน</label>
                            <select name="CoverageAmount" value={formData.CoverageAmount} onChange={handleInputChange}>
                                <option value="">เลือก</option>
                                <option value="500000">50,000 - 500,000</option>
                                <option value="1000000">500,001 - 1,000,000</option>
                                <option value="1500000">1,000,001 - 1,500,000</option>
                                <option value="2000000">มากกว่า 1,500,000</option>
                            </select>

                            <label>ประเภทอู่</label>
                            <select name="GarageType" value={formData.GarageType} onChange={handleInputChange}>
                                <option value="">เลือก</option>
                                <option value="ซ่อมศูนย์">ซ่อมศูนย์</option>
                                <option value="ซ่อมอู่">ซ่อมอู่</option>
                                <option value="ซ่อมศูนย์/ซ่อมอู่">ซ่อมศูนย์/ซ่อมอู่</option>
                            </select>
                        </div>
                        <div className='next'>
                            <label>วันที่เริ่มต้นกรมธรรม์</label>
                            <input type="date" name="StartDate" value={formData.StartDate} onChange={handleInputChange} />

                            <label>วันที่สิ้นสุดกรมธรรม์</label>
                            <input type="date" name="EndDate" value={formData.EndDate} onChange={handleInputChange} />
                        </div>
                    </div>
                </div>

                {/* ส่วนเพิ่มเติม */}
                <div className="section-four">
                    <h3>ส่วนเพิ่มเติม</h3>
                    <div className="form-group-CTF">
                        <div className='next'>
                            <label>กล้องหน้ารถ</label>
                            <select name="CarDashCam" value={formData.CarDashCam} onChange={handleInputChange}>
                                <option value="">เลือก</option>
                                <option value="1">มี</option>
                                <option value="0">ไม่มี</option>
                            </select>

                            <label>ค่าเสียหายส่วนแรก</label>
                            <select name="Deductible" value={formData.Deductible} onChange={handleInputChange}>
                                <option value="">เลือก</option>
                                <option value="0">0</option>
                                <option value="1000">1000</option>
                                <option value="2000">2000</option>
                                <option value="3000">3000</option>
                                <option value="4000">4000</option>
                                <option value="5000">5000</option>
                            </select>
                        </div>
                        <div className="form-item">
                            <label>คนที่สอง</label>
                            <select onChange={handleSecondPersonChange} value={showSecondPersonFields}>
                                <option value="">เลือก</option>
                                <option value="yes">มี</option>
                                <option value="no">ไม่มี</option>
                            </select>
                        </div>
                    </div>

                    {showSecondPersonFields && (
                        <div className="form-group-CTF">
                            <div className="form-item">
                                <label>ชื่อจริง-นามสกุล</label>
                                <input type="text" name="ndperson" value={formData.ndperson} onChange={handleInputChange} />
                            </div>
                            <div className="next ">
                                <label>วันเดือนปีเกิด</label>
                                <input type="date" name="DateOfBirth2" value={formData.DateOfBirth2} onChange={handleInputChange} />

                                <label>เบอร์โทรศัพท์</label>
                                <input type="tel" name="PhoneNumber2" value={formData.PhoneNumber2} onChange={handleInputChange} />
                            </div>
                        </div>
                    )}
                </div>
                <button type="submit">ยืนยัน</button>
                {/* Display formData */}
            </div>
            {responseMessage && <p>{responseMessage}</p>}
        </form>
        </div>
    );
}

export default updateCustomerForm;