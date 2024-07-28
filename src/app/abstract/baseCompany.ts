import { AppConstant } from '../appConstant';
import { CompanyDetail, ProductDetail } from '../models/route';
import { ProductService } from '../services/product.service';

export abstract class BaseCompany {
  companyCollection: CompanyDetail[] = [];
  productCollection: ProductDetail[] = [];

  constructor(protected productService: ProductService) {}

  onFetchCompanys() {
    this.companyCollection = [];
    this.productService.getCompany().then((result) => {
      if (result && result.length > 0) {
        this.companyCollection = result;
      } else {
        console.log(AppConstant.COMPANY_NOT_FOUND_MSG);
      }
    });
  }

  onFetchProducts(companyId: string) {
    this.productCollection = [];
    this.productService.getProductsByCompany(companyId).then((result) => {
      if (result && result.length > 0) {
        this.productCollection = result;
      } else {
        console.log(AppConstant.PRODUCT_NOT_FOUND_MSG);
      }
    });
  }

  onCompanySelectionChange(selectedRoute: any) {
    this.onFetchProducts(selectedRoute.companyId);
  }
}
