// ============================================
// 데모 모드 - Supabase 없이 로컬 테스트용
// localStorage 기반 Mock Supabase Client
// ============================================

const DEMO_MODE = true; // Supabase 미설정 시 자동 활성화

// ── 초기 테스트 데이터 시드 ──
const SEED_DATA = {
  // 제품마다 사용 가능한 농도 목록이 다름
  products: [
    { id: 'prod-01', name: 'BELLA',              specs: ['15','17','21','30'],       active: true },
    { id: 'prod-02', name: 'FLUX',               specs: ['10','15','20','30'],       active: true },
    { id: 'prod-03', name: 'VEGA',               specs: ['10','15','20'],            active: true },
    { id: 'prod-04', name: 'T1',                 specs: ['15','20','25','35'],       active: true },
    { id: 'prod-05', name: 'T2',                 specs: ['15','20','30'],            active: true },
    { id: 'prod-06', name: 'Premium',            specs: ['15','20','30','40'],       active: true },
    { id: 'prod-07', name: 'Prestige',           specs: ['15','20','30'],            active: true },
    { id: 'prod-08', name: 'DETLA',              specs: ['5','10','15','20'],        active: true },
    { id: 'prod-09', name: 'ML Signature',       specs: ['15','20','30'],            active: true },
    { id: 'prod-10', name: 'ML Classic',         specs: ['15','20'],                 active: true },
    { id: 'prod-11', name: 'ML Signature Green', specs: ['20','30'],                 active: true },
    { id: 'prod-12', name: 'Authentic T',        specs: ['15','20','30','40','50'],  active: true },
    { id: 'prod-13', name: 'Authentic L',        specs: ['15','20','30','40','50','70'], active: true },
  ],
  users: [
    {
      id: 'admin-001',
      email: 'admin',
      password: '1234',
      role: 'admin',
      dealer_name: '더 스미스 본사',
      dealer_phone: '02-1234-5678',
      dealer_address: '서울특별시 강남구 테헤란로 123',
    },
    {
      id: 'dealer-a085',
      email: 'a085',
      password: '1234',
      role: 'dealer',
      dealer_name: 'A085 대리점',
      dealer_phone: '',
      dealer_address: '',
      joined_at: '2026-03-26',
      active: true,
    },
    {
      id: 'dealer-a001',
      email: 'a001',
      password: '12345',
      role: 'dealer',
      dealer_name: 'A001 대리점',
      dealer_phone: '010-0000-0000',
      dealer_address: '',
      joined_at: '2026-03-26',
      active: true,
    },
    {
      id: 'dealer-a002',
      email: 'a002',
      password: '12345',
      role: 'dealer',
      dealer_name: 'A002 대리점',
      dealer_phone: '010-0000-0000',
      dealer_address: '',
      joined_at: '2026-03-26',
      active: true,
    },
    {
      id: 'dealer-a003',
      email: 'a003',
      password: '12345',
      role: 'dealer',
      dealer_name: 'A003 대리점',
      dealer_phone: '010-0000-0000',
      dealer_address: '',
      joined_at: '2026-03-26',
      active: true,
    },
    {
      id: 'dealer-a004',
      email: 'a004',
      password: '12345',
      role: 'dealer',
      dealer_name: 'A004 대리점',
      dealer_phone: '010-0000-0000',
      dealer_address: '',
      joined_at: '2026-03-26',
      active: true,
    },
    {
      id: 'dealer-a005',
      email: 'a005',
      password: '12345',
      role: 'dealer',
      dealer_name: 'A005 대리점',
      dealer_phone: '010-0000-0000',
      dealer_address: '',
      joined_at: '2026-03-26',
      active: true,
    },
  ],
  inventory: [
    // dealer-a085 (A085 대리점)
    { id:'inv-a085-01', dealer_id:'dealer-a085', product_name:'BELLA', spec:'15', quantity:5, used_meters:0 },
    { id:'inv-a085-02', dealer_id:'dealer-a085', product_name:'FLUX',  spec:'10', quantity:4, used_meters:0 },
    // dealer-a001 (A001 대리점)
    { id:'inv-a001-01', dealer_id:'dealer-a001', product_name:'BELLA', spec:'15', quantity:3, used_meters:0 },
    { id:'inv-a001-02', dealer_id:'dealer-a001', product_name:'T1',    spec:'20', quantity:5, used_meters:0 },
    // dealer-a002 (A002 대리점)
    { id:'inv-a002-01', dealer_id:'dealer-a002', product_name:'VEGA',  spec:'15', quantity:4, used_meters:0 },
    { id:'inv-a002-02', dealer_id:'dealer-a002', product_name:'T2',    spec:'15', quantity:6, used_meters:0 },
    // dealer-a003 (A003 대리점)
    { id:'inv-a003-01', dealer_id:'dealer-a003', product_name:'FLUX',  spec:'15', quantity:7, used_meters:0 },
    { id:'inv-a003-02', dealer_id:'dealer-a003', product_name:'DETLA', spec:'10', quantity:3, used_meters:0 },
    // dealer-a004 (A004 대리점)
    { id:'inv-a004-01', dealer_id:'dealer-a004', product_name:'BELLA', spec:'21', quantity:4, used_meters:0 },
    { id:'inv-a004-02', dealer_id:'dealer-a004', product_name:'VEGA',  spec:'20', quantity:2, used_meters:0 },
  ],
  warranties: [
    // ── A001 대리점 (6건) ──
    { id:'w-a001-01', warranty_number:'26-SC-0302-1001', customer_name:'김민준', customer_car:'아이오닉5', car_number:'12가 3456', customer_phone:'01012345671', customer_address:'서울특별시 강남구 테헤란로 123', car_vin:'5YJ3E1EA1NF001001', service_date:'2026-03-02', service_price:980000, front_product:'BELLA', front_spec:'30', side1_product:'BELLA', side1_spec:'15', side2_product:'BELLA', side2_spec:'15', side3_product:'', side3_spec:'', rear_product:'BELLA', rear_spec:'15', glass_roof_product:'', glass_roof_spec:'', panorama_product:'', panorama_spec:'', dealer_id:'dealer-a001', installer_name:'A001 대리점', shop_name:'A001 대리점', shop_phone:'010-0000-0000', shop_address:'', warranty_image_url:null, kakao_sent:true,  sms_sent:false, created_at:'2026-03-02T10:00:00Z', updated_at:'2026-03-02T10:00:00Z' },
    { id:'w-a001-02', warranty_number:'26-SC-0305-1002', customer_name:'이서연', customer_car:'K8',      car_number:'34나 5678', customer_phone:'01023456782', customer_address:'경기도 성남시 분당구 정자동', car_vin:'KNACC3A17N6002002', service_date:'2026-03-05', service_price:1250000, front_product:'FLUX', front_spec:'20', side1_product:'FLUX', side1_spec:'15', side2_product:'FLUX', side2_spec:'15', side3_product:'', side3_spec:'', rear_product:'FLUX', rear_spec:'15', glass_roof_product:'ML Classic', glass_roof_spec:'15', panorama_product:'', panorama_spec:'', dealer_id:'dealer-a001', installer_name:'A001 대리점', shop_name:'A001 대리점', shop_phone:'010-0000-0000', shop_address:'', warranty_image_url:null, kakao_sent:true,  sms_sent:false, created_at:'2026-03-05T11:00:00Z', updated_at:'2026-03-05T11:00:00Z' },
    { id:'w-a001-03', warranty_number:'26-SC-0308-1003', customer_name:'박준혁', customer_car:'팰리세이드', car_number:'56다 7890', customer_phone:'01034567893', customer_address:'인천광역시 남동구 구월동', car_vin:'KM8SR4HF6NU003003', service_date:'2026-03-08', service_price:1680000, front_product:'BELLA', front_spec:'30', side1_product:'T1', side1_spec:'25', side2_product:'T1', side2_spec:'25', side3_product:'T1', side3_spec:'20', rear_product:'BELLA', rear_spec:'15', glass_roof_product:'ML Classic', glass_roof_spec:'20', panorama_product:'', panorama_spec:'', dealer_id:'dealer-a001', installer_name:'A001 대리점', shop_name:'A001 대리점', shop_phone:'010-0000-0000', shop_address:'', warranty_image_url:null, kakao_sent:false, sms_sent:false, created_at:'2026-03-08T09:30:00Z', updated_at:'2026-03-08T09:30:00Z' },
    { id:'w-a001-04', warranty_number:'26-SC-0312-1004', customer_name:'최유진', customer_car:'아반떼', car_number:'78라 1234', customer_phone:'01045678904', customer_address:'부산광역시 해운대구 우동', car_vin:'KMHD341KANU004004', service_date:'2026-03-12', service_price:480000, front_product:'VEGA', front_spec:'20', side1_product:'VEGA', side1_spec:'15', side2_product:'', side2_spec:'', side3_product:'', side3_spec:'', rear_product:'VEGA', rear_spec:'15', glass_roof_product:'', glass_roof_spec:'', panorama_product:'', panorama_spec:'', dealer_id:'dealer-a001', installer_name:'A001 대리점', shop_name:'A001 대리점', shop_phone:'010-0000-0000', shop_address:'', warranty_image_url:null, kakao_sent:true,  sms_sent:false, created_at:'2026-03-12T14:00:00Z', updated_at:'2026-03-12T14:00:00Z' },
    { id:'w-a001-05', warranty_number:'26-SC-0318-1005', customer_name:'정다은', customer_car:'투싼', car_number:'90마 2345', customer_phone:'01056789015', customer_address:'대전광역시 서구 둔산동', car_vin:'KM8J3CA46NU005005', service_date:'2026-03-18', service_price:890000, front_product:'T2', front_spec:'30', side1_product:'T2', side1_spec:'20', side2_product:'T2', side2_spec:'20', side3_product:'', side3_spec:'', rear_product:'T2', rear_spec:'20', glass_roof_product:'', glass_roof_spec:'', panorama_product:'', panorama_spec:'', dealer_id:'dealer-a001', installer_name:'A001 대리점', shop_name:'A001 대리점', shop_phone:'010-0000-0000', shop_address:'', warranty_image_url:null, kakao_sent:false, sms_sent:false, created_at:'2026-03-18T10:00:00Z', updated_at:'2026-03-18T10:00:00Z' },
    { id:'w-a001-06', warranty_number:'26-SC-0322-1006', customer_name:'강지호', customer_car:'GV80',    car_number:'11바 6789', customer_phone:'01067890126', customer_address:'대구광역시 수성구 범어동', car_vin:'KM8BR4HF0NU006006', service_date:'2026-03-22', service_price:2200000, front_product:'BELLA', front_spec:'17', side1_product:'BELLA', side1_spec:'15', side2_product:'BELLA', side2_spec:'15', side3_product:'', side3_spec:'', rear_product:'BELLA', rear_spec:'15', glass_roof_product:'ML Signature', glass_roof_spec:'20', panorama_product:'ML Signature', panorama_spec:'20', dealer_id:'dealer-a001', installer_name:'A001 대리점', shop_name:'A001 대리점', shop_phone:'010-0000-0000', shop_address:'', warranty_image_url:null, kakao_sent:true,  sms_sent:false, created_at:'2026-03-22T13:00:00Z', updated_at:'2026-03-22T13:00:00Z' },

    // ── A002 대리점 (6건) ──
    { id:'w-a002-01', warranty_number:'26-SC-0301-2001', customer_name:'윤서준', customer_car:'카니발', car_number:'33사 0123', customer_phone:'01078901237', customer_address:'광주광역시 북구 용봉동', car_vin:'KNDNB2A27N7001001', service_date:'2026-03-01', service_price:1100000, front_product:'FLUX', front_spec:'20', side1_product:'FLUX', side1_spec:'15', side2_product:'FLUX', side2_spec:'15', side3_product:'FLUX', side3_spec:'15', rear_product:'FLUX', rear_spec:'15', glass_roof_product:'', glass_roof_spec:'', panorama_product:'', panorama_spec:'', dealer_id:'dealer-a002', installer_name:'A002 대리점', shop_name:'A002 대리점', shop_phone:'010-0000-0000', shop_address:'', warranty_image_url:null, kakao_sent:true,  sms_sent:false, created_at:'2026-03-01T10:00:00Z', updated_at:'2026-03-01T10:00:00Z' },
    { id:'w-a002-02', warranty_number:'26-SC-0307-2002', customer_name:'장미래', customer_car:'EV6',    car_number:'55아 4567', customer_phone:'01089012348', customer_address:'울산광역시 남구 신정동', car_vin:'KNDC3DLD3N5002002', service_date:'2026-03-07', service_price:1350000, front_product:'BELLA', front_spec:'21', side1_product:'BELLA', side1_spec:'15', side2_product:'BELLA', side2_spec:'15', side3_product:'', side3_spec:'', rear_product:'BELLA', rear_spec:'15', glass_roof_product:'ML Classic', glass_roof_spec:'20', panorama_product:'', panorama_spec:'', dealer_id:'dealer-a002', installer_name:'A002 대리점', shop_name:'A002 대리점', shop_phone:'010-0000-0000', shop_address:'', warranty_image_url:null, kakao_sent:true,  sms_sent:false, created_at:'2026-03-07T11:30:00Z', updated_at:'2026-03-07T11:30:00Z' },
    { id:'w-a002-03', warranty_number:'26-SC-0311-2003', customer_name:'한지수', customer_car:'쏘나타', car_number:'77자 8901', customer_phone:'01090123459', customer_address:'경기도 수원시 영통구', car_vin:'KMHE341KANU003003', service_date:'2026-03-11', service_price:720000, front_product:'T1', front_spec:'25', side1_product:'T1', side1_spec:'20', side2_product:'', side2_spec:'', side3_product:'', side3_spec:'', rear_product:'T1', rear_spec:'20', glass_roof_product:'', glass_roof_spec:'', panorama_product:'', panorama_spec:'', dealer_id:'dealer-a002', installer_name:'A002 대리점', shop_name:'A002 대리점', shop_phone:'010-0000-0000', shop_address:'', warranty_image_url:null, kakao_sent:false, sms_sent:false, created_at:'2026-03-11T09:00:00Z', updated_at:'2026-03-11T09:00:00Z' },
    { id:'w-a002-04', warranty_number:'26-SC-0314-2004', customer_name:'신동현', customer_car:'K5',     car_number:'99카 2345', customer_phone:'01011234560', customer_address:'서울특별시 마포구 상암동', car_vin:'KM8CC4A20NU004004', service_date:'2026-03-14', service_price:560000, front_product:'VEGA', front_spec:'15', side1_product:'VEGA', side1_spec:'15', side2_product:'', side2_spec:'', side3_product:'', side3_spec:'', rear_product:'', rear_spec:'', glass_roof_product:'', glass_roof_spec:'', panorama_product:'', panorama_spec:'', dealer_id:'dealer-a002', installer_name:'A002 대리점', shop_name:'A002 대리점', shop_phone:'010-0000-0000', shop_address:'', warranty_image_url:null, kakao_sent:true,  sms_sent:false, created_at:'2026-03-14T15:00:00Z', updated_at:'2026-03-14T15:00:00Z' },
    { id:'w-a002-05', warranty_number:'26-SC-0319-2005', customer_name:'오혜린', customer_car:'그랜저', car_number:'22타 3456', customer_phone:'01022345671', customer_address:'경기도 고양시 일산동구 마두동', car_vin:'KMHGN41DPNU005005', service_date:'2026-03-19', service_price:1580000, front_product:'BELLA', front_spec:'30', side1_product:'BELLA', side1_spec:'15', side2_product:'BELLA', side2_spec:'15', side3_product:'', side3_spec:'', rear_product:'BELLA', rear_spec:'15', glass_roof_product:'ML Signature', glass_roof_spec:'30', panorama_product:'', panorama_spec:'', dealer_id:'dealer-a002', installer_name:'A002 대리점', shop_name:'A002 대리점', shop_phone:'010-0000-0000', shop_address:'', warranty_image_url:null, kakao_sent:false, sms_sent:false, created_at:'2026-03-19T10:30:00Z', updated_at:'2026-03-19T10:30:00Z' },
    { id:'w-a002-06', warranty_number:'26-SC-0324-2006', customer_name:'임태양', customer_car:'아이오닉6', car_number:'44나 7890', customer_phone:'01033456782', customer_address:'충청남도 천안시 서북구', car_vin:'KMHC041KBNU006006', service_date:'2026-03-24', service_price:940000, front_product:'T2', front_spec:'30', side1_product:'T2', side1_spec:'20', side2_product:'T2', side2_spec:'20', side3_product:'', side3_spec:'', rear_product:'T2', rear_spec:'20', glass_roof_product:'', glass_roof_spec:'', panorama_product:'', panorama_spec:'', dealer_id:'dealer-a002', installer_name:'A002 대리점', shop_name:'A002 대리점', shop_phone:'010-0000-0000', shop_address:'', warranty_image_url:null, kakao_sent:true,  sms_sent:false, created_at:'2026-03-24T13:00:00Z', updated_at:'2026-03-24T13:00:00Z' },

    // ── A003 대리점 (6건) ──
    { id:'w-a003-01', warranty_number:'26-SC-0303-3001', customer_name:'황수진', customer_car:'코나',    car_number:'66다 1234', customer_phone:'01044567893', customer_address:'전라북도 전주시 완산구', car_vin:'KM8K2CAA6NU001001', service_date:'2026-03-03', service_price:650000, front_product:'VEGA', front_spec:'20', side1_product:'VEGA', side1_spec:'15', side2_product:'', side2_spec:'', side3_product:'', side3_spec:'', rear_product:'VEGA', rear_spec:'15', glass_roof_product:'', glass_roof_spec:'', panorama_product:'', panorama_spec:'', dealer_id:'dealer-a003', installer_name:'A003 대리점', shop_name:'A003 대리점', shop_phone:'010-0000-0000', shop_address:'', warranty_image_url:null, kakao_sent:true,  sms_sent:false, created_at:'2026-03-03T10:00:00Z', updated_at:'2026-03-03T10:00:00Z' },
    { id:'w-a003-02', warranty_number:'26-SC-0306-3002', customer_name:'문성호', customer_car:'스타렉스', car_number:'88라 5678', customer_phone:'01055678904', customer_address:'경상남도 창원시 성산구', car_vin:'KMHWF37EP6U002002', service_date:'2026-03-06', service_price:820000, front_product:'FLUX', front_spec:'15', side1_product:'FLUX', side1_spec:'15', side2_product:'FLUX', side2_spec:'15', side3_product:'FLUX', side3_spec:'15', rear_product:'FLUX', rear_spec:'15', glass_roof_product:'', glass_roof_spec:'', panorama_product:'', panorama_spec:'', dealer_id:'dealer-a003', installer_name:'A003 대리점', shop_name:'A003 대리점', shop_phone:'010-0000-0000', shop_address:'', warranty_image_url:null, kakao_sent:false, sms_sent:false, created_at:'2026-03-06T09:30:00Z', updated_at:'2026-03-06T09:30:00Z' },
    { id:'w-a003-03', warranty_number:'26-SC-0310-3003', customer_name:'양지민', customer_car:'EV3',    car_number:'11마 9012', customer_phone:'01066789015', customer_address:'제주특별자치도 제주시 연동', car_vin:'KNDC3DLD3N5003003', service_date:'2026-03-10', service_price:780000, front_product:'T1', front_spec:'20', side1_product:'T1', side1_spec:'15', side2_product:'', side2_spec:'', side3_product:'', side3_spec:'', rear_product:'T1', rear_spec:'15', glass_roof_product:'', glass_roof_spec:'', panorama_product:'', panorama_spec:'', dealer_id:'dealer-a003', installer_name:'A003 대리점', shop_name:'A003 대리점', shop_phone:'010-0000-0000', shop_address:'', warranty_image_url:null, kakao_sent:true,  sms_sent:false, created_at:'2026-03-10T11:00:00Z', updated_at:'2026-03-10T11:00:00Z' },
    { id:'w-a003-04', warranty_number:'26-SC-0315-3004', customer_name:'배현우', customer_car:'K8',     car_number:'33바 3456', customer_phone:'01077890126', customer_address:'경기도 용인시 기흥구 보정동', car_vin:'KNACC3A17N6004004', service_date:'2026-03-15', service_price:1420000, front_product:'BELLA', front_spec:'30', side1_product:'BELLA', side1_spec:'15', side2_product:'BELLA', side2_spec:'15', side3_product:'', side3_spec:'', rear_product:'BELLA', rear_spec:'15', glass_roof_product:'ML Classic', glass_roof_spec:'20', panorama_product:'', panorama_spec:'', dealer_id:'dealer-a003', installer_name:'A003 대리점', shop_name:'A003 대리점', shop_phone:'010-0000-0000', shop_address:'', warranty_image_url:null, kakao_sent:true,  sms_sent:false, created_at:'2026-03-15T13:00:00Z', updated_at:'2026-03-15T13:00:00Z' },
    { id:'w-a003-05', warranty_number:'26-SC-0320-3005', customer_name:'남소희', customer_car:'팰리세이드', car_number:'55사 7890', customer_phone:'01088901237', customer_address:'서울특별시 송파구 잠실동', car_vin:'KM8SR4HF6NU005005', service_date:'2026-03-20', service_price:1750000, front_product:'BELLA', front_spec:'17', side1_product:'T2', side1_spec:'20', side2_product:'T2', side2_spec:'20', side3_product:'T2', side3_spec:'15', rear_product:'BELLA', rear_spec:'15', glass_roof_product:'', glass_roof_spec:'', panorama_product:'ML Signature Green', panorama_spec:'20', dealer_id:'dealer-a003', installer_name:'A003 대리점', shop_name:'A003 대리점', shop_phone:'010-0000-0000', shop_address:'', warranty_image_url:null, kakao_sent:false, sms_sent:false, created_at:'2026-03-20T10:00:00Z', updated_at:'2026-03-20T10:00:00Z' },
    { id:'w-a003-06', warranty_number:'26-SC-0325-3006', customer_name:'조민재', customer_car:'아이오닉5', car_number:'77아 1234', customer_phone:'01099012348', customer_address:'경기도 화성시 동탄면', car_vin:'5YJ3E1EA1NF006006', service_date:'2026-03-25', service_price:1050000, front_product:'FLUX', front_spec:'20', side1_product:'FLUX', side1_spec:'15', side2_product:'FLUX', side2_spec:'15', side3_product:'', side3_spec:'', rear_product:'FLUX', rear_spec:'15', glass_roof_product:'ML Classic', glass_roof_spec:'15', panorama_product:'', panorama_spec:'', dealer_id:'dealer-a003', installer_name:'A003 대리점', shop_name:'A003 대리점', shop_phone:'010-0000-0000', shop_address:'', warranty_image_url:null, kakao_sent:true,  sms_sent:false, created_at:'2026-03-25T14:00:00Z', updated_at:'2026-03-25T14:00:00Z' },

    // ── A004 대리점 (6건) ──
    { id:'w-a004-01', warranty_number:'26-SC-0304-4001', customer_name:'전예린', customer_car:'그랜저', car_number:'99자 5678', customer_phone:'01010123451', customer_address:'서울특별시 강서구 화곡동', car_vin:'KMHGN41DPNU001001', service_date:'2026-03-04', service_price:1380000, front_product:'BELLA', front_spec:'30', side1_product:'BELLA', side1_spec:'15', side2_product:'BELLA', side2_spec:'15', side3_product:'', side3_spec:'', rear_product:'BELLA', rear_spec:'15', glass_roof_product:'ML Signature', glass_roof_spec:'20', panorama_product:'', panorama_spec:'', dealer_id:'dealer-a004', installer_name:'A004 대리점', shop_name:'A004 대리점', shop_phone:'010-0000-0000', shop_address:'', warranty_image_url:null, kakao_sent:true,  sms_sent:false, created_at:'2026-03-04T10:00:00Z', updated_at:'2026-03-04T10:00:00Z' },
    { id:'w-a004-02', warranty_number:'26-SC-0309-4002', customer_name:'서강준', customer_car:'투싼',   car_number:'22카 9012', customer_phone:'01021234562', customer_address:'경기도 남양주시 별내동', car_vin:'KM8J3CA46NU002002', service_date:'2026-03-09', service_price:730000, front_product:'T1', front_spec:'25', side1_product:'T1', side1_spec:'20', side2_product:'', side2_spec:'', side3_product:'', side3_spec:'', rear_product:'T1', rear_spec:'20', glass_roof_product:'', glass_roof_spec:'', panorama_product:'', panorama_spec:'', dealer_id:'dealer-a004', installer_name:'A004 대리점', shop_name:'A004 대리점', shop_phone:'010-0000-0000', shop_address:'', warranty_image_url:null, kakao_sent:false, sms_sent:false, created_at:'2026-03-09T09:00:00Z', updated_at:'2026-03-09T09:00:00Z' },
    { id:'w-a004-03', warranty_number:'26-SC-0313-4003', customer_name:'노은지', customer_car:'카니발', car_number:'44타 3456', customer_phone:'01031234573', customer_address:'충청북도 청주시 청원구', car_vin:'KNDNB2A27N7003003', service_date:'2026-03-13', service_price:1150000, front_product:'VEGA', front_spec:'20', side1_product:'VEGA', side1_spec:'15', side2_product:'VEGA', side2_spec:'15', side3_product:'VEGA', side3_spec:'15', rear_product:'VEGA', rear_spec:'15', glass_roof_product:'', glass_roof_spec:'', panorama_product:'', panorama_spec:'', dealer_id:'dealer-a004', installer_name:'A004 대리점', shop_name:'A004 대리점', shop_phone:'010-0000-0000', shop_address:'', warranty_image_url:null, kakao_sent:true,  sms_sent:false, created_at:'2026-03-13T13:30:00Z', updated_at:'2026-03-13T13:30:00Z' },
    { id:'w-a004-04', warranty_number:'26-SC-0316-4004', customer_name:'권태민', customer_car:'EV6',    car_number:'66나 7890', customer_phone:'01041234584', customer_address:'강원도 춘천시 효자동', car_vin:'KNDC3DLD3N5004004', service_date:'2026-03-16', service_price:1190000, front_product:'FLUX', front_spec:'20', side1_product:'FLUX', side1_spec:'15', side2_product:'FLUX', side2_spec:'15', side3_product:'', side3_spec:'', rear_product:'FLUX', rear_spec:'15', glass_roof_product:'ML Classic', glass_roof_spec:'15', panorama_product:'', panorama_spec:'', dealer_id:'dealer-a004', installer_name:'A004 대리점', shop_name:'A004 대리점', shop_phone:'010-0000-0000', shop_address:'', warranty_image_url:null, kakao_sent:true,  sms_sent:false, created_at:'2026-03-16T10:00:00Z', updated_at:'2026-03-16T10:00:00Z' },
    { id:'w-a004-05', warranty_number:'26-SC-0321-4005', customer_name:'손지우', customer_car:'GV80',   car_number:'88다 1234', customer_phone:'01051234595', customer_address:'경기도 파주시 운정동', car_vin:'KM8BR4HF0NU005005', service_date:'2026-03-21', service_price:2450000, front_product:'BELLA', front_spec:'17', side1_product:'BELLA', side1_spec:'15', side2_product:'BELLA', side2_spec:'15', side3_product:'', side3_spec:'', rear_product:'BELLA', rear_spec:'15', glass_roof_product:'ML Signature', glass_roof_spec:'30', panorama_product:'ML Signature', panorama_spec:'30', dealer_id:'dealer-a004', installer_name:'A004 대리점', shop_name:'A004 대리점', shop_phone:'010-0000-0000', shop_address:'', warranty_image_url:null, kakao_sent:false, sms_sent:false, created_at:'2026-03-21T11:00:00Z', updated_at:'2026-03-21T11:00:00Z' },
    { id:'w-a004-06', warranty_number:'26-SC-0326-4006', customer_name:'석현빈', customer_car:'K5',     car_number:'11라 5678', customer_phone:'01061234506', customer_address:'경기도 안양시 동안구', car_vin:'KM8CC4A20NU006006', service_date:'2026-03-26', service_price:610000, front_product:'T2', front_spec:'20', side1_product:'T2', side1_spec:'15', side2_product:'', side2_spec:'', side3_product:'', side3_spec:'', rear_product:'T2', rear_spec:'15', glass_roof_product:'', glass_roof_spec:'', panorama_product:'', panorama_spec:'', dealer_id:'dealer-a004', installer_name:'A004 대리점', shop_name:'A004 대리점', shop_phone:'010-0000-0000', shop_address:'', warranty_image_url:null, kakao_sent:true,  sms_sent:false, created_at:'2026-03-26T14:00:00Z', updated_at:'2026-03-26T14:00:00Z' },

    // ── A005 대리점 (6건) ──
    { id:'w-a005-01', warranty_number:'26-SC-0302-5001', customer_name:'하나영', customer_car:'아반떼', car_number:'33마 9012', customer_phone:'01071234517', customer_address:'서울특별시 도봉구 창동', car_vin:'KMHD341KANU001001', service_date:'2026-03-02', service_price:430000, front_product:'VEGA', front_spec:'15', side1_product:'VEGA', side1_spec:'10', side2_product:'', side2_spec:'', side3_product:'', side3_spec:'', rear_product:'', rear_spec:'', glass_roof_product:'', glass_roof_spec:'', panorama_product:'', panorama_spec:'', dealer_id:'dealer-a005', installer_name:'A005 대리점', shop_name:'A005 대리점', shop_phone:'010-0000-0000', shop_address:'', warranty_image_url:null, kakao_sent:true,  sms_sent:false, created_at:'2026-03-02T09:00:00Z', updated_at:'2026-03-02T09:00:00Z' },
    { id:'w-a005-02', warranty_number:'26-SC-0307-5002', customer_name:'류승원', customer_car:'쏘나타', car_number:'55바 3456', customer_phone:'01081234528', customer_address:'경기도 의정부시 신곡동', car_vin:'KMHE341KANU002002', service_date:'2026-03-07', service_price:790000, front_product:'T1', front_spec:'25', side1_product:'T1', side1_spec:'20', side2_product:'T1', side2_spec:'20', side3_product:'', side3_spec:'', rear_product:'T1', rear_spec:'20', glass_roof_product:'', glass_roof_spec:'', panorama_product:'', panorama_spec:'', dealer_id:'dealer-a005', installer_name:'A005 대리점', shop_name:'A005 대리점', shop_phone:'010-0000-0000', shop_address:'', warranty_image_url:null, kakao_sent:false, sms_sent:false, created_at:'2026-03-07T10:00:00Z', updated_at:'2026-03-07T10:00:00Z' },
    { id:'w-a005-03', warranty_number:'26-SC-0312-5003', customer_name:'민지현', customer_car:'아이오닉6', car_number:'77사 7890', customer_phone:'01091234539', customer_address:'인천광역시 부평구 부개동', car_vin:'KMHC041KBNU003003', service_date:'2026-03-12', service_price:1080000, front_product:'BELLA', front_spec:'21', side1_product:'BELLA', side1_spec:'15', side2_product:'BELLA', side2_spec:'15', side3_product:'', side3_spec:'', rear_product:'BELLA', rear_spec:'15', glass_roof_product:'', glass_roof_spec:'', panorama_product:'', panorama_spec:'', dealer_id:'dealer-a005', installer_name:'A005 대리점', shop_name:'A005 대리점', shop_phone:'010-0000-0000', shop_address:'', warranty_image_url:null, kakao_sent:true,  sms_sent:false, created_at:'2026-03-12T13:00:00Z', updated_at:'2026-03-12T13:00:00Z' },
    { id:'w-a005-04', warranty_number:'26-SC-0317-5004', customer_name:'고수빈', customer_car:'EV3',    car_number:'99아 1234', customer_phone:'01012341230', customer_address:'경기도 시흥시 정왕동', car_vin:'KNDC3DLD3N5004004', service_date:'2026-03-17', service_price:680000, front_product:'FLUX', front_spec:'20', side1_product:'FLUX', side1_spec:'15', side2_product:'', side2_spec:'', side3_product:'', side3_spec:'', rear_product:'FLUX', rear_spec:'15', glass_roof_product:'', glass_roof_spec:'', panorama_product:'', panorama_spec:'', dealer_id:'dealer-a005', installer_name:'A005 대리점', shop_name:'A005 대리점', shop_phone:'010-0000-0000', shop_address:'', warranty_image_url:null, kakao_sent:true,  sms_sent:false, created_at:'2026-03-17T11:30:00Z', updated_at:'2026-03-17T11:30:00Z' },
    { id:'w-a005-05', warranty_number:'26-SC-0322-5005', customer_name:'차민성', customer_car:'K8',     car_number:'22자 5678', customer_phone:'01023452341', customer_address:'경기도 광주시 오포읍', car_vin:'KNACC3A17N6005005', service_date:'2026-03-22', service_price:1480000, front_product:'BELLA', front_spec:'30', side1_product:'BELLA', side1_spec:'15', side2_product:'BELLA', side2_spec:'15', side3_product:'', side3_spec:'', rear_product:'BELLA', rear_spec:'15', glass_roof_product:'ML Signature', glass_roof_spec:'20', panorama_product:'', panorama_spec:'', dealer_id:'dealer-a005', installer_name:'A005 대리점', shop_name:'A005 대리점', shop_phone:'010-0000-0000', shop_address:'', warranty_image_url:null, kakao_sent:false, sms_sent:false, created_at:'2026-03-22T10:30:00Z', updated_at:'2026-03-22T10:30:00Z' },
    { id:'w-a005-06', warranty_number:'26-SC-0327-5006', customer_name:'백아린', customer_car:'스타렉스', car_number:'44카 9012', customer_phone:'01034563452', customer_address:'경기도 포천시 소흘읍', car_vin:'KMHWF37EP6U006006', service_date:'2026-03-27', service_price:870000, front_product:'T2', front_spec:'30', side1_product:'T2', side1_spec:'20', side2_product:'T2', side2_spec:'20', side3_product:'T2', side3_spec:'20', rear_product:'T2', rear_spec:'20', glass_roof_product:'', glass_roof_spec:'', panorama_product:'', panorama_spec:'', dealer_id:'dealer-a005', installer_name:'A005 대리점', shop_name:'A005 대리점', shop_phone:'010-0000-0000', shop_address:'', warranty_image_url:null, kakao_sent:true,  sms_sent:false, created_at:'2026-03-27T09:00:00Z', updated_at:'2026-03-27T09:00:00Z' },
  ],
};

