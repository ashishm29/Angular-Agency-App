export class AppConstant {
  static readonly AGENCY_COLLECTION_NAME: string = 'AgencyCollection';
  static readonly USER_COLLECTION_NAME: string = 'UserCollection';
  static readonly ROUTE_COLLECTION_NAME: string = 'RouteCollection';
  static readonly STORE_COLLECTION_NAME: string = 'StoreCollection';
  static readonly BILL_COLLECTION_NAME: string = 'BillCollection';
  static readonly RECOVERY_COLLECTION_NAME: string = 'RecoveryCollection';
  static readonly PAYMENT_MODE_COLLECTION_NAME: string =
    'PaymentModeCollection';

  static readonly DEFAULT_DATE_TIME_FORMAT: string = 'MM/dd/YYYY';
  static readonly DATE_TIME_FORMAT: string = 'yyyy-MM-dd HH:mm:ss';

  static readonly SAVE_ACTION: string = 'Saved';
  static readonly UPDAE_ACTION: string = 'Updated';
  static readonly DELETE_ACTION: string = 'Deleted';
  static readonly BILL_ADDED_SUCCESS_MSG: string = 'Bill added Successfully';
  static readonly STORE_ADDED_SUCCESS_MSG: string = 'Store added Successfully';
  static readonly ROUTE_ADDED_SUCCESS_MSG: string = 'Route added Successfully';
  static readonly RECOVERY_ADDED_SUCCESS_MSG: string =
    'Recovery details added Successfully';
  static readonly BILL_UPDATED_SUCCESS_MSG: string =
    'Bill details updated Successfully';
  static readonly BILL_DELETED_SUCCESS_MSG: string =
    'Bill deleted successfully...';

  static readonly ROUTE_NOT_FOUND_MSG: string = 'No Route details found...';
  static readonly STORE_NOT_FOUND_MSG: string = 'No Store details found...';

  static readonly PAYMENT_MODES_NOT_FOUND_MSG: string =
    'No payment modes found...';
}
