import React from 'react';
import { HoneyFlex } from '@react-hive/honey-layout';
import { useMutation } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';

import { ROUTES } from '~/configs';
import { signOutRequest } from '~/api';
import { useAppContext } from '~/models';
import { Button, Text } from '~/components';
import { Page } from '~/pages';

export const ProfilePage = () => {
  const { user } = useAppContext();

  const signOutMutationRequest = useMutation({
    mutationFn: signOutRequest,
  });

  if (signOutMutationRequest.isSuccess) {
    return <Navigate to={ROUTES.home} replace />;
  }

  if (!user) {
    return null;
  }

  return (
    <Page
      title="Profile"
      contentProps={{
        $gap: 2,
      }}
    >
      <HoneyFlex>
        <Text variant="body1">
          <strong>Email:</strong> {user.email}
        </Text>
      </HoneyFlex>

      <Button
        loading={signOutMutationRequest.isPending}
        onClick={() => signOutMutationRequest.mutateAsync()}
        variant="secondary"
      >
        Sign Out
      </Button>
    </Page>
  );
};
