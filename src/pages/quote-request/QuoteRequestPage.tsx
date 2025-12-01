import React, { cloneElement } from 'react';
import { useNavigate } from 'react-router-dom';
import type { HoneyFormOnSubmit } from '@react-hive/honey-form';
import { HoneyBox, HoneyFlexBox, HoneyGrid, HoneyGridColumn } from '@react-hive/honey-layout';
import { assert } from '@react-hive/honey-utils';
import { toast } from 'react-toastify';
import sortBy from 'lodash.sortby';

import { handleApiError, quoteRequest } from '~/api';
import { AttachFileIcon, CurrencyPoundIcon, ErrorIcon, SendIcon, ThermostatIcon } from '~/icons';
import { FILAMENT_ICONS_CONFIG, FILAMENTS } from '~/configs';
import { useFilaments } from '~/hooks';
import { Alert, Button, FilePicker, Form, Scale, Text, TextInput } from '~/components';
import { Page, FileCard } from '~/pages';
import type { QuoteRequestFormData } from './quote-request-model';
import { QUOTE_REQUEST_FORM_FIELDS } from './quote-request-model';

export const QuoteRequestPage = () => {
  const navigate = useNavigate();

  const { filamentPriceRange, filamentTemperatureRange } = useFilaments();

  const handleSelectModel = async (files: File[]) => {
    // const quote = await calculateModelQuote(
    //   files[0],
    //   {
    //     infill: 0.15,
    //     walls: 2,
    //     topLayers: 5,
    //     bottomLayers: 5,
    //     layerHeight: 0.2,
    //     nozzleDiameter: 0.4,
    //   },
    //   {
    //     materialDensity: 1.04,
    //     materialPriceKg: 25,
    //     basePrintTime: 0.15,
    //     speedMm3PerSec: 12,
    //     machineCostPerHour: 0,
    //     fixedFee: 0,
    //     markup: 0,
    //   },
    // );
    //
    // console.log(quote);
  };

  const submitQuoteRequest: HoneyFormOnSubmit<QuoteRequestFormData> = async data => {
    assert(data.model, 'Model is required');

    try {
      const uploadModelUrl = await quoteRequest({
        fileName: data.model.name,
        contentType: data.model.type,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        description: data.description,
      });

      await fetch(uploadModelUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': data.model.type,
        },
        body: data.model,
      });

      toast('Quote request successfully submitted', {
        type: 'success',
      });

      navigate('/', {
        replace: true,
      });
    } catch (e) {
      handleApiError(e);
    }
  };

  return (
    <Page title="Quote Request">
      <Form fields={QUOTE_REQUEST_FORM_FIELDS} onSubmit={submitQuoteRequest}>
        {({ formValues, formFields, isFormSubmitting }) => (
          <HoneyFlexBox $gap={2}>
            <HoneyGrid columns={2} spacing={3}>
              <HoneyGridColumn $gap={2}>
                <HoneyBox
                  $display="grid"
                  $gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                  $gap={2}
                  $flexWrap="wrap"
                >
                  {FILAMENTS.map(filament => (
                    <HoneyFlexBox
                      key={filament.name}
                      $gap={1}
                      $minHeight="150px"
                      $padding={2}
                      $borderRadius="4px"
                      $border="1px solid"
                      $borderColor="neutral.grayLight"
                    >
                      <HoneyBox $display="flex" $gap={1} $alignItems="center">
                        <Text variant="subtitle1">{filament.name}</Text>

                        {Boolean(filament.icons?.length) && (
                          <HoneyBox
                            $display="flex"
                            $gap={0.5}
                            $alignItems="center"
                            $marginLeft="auto"
                          >
                            {sortBy(filament.icons).map(iconName =>
                              cloneElement(FILAMENT_ICONS_CONFIG[iconName], {
                                key: iconName,
                                size: 'small',
                                color: 'secondary.slateAlloy',
                              }),
                            )}
                          </HoneyBox>
                        )}
                      </HoneyBox>

                      <Text variant="body1">{filament.shortDescription}</Text>

                      <HoneyFlexBox $gap={1.5} $marginTop={1}>
                        {filament.price && (
                          <Scale
                            label="Price"
                            icon={<CurrencyPoundIcon />}
                            min={filamentPriceRange.min}
                            max={filamentPriceRange.max}
                            value={filament.price * (filament.difficulty ?? 1)}
                          />
                        )}

                        {filament.maxTemperature && (
                          <Scale
                            label="Temp. Resistance"
                            icon={<ThermostatIcon />}
                            min={filamentTemperatureRange.min}
                            max={filamentTemperatureRange.max}
                            value={filament.maxTemperature}
                          />
                        )}
                      </HoneyFlexBox>
                    </HoneyFlexBox>
                  ))}
                </HoneyBox>
              </HoneyGridColumn>

              <HoneyGridColumn $gap={2} $minWidth="300px">
                <Alert variant="info">We support *.3mf, *.obj and *.stl files</Alert>

                <HoneyFlexBox $gap={0.5}>
                  {formValues.model ? (
                    <FileCard
                      file={formValues.model}
                      onRemove={() => formFields.model.setValue(undefined)}
                    />
                  ) : (
                    <FilePicker
                      accept={['*/*']}
                      inputProps={{
                        multiple: false,
                      }}
                      onSelectFiles={files => formFields.model.setValue(files[0])}
                    >
                      <Button as="div" color="accent" size="large">
                        <AttachFileIcon size="small" color="neutral.white" />
                        Select Model
                      </Button>
                    </FilePicker>
                  )}

                  {formFields.model.errors.length > 0 && (
                    <HoneyBox $display="flex" $gap={0.5} $alignItems="center">
                      <ErrorIcon size="small" color="error.signalCoral" />

                      <Text variant="caption1" $color="error.crimsonRed" aria-label="File error">
                        {formFields.model.errors[0]?.message}
                      </Text>
                    </HoneyBox>
                  )}
                </HoneyFlexBox>

                <TextInput
                  label="* First Name"
                  error={formFields.firstName.errors[0]?.message}
                  {...formFields.firstName.props}
                />

                <TextInput
                  label="* Last Name"
                  error={formFields.lastName.errors[0]?.message}
                  {...formFields.lastName.props}
                />

                <TextInput
                  label="* Email"
                  error={formFields.email.errors[0]?.message}
                  {...formFields.email.props}
                />

                <TextInput
                  label="* Description"
                  error={formFields.description.errors[0]?.message}
                  multiline={true}
                  {...formFields.description.props}
                />

                <Button
                  loading={isFormSubmitting}
                  disabled={isFormSubmitting}
                  type="submit"
                  color="primary"
                  icon={<SendIcon color="neutral.white" />}
                  $marginLeft="auto"
                >
                  Send
                </Button>
              </HoneyGridColumn>
            </HoneyGrid>
          </HoneyFlexBox>
        )}
      </Form>
    </Page>
  );
};
