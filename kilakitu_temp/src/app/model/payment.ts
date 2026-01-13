export interface Payment {
  customerfk: number;
  listingfk: string;
  transactionid: string;
  mpesaexpressmerchantrequestid: string;
  mpesaexpresscheckoutrequestid: string;
  mpesaexpressreceiptnumber: string;
}
