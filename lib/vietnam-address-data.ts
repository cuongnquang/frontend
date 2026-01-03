// Dữ liệu địa chỉ Việt Nam (một số tỉnh và xã phổ biến)
export interface Province {
    code: string;
    name: string;
    districts: District[];
}

export interface District {
    code: string;
    name: string;
    wards: Ward[];
}

export interface Ward {
    code: string;
    name: string;
}

export const vietnamProvinces: Province[] = [
    {
        code: 'HN',
        name: 'Hà Nội',
        districts: [
            {
                code: 'HN-001',
                name: 'Quận Ba Đình',
                wards: [
                    { code: '001', name: 'Phường Phúc Xá' },
                    { code: '002', name: 'Phường Trúc Bạch' },
                    { code: '003', name: 'Phường Vĩnh Phúc' },
                    { code: '004', name: 'Phường Cống Vị' },
                    { code: '005', name: 'Phường Liễu Giai' },
                ]
            },
            {
                code: 'HN-002',
                name: 'Quận Hoàn Kiếm',
                wards: [
                    { code: '001', name: 'Phường Phúc Tân' },
                    { code: '002', name: 'Phường Đồng Xuân' },
                    { code: '003', name: 'Phường Hàng Mã' },
                    { code: '004', name: 'Phường Hàng Buồm' },
                    { code: '005', name: 'Phường Hàng Đào' },
                ]
            },
            {
                code: 'HN-003',
                name: 'Quận Hai Bà Trưng',
                wards: [
                    { code: '001', name: 'Phường Phố Huế' },
                    { code: '002', name: 'Phường Đống Mác' },
                    { code: '003', name: 'Phường Thanh Lương' },
                    { code: '004', name: 'Phường Thanh Nhàn' },
                    { code: '005', name: 'Phường Cầu Dền' },
                ]
            },
            {
                code: 'HN-004',
                name: 'Quận Đống Đa',
                wards: [
                    { code: '001', name: 'Phường Ô Chợ Dừa' },
                    { code: '002', name: 'Phường Văn Miếu' },
                    { code: '003', name: 'Phường Hàng Bột' },
                    { code: '004', name: 'Phường Láng Thượng' },
                    { code: '005', name: 'Phường Khâm Thiên' },
                ]
            },
        ]
    },
    {
        code: 'HCM',
        name: 'Thành phố Hồ Chí Minh',
        districts: [
            {
                code: 'HCM-001',
                name: 'Quận 1',
                wards: [
                    { code: '001', name: 'Phường Bến Nghé' },
                    { code: '002', name: 'Phường Đa Kao' },
                    { code: '003', name: 'Phường Bến Thành' },
                    { code: '004', name: 'Phường Nguyễn Thái Bình' },
                    { code: '005', name: 'Phường Phạm Ngũ Lão' },
                ]
            },
            {
                code: 'HCM-002',
                name: 'Quận 3',
                wards: [
                    { code: '001', name: 'Phường Võ Thị Sáu' },
                    { code: '002', name: 'Phường Đa Kao' },
                    { code: '003', name: 'Phường Nguyễn Thái Bình' },
                    { code: '004', name: 'Phường Phạm Ngũ Lão' },
                    { code: '005', name: 'Phường Cầu Ông Lãnh' },
                ]
            },
            {
                code: 'HCM-003',
                name: 'Quận Bình Thạnh',
                wards: [
                    { code: '001', name: 'Phường 1' },
                    { code: '002', name: 'Phường 2' },
                    { code: '003', name: 'Phường 3' },
                    { code: '004', name: 'Phường 5' },
                    { code: '005', name: 'Phường 6' },
                ]
            },
        ]
    },
    {
        code: 'DN',
        name: 'Đà Nẵng',
        districts: [
            {
                code: 'DN-001',
                name: 'Quận Hải Châu',
                wards: [
                    { code: '001', name: 'Phường Thanh Bình' },
                    { code: '002', name: 'Phường Thuận Phước' },
                    { code: '003', name: 'Phường Thạch Thang' },
                    { code: '004', name: 'Phường Hải Châu I' },
                    { code: '005', name: 'Phường Hải Châu II' },
                ]
            },
            {
                code: 'DN-002',
                name: 'Quận Thanh Khê',
                wards: [
                    { code: '001', name: 'Phường Thanh Khê Tây' },
                    { code: '002', name: 'Phường Thanh Khê Đông' },
                    { code: '003', name: 'Phường Xuân Hà' },
                    { code: '004', name: 'Phường Tân Chính' },
                    { code: '005', name: 'Phường Chính Gián' },
                ]
            },
        ]
    },
    {
        code: 'HP',
        name: 'Hải Phòng',
        districts: [
            {
                code: 'HP-001',
                name: 'Quận Hồng Bàng',
                wards: [
                    { code: '001', name: 'Phường Minh Khai' },
                    { code: '002', name: 'Phường Sở Dầu' },
                    { code: '003', name: 'Phường Trại Chuối' },
                    { code: '004', name: 'Phường Hoàng Văn Thụ' },
                    { code: '005', name: 'Phường Hạ Lý' },
                ]
            },
        ]
    },
    {
        code: 'CT',
        name: 'Cần Thơ',
        districts: [
            {
                code: 'CT-001',
                name: 'Quận Ninh Kiều',
                wards: [
                    { code: '001', name: 'Phường Cái Khế' },
                    { code: '002', name: 'Phường An Hòa' },
                    { code: '003', name: 'Phường Thới Bình' },
                    { code: '004', name: 'Phường An Nghiệp' },
                    { code: '005', name: 'Phường An Cư' },
                ]
            },
        ]
    },
];

