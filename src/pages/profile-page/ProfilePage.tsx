import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getLocalStorageCapabilities } from '@react-hive/honey-utils';
import { HoneyFlex } from '@react-hive/honey-layout';
import { sendEmailVerification } from '@firebase/auth';
import { toast } from 'react-toastify';

import { useAppContext } from '~/models';
import { VerifiedIcon } from '~/icons';
import type { InfoTableRow } from '~/components';
import { Button, InfoTable, Tooltip, Text } from '~/components';
import { Page } from '~/pages';
import { ProfilePageTitle } from './ProfilePageTitle';

const VERIFY_EMAIL_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

const VERIFY_EMAIL_STORAGE_KEY = 'emailVerifyCooldownUntil';

const capabilities = getLocalStorageCapabilities();

const getEmailVerificationCooldownUntil = () => {
  if (capabilities.readable) {
    const value = localStorage.getItem(VERIFY_EMAIL_STORAGE_KEY);

    return value ? Number(value) : 0;
  }

  return 0;
};

const getEmailVerificationRemainingMs = () =>
  Math.max(0, getEmailVerificationCooldownUntil() - Date.now());

const saveEmailVerificationCooldown = (cooldown: number) => {
  if (capabilities.writable) {
    localStorage.setItem(VERIFY_EMAIL_STORAGE_KEY, String(Date.now() + cooldown));
  }
};

export const ProfilePage = () => {
  const { firebaseAuth, user } = useAppContext();

  const [emailVerificationCooldownMs, setEmailVerificationCooldownMs] = useState(
    getEmailVerificationRemainingMs,
  );

  const [isSendingEmailVerification, setIsSendingEmailVerification] = useState(false);

  const handleSendEmailVerification = useCallback(async () => {
    if (!firebaseAuth.currentUser) {
      return;
    }

    setIsSendingEmailVerification(true);

    try {
      await sendEmailVerification(firebaseAuth.currentUser);

      saveEmailVerificationCooldown(VERIFY_EMAIL_COOLDOWN_MS);
      setEmailVerificationCooldownMs(VERIFY_EMAIL_COOLDOWN_MS);

      toast('Verification email sent. Please check your inbox.', {
        type: 'success',
      });

      return Promise.resolve();
    } catch (e) {
      toast('Failed to send verification email. Please try again later.', {
        type: 'error',
      });
    } finally {
      setIsSendingEmailVerification(false);
    }
  }, [firebaseAuth.currentUser]);

  useEffect(() => {
    if (user?.isEmailVerified || emailVerificationCooldownMs <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setEmailVerificationCooldownMs(getEmailVerificationRemainingMs());
    }, 1000);

    return () => clearInterval(interval);
  }, [user, emailVerificationCooldownMs]);

  const userProfileInfoRows = useMemo<InfoTableRow[]>(
    () => [
      {
        label: 'Name',
        value: user?.displayName,
      },
      {
        label: 'Email',
        value: user ? (
          user.isEmailVerified ? (
            <>
              <Text variant="inherit">{user.email}</Text>

              <Tooltip content="Verified">
                <VerifiedIcon size="small" color="success.emeraldGreen" />
              </Tooltip>
            </>
          ) : (
            <HoneyFlex $gap={1}>
              <Text variant="inherit">{user.email}</Text>

              <Button
                disabled={emailVerificationCooldownMs > 0}
                loading={isSendingEmailVerification}
                onClick={handleSendEmailVerification}
                variant="secondary"
              >
                {emailVerificationCooldownMs > 0
                  ? `Retry In ${Math.ceil(emailVerificationCooldownMs / 1000)}s`
                  : 'Verify'}
              </Button>
            </HoneyFlex>
          )
        ) : null,
      },
      {
        label: 'Phone',
        value: user?.phoneNumber,
      },
    ],
    [user, isSendingEmailVerification, emailVerificationCooldownMs, handleSendEmailVerification],
  );

  if (!user) {
    return null;
  }

  return (
    <Page
      title={<ProfilePageTitle />}
      contentProps={{
        $gap: 2,
      }}
    >
      <InfoTable
        rows={userProfileInfoRows}
        rowProps={{
          $width: '100%',
          $maxWidth: '100px',
        }}
        // Data
        data-testid="user-profile"
      />
    </Page>
  );
};
