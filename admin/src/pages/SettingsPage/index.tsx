import pluginId from '../../pluginId';
import {
  Box,
  Button,
  ContentLayout,
  HeaderLayout,
  Loader,
} from '@strapi/design-system';
import { useNotification, request } from '@strapi/helper-plugin';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';

const SettingsPage = () => {
  const { formatMessage } = useIntl();

  const toggleNotification = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const regenerateAllBlurhashes = async () => {
    setIsLoading(true);

    try {
      await request(`/${pluginId}/regenerate`, { method: 'POST' });

      toggleNotification({
        type: 'success',
        message: formatMessage({
          id: 'Settings.notifications.success',
        }),
      });
    } catch {
      toggleNotification({
        type: 'warning',
        message: formatMessage({
          id: 'Settings.notifications.error',
        }),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Box background="neutral100">
        <HeaderLayout
          title={formatMessage({ id: `${pluginId}.Settings.title` })}
          subtitle={formatMessage({ id: `${pluginId}.Settings.subtitle` })}
          as="h2"
        />
      </Box>
      <ContentLayout paddingBottom={8}>
        <Button disabled={isLoading} onClick={regenerateAllBlurhashes}>
          {formatMessage({ id: `${pluginId}.Settings.regenerate` })}
        </Button>
        {isLoading && (
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Loader>
              {formatMessage({ id: `${pluginId}.Settings.processing` })}
            </Loader>
          </div>
        )}
      </ContentLayout>
    </>
  );
};

export default SettingsPage;
