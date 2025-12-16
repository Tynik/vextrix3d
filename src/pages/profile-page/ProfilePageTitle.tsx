import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { HoneyFlex } from '@react-hive/honey-layout';
import { Navigate } from 'react-router-dom';

import { ROUTES } from '~/configs';
import { signOutRequest } from '~/api';
import { ExitToAppIcon } from '~/icons';
import { useAppContext } from '~/models';
import { IconButton, Text } from '~/components';

export const ProfilePageTitle = () => {
  const { firebaseAuth } = useAppContext();

  const signOutMutationRequest = useMutation({
    mutationFn: async () => {
      try {
        await signOutRequest();
      } finally {
        await firebaseAuth.signOut();
      }
    },
  });

  if (signOutMutationRequest.isSuccess) {
    return <Navigate to={ROUTES.home} replace />;
  }

  return (
    <>
      <HoneyFlex row centerY $width="100%">
        <Text as="h1" variant="inherit">
          Profile
        </Text>

        <IconButton
          disabled={signOutMutationRequest.isPending}
          onClick={() => signOutMutationRequest.mutateAsync()}
          icon={
            <ExitToAppIcon
              color={
                signOutMutationRequest.isPending ? 'neutral.grayMedium' : 'secondary.carbonInk'
              }
            />
          }
          $marginLeft="auto"
        />
      </HoneyFlex>
    </>
  );
};
