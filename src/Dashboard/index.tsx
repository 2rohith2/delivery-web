import React, { useEffect, useState } from 'react';
import { deleteApi, getApi, postApi } from '../api';
import { NewParcel, Parcel, ParcelStatus, UserRoles } from '../types';
import DashboardComponent from '../component/Dashboard';
import { notification } from 'antd';

export default function DashboardContainer(): React.ReactElement {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [parcels, setParcels] = useState<Parcel[]>([]);

  useEffect(() => {
    const userRole = localStorage.getItem('role');

    if (!userRole) {
      localStorage.clear();
      window.location.href = '/';
    }
  });

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    if (userRole === UserRoles.Biker) {
      getParcels(ParcelStatus.New);
    }
  }, []);

  async function createParcel(parcel: NewParcel): Promise<void> {
    try {
      setIsLoading(true);
      const result = await postApi('/parcel', { 'from_address': parcel.fromAddress, 'to_address': parcel.toAddress });
      setIsLoading(false);
      notification['success']({
        message: 'Parcel created',
        description: `Your parcel has been created, plese note your parcel id - ${result.body.id}`
      });
    } catch (error: any) {
      setIsLoading(false);
      notification['error']({
        message: 'Failed to create Parcel',
        description: error.response.body.message
      });
    }
  }

  async function getParcels(status: ParcelStatus): Promise<void> {
    setIsLoading(true);
    const result = await getApi(`/parcel?status=${status}`);
    const parcels = result.body as Parcel[];
    if (parcels) {
      setParcels([...parcels]);
    }
    setIsLoading(false);
  }

  async function deleteParcel(id: string): Promise<boolean> {
    try {
      setIsLoading(true);
      await deleteApi(`/parcel/${id}`);
      setIsLoading(false);
      notification['success']({
        message: 'Parcel deleted',
        description: 'Your parcel has been deleted, so no biker can pickup'
      });
      return true;
    } catch (error: any) {
      setIsLoading(false);
      notification['error']({
        message: 'Failed to delete Parcel',
        description: error.response.body.message
      });
      return false;
    }
  }

  async function pickUpParcel(id: string,): Promise<boolean> {
    try {
      setIsLoading(true);
      await postApi(`/parcel/${id}/pickup`, {});
      setIsLoading(false);
      notification['success']({
        message: 'Parcel pickup',
        description: 'The parcel has been picked up, so other biker cann\'t pickup'
      });
      return true;
    } catch (error: any) {
      setIsLoading(false);
      notification['error']({
        message: 'Failed to pickup Parcel',
        description: error.response.body.message
      });
      return false;
    }
  }

  async function deliverParcel(id: string,): Promise<boolean> {
    try {
      setIsLoading(true);
      await postApi(`/parcel/${id}/deliver`, {});
      setIsLoading(false);
      notification['success']({
        message: 'Parcel delivered',
        description: 'The parcel has been delivered, thank you !!!'
      });
      return true;
    } catch (error: any) {
      setIsLoading(false);
      notification['error']({
        message: 'Failed to deliver Parcel',
        description: error.response.body.message
      });
      return false;
    }
  }

  return (
    <main>
      <DashboardComponent
        create={createParcel}
        deleteParcel={deleteParcel}
        deliverParcel={deliverParcel}
        getParcels={getParcels}
        isLoading={isLoading}
        parcels={parcels}
        pickUpParcel={pickUpParcel}
      />
    </main>
  );
}