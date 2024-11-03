import { notifications } from '@mantine/notifications';
import { makeAutoObservable } from 'mobx';
import { RowData } from '~/types';

class ClaimsStore {
  claims: RowData[] = [];
  loading: boolean = false;
  mrfLoading: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setMRFLoading(mrfLoading: boolean) {
    this.mrfLoading = mrfLoading;
  }

  setError(error: string | null) {
    this.error = error;
    if (error) {
      notifications.show({
        title: 'Error',
        message: error,
        color: 'red',
      })
    }
  }

  setClaims(claims: RowData[]) {
    this.claims = claims;
  }
}

const claimsStore = new ClaimsStore();
export default claimsStore;