// ── localStorage 초기화 (버전 기반 — 구조 변경 시 자동 리셋) ──
const DEMO_VERSION = 'v11'; // 구조 바뀔 때 올려주세요

function initDemoData() {
  if (localStorage.getItem('demo_version') !== DEMO_VERSION) {
    // 버전 불일치 → 전체 리셋
    localStorage.setItem('demo_users',     JSON.stringify(SEED_DATA.users));
    localStorage.setItem('demo_warranties',JSON.stringify(SEED_DATA.warranties));
    localStorage.setItem('demo_products',  JSON.stringify(SEED_DATA.products));
    localStorage.setItem('demo_popups',    JSON.stringify([]));
    localStorage.setItem('demo_version',   DEMO_VERSION);
    localStorage.setItem('demo_initialized', '1');
  }
}

function getUsers()     { initDemoData(); return JSON.parse(localStorage.getItem('demo_users') || '[]'); }
function saveUsers(users){ localStorage.setItem('demo_users', JSON.stringify(users)); }
function getWarranties(){ return JSON.parse(localStorage.getItem('demo_warranties') || '[]'); }
function saveWarranties(ws){ localStorage.setItem('demo_warranties', JSON.stringify(ws)); }

// ── 재고 이력 ──
function getInventoryLogs(){ return JSON.parse(localStorage.getItem('smith_inventory_log') || '[]'); }
function saveInventoryLogs(logs){ localStorage.setItem('smith_inventory_log', JSON.stringify(logs)); }
function addInventoryLog(dealerId, productName, spec, delta, type, note) {
  const logs = getInventoryLogs();
  logs.unshift({
    id: 'log-' + Date.now() + Math.random().toString(36).slice(2,6),
    dealer_id: dealerId,
    product_name: productName,
    spec: String(spec).replace('%',''),
    delta,          // 양수=입고, 음수=출고(미터)
    type,           // 'in' | 'deduct' | 'adjust'
    note: note || '',
    created_at: new Date().toISOString(),
  });
  saveInventoryLogs(logs);
}
function getPopups()    { initDemoData(); return JSON.parse(localStorage.getItem('demo_popups') || '[]'); }
function savePopups(ps) { localStorage.setItem('demo_popups', JSON.stringify(ps)); }

