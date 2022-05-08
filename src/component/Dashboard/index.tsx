import { Button, Divider, Input, Spin } from 'antd';
import React, { useState } from 'react';
import { Tabs } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { NewParcel, Parcel, ParcelStatus, UserRoles } from '../../types';
import moment from 'moment';

import './index.scss';

interface Props {
  create: (parcel: NewParcel) => void;
  deleteParcel: (id: string) => Promise<boolean>;
  deliverParcel: (id: string) => Promise<boolean>;
  getParcels: (status: ParcelStatus) => void;
  isLoading: boolean;
  parcels: Parcel[];
  pickUpParcel: (id: string) => Promise<boolean>;
}

export default function DashboardComponent(props: Props): React.ReactElement {
  const [fromAddress, setFromAddress] = useState<string>();
  const [toAddress, setToAddress] = useState<string>();

  const userRole = localStorage.getItem('role');
  if (!userRole) {
    localStorage.clear();
    window.location.href = '/';
  }

  const { TabPane } = Tabs;
  const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

  function getButtonsBasedOnRole(parcelStatus: ParcelStatus, parcelId: string): JSX.Element {
    const userRole = localStorage.getItem('role');

    if (userRole === UserRoles.Sender && parcelStatus === ParcelStatus.New) {
      return (
        <Button
          block
          danger
          onClick={async (): Promise<void> => {
            await props.deleteParcel(parcelId);
            props.getParcels(parcelStatus);
          }}
        >
          Delete parcel
        </Button>
      );
    }

    if (userRole === UserRoles.Biker) {
      switch (parcelStatus) {
      case ParcelStatus.New:
        return (
          <Button
            block
            type='primary'
            onClick={async (): Promise<void> => {
              await props.pickUpParcel(parcelId);
              props.getParcels(parcelStatus);
            }}
          >
              Pickup Parcel
          </Button>
        );
      case ParcelStatus.Transit:
        return (
          <Button
            block
            type='primary'
            onClick={async (): Promise<void> => {
              await props.deliverParcel(parcelId);
              props.getParcels(parcelStatus);
            }}
          >
              Deliver Parcel
          </Button>
        );

      default: return <></>;
      }
    }
    return <></>;
  }

  function showLoading(): JSX.Element {
    return (
      <section>
        <div className='dashboard_container__loading'>
          <Spin indicator={antIcon} />
        </div>
      </section>
    );
  }

  function creatParcelForm(): JSX.Element {
    return (
      <section>
        <div className='dashboard_container__form'>
          <div className='dashboard_container__form__input'>
            <Input
              placeholder='From address'
              value={fromAddress}
              onChange={event => {
                setFromAddress(event.target.value);
              }}
            />
          </div>
          <div className='dashboard_container__form__input'>
            <Input
              placeholder='To address'
              value={toAddress}
              onChange={event => {
                setToAddress(event.target.value);
              }}
            />
          </div>
          <footer>
            <Button
              type='primary'
              className='dashboard_container__submit'
              onClick={(): void => {
                if (fromAddress && toAddress) {
                  const newParcel: NewParcel = {
                    fromAddress: fromAddress,
                    toAddress: toAddress
                  };
                  props.create(newParcel);
                  setFromAddress('');
                  setToAddress('');
                }
              }}
            >
          Create parcel
            </Button>
          </footer>
        </div>
      </section>
    );
  }

  function showParcels(parcels: Parcel[], parcelStatus: ParcelStatus): JSX.Element | JSX.Element[] {
    if (parcels.length === 0)
      return (<article>No Parcels</article>);

    return (
      <section>
        <div className='dashboard_container__parcels_container'>
          {
            parcels.map((aParcel) =>
              <article key={aParcel.id}>
                <div className='dashboard_container__parcels_container__parcel dashboard_container__parcels_container--with-delete-button'>
                  <div className='dashboard_flexbox dashboard_flex_column'>
                    <div className='dashboard_flexbox'>
                      <div className='dashboard_container__parcels_container__parcel__field'>
                    ID
                      </div>
                      <div className='dashboard_container__parcels_container__parcel__value'>
                        {aParcel.id.substring(aParcel.id.length - 6)}
                      </div>
                    </div>
                    <Divider className='dashboard_divider' />
                    <div className='dashboard_flexbox'>
                      <div className='dashboard_container__parcels_container__parcel__field'>
                    From Address
                      </div>
                      <div className='dashboard_container__parcels_container__parcel__value'>
                        {aParcel.from_address}
                      </div>
                    </div>
                    <Divider className='dashboard_divider' />
                    <div className='dashboard_flexbox'>
                      <div className='dashboard_container__parcels_container__parcel__field'>
                    To Address
                      </div>
                      <div className='dashboard_container__parcels_container__parcel__value'>
                        {aParcel.to_address}
                      </div>
                    </div>
                    <Divider className='dashboard_divider' />
                    <div className='dashboard_flexbox'>
                      <div className='dashboard_container__parcels_container__parcel__field'>
                    Statue
                      </div>
                      <div className='dashboard_container__parcels_container__parcel__value'>
                        {aParcel.status.toUpperCase()}
                      </div>
                    </div>
                    <Divider className='dashboard_divider' />
                    <div className='dashboard_flexbox'>
                      <div className='dashboard_container__parcels_container__parcel__field'>
                    Created Time
                      </div>
                      <div className='dashboard_container__parcels_container__parcel__value'>
                        {moment(aParcel.created_time).format('D/MMM/yyyy HH:mm')}
                      </div>
                    </div>
                  </div>
                  <footer>
                    <div className='dashboard_container__parcels_container__button'>
                      {getButtonsBasedOnRole(parcelStatus, aParcel.id)}
                    </div>
                  </footer>
                </div>
              </article>
            )
          }
        </div>
      </section>
    );
  }

  return (
    <>
      <div className='dashboard_container'>
        <div className='dashboard_container__block'>
          <aside>
            <Tabs
              defaultActiveKey='1'
              tabPosition={'left'}
              onTabClick={(tabIndex): void => {
                if (parseInt(tabIndex) === 2) {
                  props.getParcels(ParcelStatus.New);
                }
                if (parseInt(tabIndex) === 3) {
                  props.getParcels(ParcelStatus.Transit);
                }
                if (parseInt(tabIndex) === 4) {
                  props.getParcels(ParcelStatus.Delivered);
                }
              }}
            >
              {
                userRole === UserRoles.Sender
                  ? <TabPane tab='Create Parcel' key='1'>
                    {
                      props.isLoading
                        ? showLoading()
                        : creatParcelForm()
                    }
                  </TabPane>
                  : ''
              }
              <TabPane tab='New Parcel' key='2'>
                {
                  props.isLoading
                    ? showLoading()
                    : showParcels(props.parcels, ParcelStatus.New)
                }
              </TabPane>
              <TabPane tab='Transit Parcel' key='3'>
                {
                  props.isLoading
                    ? showLoading()
                    : showParcels(props.parcels, ParcelStatus.Transit)
                }
              </TabPane>
              <TabPane tab='Delivered Parcel' key='4'>
                {
                  props.isLoading
                    ? showLoading()
                    : showParcels(props.parcels, ParcelStatus.Delivered)
                }
              </TabPane>
            </Tabs>
          </aside>
        </div>
      </div>
    </>
  );
}