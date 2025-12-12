import { FormGroup } from '@angular/forms';

export interface AuthFormState {
  form: FormGroup;
  apiUrl: string;
  message: any;
  isSuccess: any;
  fieldErrors: any;
  loading: any;
  userEmail?: any;
  accessToken?: any;
}
