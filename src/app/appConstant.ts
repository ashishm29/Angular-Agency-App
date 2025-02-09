export class AppConstant {
  static readonly AGENCY_COLLECTION_NAME: string = 'AgencyCollection';
  static readonly USER_COLLECTION_NAME: string = 'UserCollection';
  static readonly ROUTE_COLLECTION_NAME: string = 'RouteCollection';
  static readonly STORE_COLLECTION_NAME: string = 'StoreCollection';
  static readonly BILL_COLLECTION_NAME: string = 'BillCollection';
  static readonly RECOVERY_COLLECTION_NAME: string = 'RecoveryCollection';
  static readonly PURCHASE_COLLECTION_NAME: string = 'PurchaseCollection';
  static readonly CHEQUE_COLLECTION_NAME: string = 'ChequeCollection';
  static readonly PAYMENT_MODE_COLLECTION_NAME: string =
    'PaymentModeCollection';
  static readonly LOGGING_COLLECTION_NAME: string = 'LoggingCollection';
  static readonly EXPENSE_COLLECTION_NAME: string = 'ExpenseCollection';
  static readonly ATTENDANCE_COLLECTION_NAME: string = 'AttendanceCollection';
  static readonly RECOVERY_HISTORY_COLLECTION_NAME: string =
    'RecoveryHistoryCollection';

  static readonly ORDER_COLLECTION_NAME: string = 'OrderCollection';
  static readonly PRODUCT_COLLECTION_NAME: string = 'ProductCollection';
  static readonly COMPANY_COLLECTION_NAME: string = 'CompanyCollection';

  static readonly DEFAULT_DATE_TIME_FORMAT: string = 'MM/dd/YYYY';
  static readonly DATE_TIME_FORMAT: string = 'dd/MM/yyyy HH:mm:ss';
  static readonly DATE_TIME_FORMAT_PLAIN: string = 'yyyyMMddHHmmss';

  static readonly SAVE_ACTION: string = 'Saved';
  static readonly UPDAE_ACTION: string = 'Updated';
  static readonly DELETE_ACTION: string = 'Deleted';
  static readonly SEARCH_ACTION: string = 'Search';
  static readonly YES_ACTION: string = 'Yes';
  static readonly NO_ACTION: string = 'No';
  static readonly ERROR_ACTION: string = 'Error';
  static readonly ADD_ACTION: string = 'Add';

  static readonly BILL_ADDED_SUCCESS_MSG: string = 'Bill added Successfully';
  static readonly STORE_ADDED_SUCCESS_MSG: string = 'Store added Successfully';
  static readonly ROUTE_ADDED_SUCCESS_MSG: string = 'Route added Successfully';
  static readonly DETAILS_ADDED_SUCCESS_MSG: string =
    'Details added Successfully';
  static readonly RECORD_ADDED_SUCCESS_MSG: string =
    'Record added Successfully';
  static readonly RECORD_ALREADY_PRESENT_MSG: string =
    'Record already present..';
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

  static readonly ORDER_ADDED_SUCCESS_MSG: string = 'Order added Successfully';

  static readonly ROUTE_NOT_FOUND_MSG: string = 'No Route details found...';
  static readonly COMPANY_NOT_FOUND_MSG: string = 'No company details found...';
  static readonly PRODUCT_NOT_FOUND_MSG: string = 'No product details found...';
  static readonly STORE_NOT_FOUND_MSG: string = 'No Store details found...';
  static readonly RECORD_NOT_FOUND_MSG: string = 'Records not found...';
  static readonly BILL_NOT_FOUND_MSG: string = 'Bill details not found...';
  static readonly DETAILS_NOT_FOUND_MSG: string = 'Details not found...';
  static readonly RECOVERY_NOT_FOUND_MSG: string =
    'Recovery details not found...';

  static readonly RECORD_UPDATED_SUCCESS_MSG: string =
    'Record updated Successfully';

  static readonly RECORD_DELETED_SUCCESS_MSG: string =
    'Record deleted Successfully';

  static readonly ROUTE_UPDATED_SUCCESS_MSG: string =
    'Route updated Successfully';
  static readonly STORE_UPDATED_SUCCESS_MSG: string =
    'Store updated Successfully';
  static readonly BILL_UPDATED_SUCCESS_MSG: string =
    'Bill details updated Successfully';

  static readonly RECOVERY_UPDATED_SUCCESS_MSG: string =
    'Recovery details updated Successfully';

  static readonly STORE_UPDATED_FAILED_MSG: string = 'Store updated failed...';

  static readonly STORE_FORM_INVALID_MSG: string = 'Store form is invalid...';

  static readonly PAYMENT_MODES_NOT_FOUND_MSG: string =
    'No payment modes found...';

  static readonly ROUTE: string = 'Route';
  static readonly STORE: string = 'Store';
  static readonly SALESMAN_RECOVERY_DELETE: string = 'Salesman-recovery-delete';
  static readonly ATTENDANCE_DELETE: string = 'Attendance-delete';
  static readonly SALESMAN_RECOVERY_UPDATE: string = 'Salesman-recovery-update';
  static readonly USER_DELETE: string = 'User-delete';
  static readonly USER_UPDATE: string = 'User-update';
  static readonly PURCHASE_UPDATE: string = 'Purchase-update';
  static readonly BILL: string = 'Bill';
  static readonly RECOVERY: string = 'Recovery';
  static readonly ATTENDANCE: string = 'Attendance';
  static readonly LOGOUT: string = 'Logout';
  static readonly PRODUCT_UPDATE: string = 'Product_Update';
  static readonly PRODUCT_DELETE: string = 'Product_DELETE';
  static readonly PURCHASE_DELETE: string = 'PURCHASE_DELETE';
  static readonly BANK_CHEQUE_UPDATE: string = 'BANK_CHEQUE_UPDATE';

  static readonly ADD_STORE_VALIDATION: string =
    'Store with entered mobile number already exist.';

  static readonly ADD_BILL_VALIDATION: string = 'Bill number already exist.';

  static readonly ADD_BILL_PENDING_AMT_VALIDATION: string =
    'Pending amount can not be less than 0.';

  static readonly ADD_RECOVERY_BILL_AND_PENDING_AMT_VALIDATION: string =
    'Bill amount and Pending amount can not be same.';

  static readonly REPORT_FONT_NAME: string = 'Times New Roman';
  static readonly SUBMIT_BTN_TEXT: string = 'Submit';
  static readonly ADD_BILL_BTN_TEXT: string = 'Add Bill';
  static readonly PLEASE_WAIT_BTN_TEXT: string = 'Please wait...';

  static readonly ROUTE_LOCAL_STORAGE_KEY: string = 'route';
  static readonly PAID_SEARCH_LOCAL_STORAGE_KEY: string = 'paidUnpaidSearch';
  static readonly STORE_SEARCH_LOCAL_STORAGE_KEY: string = 'storeSearch';
  static readonly FROM_DATE_SEARCH_LOCAL_STORAGE_KEY: string = 'fromDateSearch';
  static readonly TO_DATE_SEARCH_LOCAL_STORAGE_KEY: string = 'toDateSearch';
  static readonly BILL_SEARCH_LOCAL_STORAGE_KEY: string = 'billNumber';

  static readonly INDEX_NOT_FOUND_MSG: string =
    'Can not update record... Index not found ';

  static readonly ENTER_VALID_DATES_MSG: string =
    'Please enter valid date to search..';

  static readonly RECORD_ALREADY_PRESENT_FOR_DATE_RANGE_MSG: string =
    'Record already present for this salesman for this Date range.';

  static readonly ONLY_CASH_ENTRIES_ALLOWED_MSG: string =
    'Only CASH Payment Mode entries are allowed.';

  static readonly SELECT_SALESMAN_MSG: string = 'Please select SALESMAN.';

  static readonly PLEASE_SELECT_STORE: string =
    'Please select store before adding item.';
}
