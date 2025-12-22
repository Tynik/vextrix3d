import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getLocalStorageCapabilities } from '@react-hive/honey-utils';
import { HoneyFlex } from '@react-hive/honey-layout';
import { sendEmailVerification } from '@firebase/auth';
import { toast } from 'react-toastify';

import { ROUTE_PATHS } from '~/configs';
import { useAppContext } from '~/models';
import { auth } from '~/firebase';
import { DescriptionIcon, VerifiedIcon } from '~/icons';
import type { InfoTableRow } from '~/components';
import { Button, InfoTable, Tooltip, Text, Link } from '~/components';
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
  const { user } = useAppContext();

  const [emailVerificationCooldownMs, setEmailVerificationCooldownMs] = useState(
    getEmailVerificationRemainingMs,
  );

  const [isSendingEmailVerification, setIsSendingEmailVerification] = useState(false);

  const handleSendEmailVerification = useCallback(async () => {
    if (!auth.currentUser) {
      return;
    }

    setIsSendingEmailVerification(true);

    try {
      await sendEmailVerification(auth.currentUser);

      saveEmailVerificationCooldown(VERIFY_EMAIL_COOLDOWN_MS);
      setEmailVerificationCooldownMs(VERIFY_EMAIL_COOLDOWN_MS);

      toast('Verification email sent. Please check your inbox', {
        type: 'success',
      });

      return Promise.resolve();
    } catch (e) {
      toast('Failed to send verification email. Please try again later', {
        type: 'error',
      });
    } finally {
      setIsSendingEmailVerification(false);
    }
  }, [auth.currentUser]);

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
    () =>
      user
        ? [
            {
              label: 'First Name',
              value: user.firstName,
            },
            {
              label: 'Last Name',
              value: user.lastName,
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
              value: user.phone?.replace('+44', ''),
            },
          ]
        : [],
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
          $fontWeight: 500,
        }}
        textVariant="body1"
        $padding={2}
        $borderRadius="4px"
        $border="1px solid"
        $borderColor="neutral.grayLight"
        $backgroundColor="neutral.white"
        // Data
        data-testid="user-profile"
      />

      <Link to={ROUTE_PATHS.accountQuotes} variant="body2">
        <Button variant="accent" icon={<DescriptionIcon color="neutral.white" />}>
          My Quotes
        </Button>
      </Link>
    </Page>
  );
};
