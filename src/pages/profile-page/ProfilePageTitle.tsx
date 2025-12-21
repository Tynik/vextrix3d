import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { HoneyFlex } from '@react-hive/honey-layout';
import { Navigate } from 'react-router-dom';

import { ROUTES } from '~/configs';
import { handleApiError, signOutRequest } from '~/api';
import { ExitToAppIcon } from '~/icons';
import { useAppContext } from '~/models';
import { IconButton, Text } from '~/components';

export const ProfilePageTitle = () => {
  const { auth } = useAppContext();

  const signOutMutation = useMutation({
    mutationFn: async () => {
      try {
        await signOutRequest();
      } finally {
        await auth.signOut();
      }
    },
  });

  const handleSignOut = async () => {
    try {
      await signOutMutation.mutateAsync();
    } catch (e) {
      handleApiError(e);
    }
  };

  if (signOutMutation.isSuccess) {
    return <Navigate to={ROUTES.home} replace />;
  }

  return (
    <>
      <HoneyFlex row centerY $width="100%">
        <Text as="h1" variant="inherit">
          Profile
        </Text>

        <IconButton
          disabled={signOutMutation.isPending}
          onClick={handleSignOut}
          icon={
            <ExitToAppIcon
              color={signOutMutation.isPending ? 'neutral.grayMedium' : 'secondary.carbonInk'}
            />
          }
          $marginLeft="auto"
        />
      </HoneyFlex>
    </>
  );
};