// 제품/사양 getter & setter
function getProducts()  { initDemoData(); return JSON.parse(localStorage.getItem('demo_products') || '[]'); }
function getSpecs()     { initDemoData(); return JSON.parse(localStorage.getItem('demo_specs') || '[]'); }
function saveProducts(p){ localStorage.setItem('demo_products', JSON.stringify(p)); }
function saveSpecs(s)   { localStorage.setItem('demo_specs',    JSON.stringify(s)); }

function getInventory() {
  const raw = localStorage.getItem('smith_inventory');
  if (raw) return JSON.parse(raw);
  const initial = JSON.parse(JSON.stringify(SEED_DATA.inventory));
  localStorage.setItem('smith_inventory', JSON.stringify(initial));
  return initial;
}

function saveInventory(data) {
  localStorage.setItem('smith_inventory', JSON.stringify(data));
}

// ── 1롤 차감 설정 ──
const DEFAULT_DEDUCTION_CONFIG = {
  roll_length: 33,
  positions: {
    front:      1.5,
    side1:      0.5,
    side2:      0.3,
    side3:      0.2,
    rear:       1.0,
    glass_roof: 0.7,
    panorama:   1.4,
  }
};
function getDeductionConfig() {
  const raw = localStorage.getItem('smith_deduction_config');
  if (raw) return JSON.parse(raw);
  return JSON.parse(JSON.stringify(DEFAULT_DEDUCTION_CONFIG));
}
function saveDeductionConfig(cfg) {
  localStorage.setItem('smith_deduction_config', JSON.stringify(cfg));
}

