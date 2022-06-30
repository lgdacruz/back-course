export interface PaymentInterface {
 mode: "default";
 method: "creditCard";
 currency: string;
 sender: { hash: string; name: string; email: string };
 phone: { areaCode: string; number: string };

 documents: { type: "CPF" | "CNPJ"; value: string };
 item: {
  id: string;
  description: string;
  amount: string;
  quantity: string;
 };
 creditCard: { token: string };
 installment: {
  quantity: number;
  value: string;
  noInterestInstallmentQuantity: string;
 };

 holder: {
  name: string;
  documents: {
   type: string;
   value: string;
   birthDate: string;
  };
  phone: { areaCode: string; number: string };
 };
 billingAddress: {
  street: string;
  number: string;
  city: string;
  district: string;
  state: string;
  country: string;
  postalCode: string;
  complement: string;
 };

 shipping: { addressRequired: false };

 notificationURL: string;
 receiverEmail: string;
 reference?: string;
}

export interface PaymentCheckoutPagseguro {
 currency: "BRL";
 item: {
  id: string;
  description: string;
  amount: string;
  quantity: "1";
  weight: "0";
 };
 shipping: {
  addressRequired: "false";
 };
 sender: {
  name: string;
  email: string;
 };
 reference?: string;
 redirectURL: string;
 notificationURL?: string;
}
