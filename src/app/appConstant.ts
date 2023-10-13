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
  static readonly DATE_TIME_FORMAT: string = 'dd/MM/yyyy HH:mm:ss';

  static readonly SAVE_ACTION: string = 'Saved';
  static readonly UPDAE_ACTION: string = 'Updated';
  static readonly DELETE_ACTION: string = 'Deleted';
  static readonly SEARCH_ACTION: string = 'Search';
  static readonly YES_ACTION: string = 'Yes';
  static readonly NO_ACTION: string = 'No';
  static readonly ERROR_ACTION: string = 'Error';

  static readonly BILL_ADDED_SUCCESS_MSG: string = 'Bill added Successfully';
  static readonly STORE_ADDED_SUCCESS_MSG: string = 'Store added Successfully';
  static readonly ROUTE_ADDED_SUCCESS_MSG: string = 'Route added Successfully';
  static readonly RECOVERY_ADDED_SUCCESS_MSG: string =
    'Recovery details added Successfully';

  static readonly BILL_DELETED_SUCCESS_MSG: string =
    'Bill deleted successfully...';
  static readonly ROUTE_DELETED_SUCCESS_MSG: string =
    'Route deleted Successfully';
  static readonly STORE_DELETED_SUCCESS_MSG: string =
    'Store deleted Successfully';
  static readonly RECOVERY_DELETED_SUCCESS_MSG: string =
    'Recovery deleted Successfully';

  static readonly ROUTE_NOT_FOUND_MSG: string = 'No Route details found...';
  static readonly STORE_NOT_FOUND_MSG: string = 'No Store details found...';
  static readonly BILL_NOT_FOUND_MSG: string = 'Bill details not found...';

  static readonly ROUTE_UPDATED_SUCCESS_MSG: string =
    'Route updated Successfully';
  static readonly STORE_UPDATED_SUCCESS_MSG: string =
    'Store updated Successfully';
  static readonly BILL_UPDATED_SUCCESS_MSG: string =
    'Bill details updated Successfully';

  static readonly STORE_UPDATED_FAILED_MSG: string = 'Store updated failed...';

  static readonly STORE_FORM_INVALID_MSG: string = 'Store form is invalid...';

  static readonly PAYMENT_MODES_NOT_FOUND_MSG: string =
    'No payment modes found...';

  static readonly ROUTE: string = 'Route';
  static readonly STORE: string = 'Store';
  static readonly BILL: string = 'Bill';
  static readonly RECOVERY: string = 'Recovery';

  static readonly ADD_STORE_VALIDATION: string =
    'Store with entered mobile number already exist.';

  static readonly ADD_BILL_VALIDATION: string =
    'Bill number already exist.';
}