// 재고 미터 차감 (보증서 등록 시 호출)
function deductInventoryMeters(dealerId, positions) {
  // positions: [{ key, product_name, spec }]
  const cfg = getDeductionConfig();
  const inv = getInventory();
  let changed = false;

  for (const pos of positions) {
    if (!pos.product_name || !pos.spec) continue;
    const meters = cfg.positions[pos.key] || 0;
    if (meters === 0) continue;

    // spec 값에서 '%' 제거
    const specVal = pos.spec.replace('%', '');
    let item = inv.find(i =>
      i.dealer_id === dealerId &&
      i.product_name === pos.product_name &&
      i.spec === specVal
    );
    if (!item) {
      // 재고 없으면 생성 (마이너스 허용)
      item = { id: 'inv-' + Date.now() + Math.random(), dealer_id: dealerId, product_name: pos.product_name, spec: specVal, quantity: 0, used_meters: 0 };
      inv.push(item);
    }
    if (item.used_meters === undefined) item.used_meters = 0;
    item.used_meters = Math.round((item.used_meters + meters) * 100) / 100;
    // 이력 기록
    addInventoryLog(dealerId, pos.product_name, specVal, -meters, 'deduct', `보증서 시공 차감 (${pos.key})`);
    changed = true;
  }

  if (changed) saveInventory(inv);
}

