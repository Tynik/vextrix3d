import React, { useEffect, useRef } from 'react';
import { useHoneyStyle } from '@react-hive/honey-style';
import { HoneyBox, HoneyFlexBox } from '@react-hive/honey-layout';

import type { Nullable } from '~/types';
import { CONTACT_EMAIL, FILAMENTS } from '~/configs';
import { calculateModelQuote } from '~/helpers';
import { Button, Container, Text } from '~/components';
import { GetQuoteButton } from './widgets';

interface ShowcaseItem {
  image: string;
  description: string;
}

const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    image: '3d-func-proto.jpg',
    description: 'Functional Prototype',
  },
  {
    image: '3d-vase.png',
    description: 'Decor Model',
  },
  {
    image: '3d-mech-part.jpg',
    description: 'Mechanical Part',
  },
  {
    image: '3d-art.jpg',
    description: 'Artwork',
  },
];

interface Feature {
  icon: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: '🧱',
    description: 'Wide Range of Filaments - PLA, PETG, ABS, ASA, and more',
  },
  {
    icon: '⚙️',
    description: 'Functional Prototypes - Durable, accurate, and ready for testing',
  },
  {
    icon: '🎨',
    description: 'Clean Print Quality - Smooth layers with precise detailing',
  },
  {
    icon: '🚀',
    description: 'Fast Turnaround - From upload to print in record time',
  },
  {
    icon: '📏',
    description: 'Dimensional Accuracy - Consistent tolerances across all prints',
  },
  {
    icon: '🔩',
    description: 'Strong Mechanical Parts - Optimized for strength and durability',
  },
  {
    icon: '🌿',
    description: 'Eco-Friendly Materials - Sustainable and low-waste printing process',
  },
  {
    icon: '💡',
    description: 'Design Assistance - Guidance on printability and material choice',
  },
];

