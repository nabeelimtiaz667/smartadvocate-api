import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
  
type authType = {Username: string, Password: string};

interface CasePayload {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  summary: string;
  paidAdvertisement: string;
  searchEngineName: string;
  entryPageURL: string;
  referralPageURL: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  referringURL: string;
  keywords: string;
  intakeDate: string;
  dob: string;
  gender: string;
  ssn: string;
  caseType: string;
  office: string;
  ssnEncoded: boolean;
  Referral_LawFirm: string;
  Referral_ContactID: string;
  PaidAdvertisementID: number;
  OfficeID: number;
  CaseGroupID: number;
  CaseTypeID: number;
  SubTypeID: number;
  PlaintiffContactID: number;
}

class ApiService {
  private readonly baseURL: string;
  private readonly authEndpoint: string;
  private readonly createCaseEndpoint: string;
  private readonly getCaseGroupsEndpoint: string;
  private readonly axiosInstance: AxiosInstance;
  private static token: string = '';

  constructor(auth: authType) {
    this.baseURL = 'https://app.smartadvocate.com';
    this.authEndpoint = '/CaseSyncAPI/Users/authenticate';
    this.createCaseEndpoint = '/CaseSyncAPI/case/CreateCase';
    this.getCaseGroupsEndpoint = '/CaseSyncAPI/case/CaseGroup';

    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add interceptor to always use the latest token
    this.axiosInstance.interceptors.request.use((config) => {
      if (ApiService.token) {
        config.headers = config.headers || {'Content-Type': 'application/json'};
        config.headers['Authorization'] = `Bearer ${ApiService.token}`;
      }
      return config;
    });

    this.getToken(auth).then((response) => {
      ApiService.token = response.data.accessToken;
    });
  }

  private async getToken(data: authType): Promise<any> {
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await this.axiosInstance.post(
      this.authEndpoint,
      data,
    //   config
    );
    if (response.status !== 200) {
        throw new Error('Failed to authenticate and retrieve token');
    }
    return response.data;
  }

  async createCase(payload: CasePayload): Promise<any> {
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${ApiService.token}`,
        'Content-Type': 'application/json',
      },
    };

    const response = await this.axiosInstance.post(
      this.createCaseEndpoint,
      payload,
    //   config
    );

    return response.data;
  }

  async getCaseGroups(): Promise<any>{
    const response = await this.axiosInstance.get(this.getCaseGroupsEndpoint)
    if (response.status !== 200) {
        return {status: response.status, message: response.data?.message, meta: response.statusText};
    }
    return response.data;
  }
}


module.exports = ApiService;