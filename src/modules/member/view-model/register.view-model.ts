
interface RegisterViewModel {
  account: string;      // 帳號-必填
  password: string;     // 密碼-必填
  email: string;        // 信箱-必填
  phoneNumber: string;  // 電話-必填
  userType: 'P' | 'B';  // 用戶分類-必填  P:學生/老師 B:企業
  address?: string;     // 地址
  birthday: Date;    // 生日-個人用戶必填
  realName: string;    // 真實姓名-個人用戶-必填
  nickName: string;    // 暱稱-個人用戶-必填
  roleType: RoleType;    // 個人用戶-必填 1:學生 2:老師
  store?: StoreDetails;
  teacherInfo?: TeacherInfo;
  isApplyTeacher: boolean // 是否申請老師
}

enum RoleType {
  Student = 1,
  Teacher = 2,
}

/**
 * 店家-企業必填
 */
interface StoreDetails {
  storeName: string;  // 店家名稱 - 必填
  storePhoneNumber: string;  // 店家電話 - 必填
  storeAddress?: string;  // 店家地址
  storeEmail?: string;  // 店家信箱
  taxNumber?: string;  // 店家統一編號
  website?: string;  // 店家網站
  businessTime: WeeklySchedule;  // 營業時間
}


/**
 * 老師身份
 */

interface TeacherInfo {
  title: string;          // 頭銜-必填
  skill?: string;         // 介紹
  experiences?: string;   // 簡歷
  businessTime: WeeklySchedule;  // 營業時間
}

/**
 * 營業時間
 */
interface ClassTime {
  start?: string; // ex: 09:00
  end?: string; // ex: 18:00
  isOpen: boolean; // 是否開放
}

/**
 * 一週營業時間
 */
interface WeeklySchedule {
  monday: ClassTime;
  tuesday: ClassTime;
  wednesday: ClassTime;
  thursday: ClassTime;
  friday: ClassTime;
  saturday: ClassTime;
  sunday: ClassTime;
}