export const LandingPage = () => {
  const { resolveColor } = useHoneyStyle();

  const videoRef = useRef<Nullable<HTMLVideoElement>>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(e => console.error('Error playing video:', e));
    }
  }, []);

  const handleSelectModel = async (files: File[]) => {
    const quote = await calculateModelQuote(
      files[0],
      {
        infill: 0.15,
        walls: 2,
        topLayers: 5,
        bottomLayers: 5,
        layerHeight: 0.2,
        nozzleDiameter: 0.4,
      },
      {
        materialDensity: 1.04,
        materialPriceKg: 25,
        basePrintTime: 0.15,
        speedMm3PerSec: 12,
        machineCostPerHour: 0,
        fixedFee: 0,
        markup: 0,
      },
    );

    console.log(quote);
  };

  return (
    <>
      <HoneyBox as="header" $position="relative" $height="700px" $flexShrink={0} $overflow="hidden">
        <HoneyBox
          $width="100%"
          $height="100%"
          $background={`url('/assets/images/IMG_1700.webp') ${resolveColor('neutral.grayDark')}`}
          $backgroundSize="cover"
          $backgroundBlendMode="overlay"
          $filter="blur(5px)"
          $transform="scale(1.05)" // prevents blur edge cut
        />

        <HoneyFlexBox
          $position="absolute"
          $top="40%"
          $left="50%"
          $transform="translate(-50%, -50%)"
          $gap={3}
          $textAlign="center"
        >
          <Text variant="h1" $color="primary.aquaMintPulse" shadow="strong">
            Vextrix3D
          </Text>

          <Text variant="h2" $color="neutral.white" shadow="medium" $marginTop={3}>
            Precision FDM 3D Printing
          </Text>

          <Text variant="subtitle1" $color="neutral.white" shadow="strong">
            High-quality FDM printing for your prototypes, parts and creative designs - made with
            professional grade materials and printers.
          </Text>

          <HoneyBox $display="flex" $justifyContent="center" $gap={2} $marginTop={3}>
            <Button
              as="a"
              color="accent"
              size="large"
              href={`mailto:${CONTACT_EMAIL}`}
              $height="50px"
            >
              Get a Quote
            </Button>

            <Button color="secondary" size="large" $height="50px">
              See Details
            </Button>
          </HoneyBox>
        </HoneyFlexBox>
      </HoneyBox>

      <main>
        <HoneyBox
          as="section"
          $padding={5}
          $backgroundColor="secondary.cloudMist"
          aria-label="Showcase"
          data-testid="showcase"
        >
          <Container $gap={3} $alignItems="center">
            <Text variant="h3" $textAlign="center" $textTransform="uppercase">
              Showcase
            </Text>

            <HoneyBox $display="flex" $flexWrap="wrap" $gap={3} $justifyContent="center">
              {SHOWCASE_ITEMS.map(showcaseItem => (
                <HoneyFlexBox key={showcaseItem.description} $gap={1}>
                  <HoneyBox
                    $width="250px"
                    $height="250px"
                    $backgroundColor="neutral.grayLight"
                    $borderRadius="6px"
                    $backgroundImage={`url('/assets/images/${showcaseItem.image}')`}
                    $backgroundSize="cover"
                  />

                  <Text variant="subtitle2" $textAlign="center">
                    {showcaseItem.description}
                  </Text>
                </HoneyFlexBox>
              ))}
            </HoneyBox>
          </Container>
        </HoneyBox>

        <HoneyBox as="section" aria-label="Features" data-testid="features">
          <Container $padding={{ xs: 3, md: 5 }} $gap={7}>
            <HoneyBox $display="flex" $gap={3} $flexWrap={{ xs: 'wrap', lg: 'nowrap' }}>
              <HoneyBox
                $width="100%"
                $maxWidth="450px"
                $minHeight="450px"
                $backgroundImage="url('/assets/images/IMG_1742.webp')"
                $backgroundSize="cover"
                $borderRadius="6px"
                $margin={[0, 'auto']}
              />

              <HoneyFlexBox $width="100%" $gap={3}>
                <Text variant="h3" $textAlign="center" $textTransform="uppercase">
                  Crafting with Precision
                </Text>

                <Text variant="body1">
                  Using advanced FDM technology, we bring your designs to life layer by layer with
                  exceptional precision. Each print is crafted using premium-quality filament to
                  ensure outstanding detail, strength, and surface finish — so your model looks
                  exactly as envisioned.
                </Text>

                <HoneyBox $display="flex" $gap={2} $justifyContent="center" $flexWrap="wrap">
                  {FEATURES.map((feature, featureIndex) => (
                    <HoneyBox
                      key={featureIndex}
                      $display="flex"
                      $alignItems="center"
                      $gap={2}
                      $width="calc(50% - 8px)"
                      $minWidth="250px"
                      $padding={2}
                      $border="1px solid"
                      $borderColor="neutral.grayLight"
                      $borderRadius="6px"
                    >
                      <div aria-label="Icon">{feature.icon}</div>

                      <Text variant="body1">{feature.description}</Text>
                    </HoneyBox>
                  ))}
                </HoneyBox>
              </HoneyFlexBox>
            </HoneyBox>

            <HoneyFlexBox $gap={3}>
              <Text variant="h3" $textAlign="center" $textTransform="uppercase">
                Materials & Technology
              </Text>

              <HoneyBox $display="flex" $flexWrap="wrap" $gap={3} $justifyContent="center">
                {FILAMENTS.map(filament => (
                  <HoneyBox
                    key={filament.name}
                    $display="flex"
                    $gap={2}
                    $width="100%"
                    $maxWidth="450px"
                    $minHeight="150px"
                    $padding={2}
                    $borderRadius="6px"
                    $border="1px solid"
                    $borderColor="neutral.grayLight"
                  >
                    <HoneyBox
                      $flexShrink={0}
                      $width="100px"
                      $height="100px"
                      $backgroundImage="url('/assets/images/filament-1.webp')"
                      $backgroundSize="cover"
                    />

                    <HoneyFlexBox $gap={1}>
                      <Text variant="subtitle1">{filament.name}</Text>
                      <Text variant="body1">{filament.description}</Text>
                    </HoneyFlexBox>
                  </HoneyBox>
                ))}
              </HoneyBox>
            </HoneyFlexBox>
          </Container>
        </HoneyBox>

        {/*<HoneyBox as="section" aria-label="Get a quote" data-testid="quote">*/}
        {/*  <Container $padding={{ xs: 3, md: 5 }}>*/}
        {/*    <FilePicker*/}
        {/*      accept={['.stl', '.obj', '.3mf']}*/}
        {/*      inputProps={{*/}
        {/*        multiple: false,*/}
        {/*      }}*/}
        {/*      onSelectFiles={handleSelectModel}*/}
        {/*    >*/}
        {/*      <Button as="div" color="accent">*/}
        {/*        Upload Model*/}
        {/*      </Button>*/}
        {/*    </FilePicker>*/}
        {/*  </Container>*/}
        {/*</HoneyBox>*/}
      </main>
    </>
  );
};
