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

export type DailyPriceChange = {
  ProductID: number;
  Price: number;
};

export type DisplayedProductData = { [key: string]: number };

type Price = { ProductID: number; Price: number };

export type CommonSave = {
  ___type: string;
  value: {
    Purchased?: boolean;
    StorageLevel?: number;
    CashiersData?: Array<number>;
    RestockersData?: Array<number>;
    UnlockedLicenses?: Array<number>;
    Bills?: Array<ExpensesSave>;
    Rents?: Array<ExpensesSave>;
    Money?: number;
    RackDatas?: Array<RackData>;
    DisplayedProductData?: DisplayedProductData;
    DailyPriceChanges?: DailyPriceChange[];
    PreviousPrices?: Array<Price>;
    Prices?: Array<Price>;
    PricesSetByPlayer: Array<Price>;
    AverageCosts: Array<Price>;
    BoxDatas: Array<{
      ProductID: number;
      ProductCount: number;
      IsOpen: boolean;
    }>;
  };
};

export type lngType = 'en' | 'fr' | 'es' | 'de' | 'nl' | 'it';

export type Item = {
  id: string;
  img: string;
  brand: string;
  name: { [key in lngType]: string };
  quantity: string;
  storageType: string;
};

export type AssociatedItem = {
  item: Item;
  rackCount: number;
  storeCount: number;
  marketPrice?: number;
  userPrice?: number;
  averageCost?: number;
  quantityByUser: string;
  boxToBuy: number;
  stockage: number; // countRack + countStore?
};

export type AssociatedItems = AssociatedItem[];

type SaveFileType = {
  Storage: CommonSave;
  Employees: CommonSave;
  Expenses: CommonSave;
  Price: CommonSave;
  Onboarding: CommonSave;
  Quality: CommonSave;
  Progression: CommonSave;
};

export type QuantityUserFile = {
  id: string;
  quantity: string;
};

export type OrderBy = 'box' | 'default' | 'name';

export default SaveFileType;
