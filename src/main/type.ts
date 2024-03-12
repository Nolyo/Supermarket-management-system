type ExpensesSave = {
  Date: number;
  Amount: number;
  PaymentType: number;
  LatePaymentFee: number;
};

type RackedBoxData = {
  BoxID: number;
  ProductID: number;
  IsOpen: boolean;
  ProductCount: number;
  size: number;
};

type RackSlot = {
  RackedBoxDatas: Array<RackedBoxData>;
  ProductID: number;
  BoxID: number;
};

export type RackData = {
  Transform: Object;
  RackSlots: Array<RackSlot>;
};

export type DisplayedProductData = { [key: string]: number };

export type CommonSave = {
  ___type: string;
  value: {
    Purchased?: boolean;
    StorageLevel?: number;
    CashiersData?: Array<number>;
    UnlockedLicenses?: Array<number>;
    Bills?: Array<ExpensesSave>;
    Rents?: Array<ExpensesSave>;
    Money?: number;
    RackDatas?: Array<RackData>;
    DisplayedProductData?: DisplayedProductData;
  };
};

type SaveFileType = {
  Storage: CommonSave;
  Employees: CommonSave;
  Expenses: CommonSave;
  Price: CommonSave;
  Onboarding: CommonSave;
  Quality: CommonSave;
  Progression: CommonSave;
};

export type Item = {
  id: string;
  img: string;
  brand: string;
  name: string;
  quantity: string;
  storageType: string;
};

export type AssociatedItem = {
  [key: number]: { rackCount?: number; item: Item; storeCount?: number };
};

export default SaveFileType;