// 잔여 미터 계산
function getRemainingMeters(item) {
  const cfg = getDeductionConfig();
  const total = (item.quantity || 0) * cfg.roll_length;
  const used  = item.used_meters || 0;
  return Math.round((total - used) * 100) / 100;
}

// 활성 제품 이름 목록 (드롭다운용)
function getActiveProductNames() {
  return ['', ...getProducts().filter(p => p.active).map(p => p.name)];
}
// 특정 제품명에 해당하는 농도 목록
function getSpecsByProductName(name) {
  if (!name) return [];
  const prod = getProducts().find(p => p.name === name && p.active);
  return prod ? (prod.specs || []) : [];
}

// ── Mock Supabase Client ──
const supabaseClient = {

  // AUTH
  auth: {
    _session: null,

    async signInWithPassword({ email, password }) {
      initDemoData();
      const users = getUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (!user) return { data: {}, error: { message: '아이디 또는 비밀번호가 올바르지 않습니다.' } };
      if (user.role === 'dealer' && user.active === false) {
        return { data: {}, error: { message: '비활성화된 대리점 계정입니다. 관리자에게 문의하세요.' } };
      }
      const session = { user: { id: user.id, email: user.email } };
      this._session = session;
      localStorage.setItem('demo_session', JSON.stringify(session));
      return { data: { session }, error: null };
    },

    async getSession() {
      initDemoData();
      const raw = localStorage.getItem('demo_session');
      if (!raw) return { data: { session: null } };
      return { data: { session: JSON.parse(raw) } };
    },

    async signOut() {
      localStorage.removeItem('demo_session');
      return { error: null };
    },
  },

  // DATABASE (간단한 쿼리 체이닝 지원)
  from(table) {
    return new MockQuery(table);
  },

  // STORAGE (이미지 업로드 mock)
  storage: {
    from(bucket) {
      return {
        async upload(path, blob) {
          // 실제 업로드 대신 base64 URL로 저장
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              const urls = JSON.parse(localStorage.getItem('demo_storage') || '{}');
              urls[path] = reader.result;
              localStorage.setItem('demo_storage', JSON.stringify(urls));
              resolve({ data: { path }, error: null });
            };
            reader.readAsDataURL(blob);
          });
        },
        getPublicUrl(path) {
          const urls = JSON.parse(localStorage.getItem('demo_storage') || '{}');
          return { data: { publicUrl: urls[path] || '' } };
        },
      };
    },
  },

  // EDGE FUNCTIONS (mock)
  functions: {
    async invoke(name, { body }) {
      console.log('[Demo] Edge Function 호출:', name, body);
      return { data: { success: true, message: '데모 모드: 실제 발송은 Supabase 연결 후 가능합니다.' }, error: null };
    },
  },
};

// ── Mock Query Builder ──
class MockQuery {
  constructor(table) {
    this.table = table;
    this._filters = [];
    this._order = null;
    this._single = false;
    this._insertData = null;
    this._updateData = null;
    this._action = 'select';
  }

  select(cols) { this._action = 'select'; return this; }

  insert(rows) {
    this._action = 'insert';
    this._insertData = Array.isArray(rows) ? rows : [rows];
    return this;
  }

  update(data) {
    this._action = 'update';
    this._updateData = data;
    return this;
  }

  eq(col, val)   { this._filters.push({ type: 'eq',   col, val }); return this; }
  neq(col, val)  { this._filters.push({ type: 'neq',  col, val }); return this; }
  gte(col, val)  { this._filters.push({ type: 'gte',  col, val }); return this; }
  lte(col, val)  { this._filters.push({ type: 'lte',  col, val }); return this; }
  ilike(col, val){ this._filters.push({ type: 'ilike',col, val }); return this; }

  or(expr) {
    // 간단한 or 파싱 (customer_name.ilike.%검색어%)
    this._filters.push({ type: 'or', expr }); return this;
  }

  order(col, { ascending } = {}) { this._order = { col, ascending }; return this; }
  single() { this._single = true; return this; }
  limit(n) { this._limit = n; return this; }

  // 실제 실행
  then(resolve) { return this._execute().then(resolve); }

  async _execute() {
    initDemoData();

    if (this.table === 'profiles') {
      return this._execProfiles();
    }
    if (this.table === 'warranties') {
      return this._execWarranties();
    }
    return { data: null, error: { message: '알 수 없는 테이블: ' + this.table } };
  }

  _execProfiles() {
    const users = getUsers();
    const session = JSON.parse(localStorage.getItem('demo_session') || 'null');

    if (this._action === 'select') {
      let results = users.map(u => ({
        id: u.id,
        role: u.role,
        dealer_name: u.dealer_name,
        dealer_phone: u.dealer_phone,
        dealer_address: u.dealer_address,
      }));

      // 필터 적용
      for (const f of this._filters) {
        if (f.type === 'eq') results = results.filter(r => r[f.col] == f.val);
      }

      if (this._single) {
        return { data: results[0] || null, error: results[0] ? null : { message: 'No rows found' } };
      }
      return { data: results, error: null };
    }
    return { data: null, error: null };
  }

  _execWarranties() {
    if (this._action === 'insert') {
      const ws = getWarranties();
      const newW = { ...this._insertData[0], id: 'w-' + Date.now(), created_at: new Date().toISOString() };
      ws.unshift(newW);
      saveWarranties(ws);
      return { data: newW, error: null };
    }

    if (this._action === 'update') {
      const ws = getWarranties();
      let target = ws;
      for (const f of this._filters) {
        if (f.type === 'eq') target = target.filter(r => r[f.col] == f.val);
      }
      if (target.length > 0) {
        const idx = ws.findIndex(w => w.id === target[0].id);
        if (idx > -1) ws[idx] = { ...ws[idx], ...this._updateData };
        saveWarranties(ws);
      }
      return { data: null, error: null };
    }

    // SELECT
    let ws = getWarranties();

    // 아카이브된 보증서는 기본 제외 (includeArchived 필터가 있을 때만 포함)
    const wantsArchived = this._filters.some(f => f.type === 'eq' && f.col === 'archived');
    if (!wantsArchived) {
      ws = ws.filter(r => !r.archived);
    }

    // 필터 적용
    for (const f of this._filters) {
      if (f.type === 'eq')   ws = ws.filter(r => String(r[f.col]) === String(f.val));
      if (f.type === 'gte')  ws = ws.filter(r => r[f.col] >= f.val);
      if (f.type === 'lte')  ws = ws.filter(r => r[f.col] <= f.val);
      if (f.type === 'ilike'){
        const keyword = f.val.replace(/%/g,'').toLowerCase();
        ws = ws.filter(r => String(r[f.col]||'').toLowerCase().includes(keyword));
      }
      if (f.type === 'or') {
        const parts = f.expr.split(',');
        ws = ws.filter(row => parts.some(part => {
          const [col, op, rawVal] = part.split('.');
          const val = rawVal.replace(/%/g,'').toLowerCase();
          return String(row[col]||'').toLowerCase().includes(val);
        }));
      }
    }

    // 정렬
    if (this._order) {
      ws.sort((a, b) => {
        const aVal = a[this._order.col], bVal = b[this._order.col];
        return this._order.ascending
          ? aVal > bVal ? 1 : -1
          : aVal < bVal ? 1 : -1;
      });
    }

    if (this._single) {
      return { data: ws[0] || null, error: ws[0] ? null : { message: 'No rows found' } };
    }

    return { data: ws, error: null };
  }
}
