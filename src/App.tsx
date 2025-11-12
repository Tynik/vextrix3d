import React, { useEffect, useRef } from 'react';
import { resolveColor, styled } from '@react-hive/honey-style';
import { Button, Container, Text } from '~/components';
import type { Nullable } from '~/types';
import { HoneyBox, HoneyFlexBox, HoneyGrid, HoneyGridColumn } from '@react-hive/honey-layout';

const BackgroundVideo = styled('video')`
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(5px);
`;

const BlurOverlay = styled(HoneyBox)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${resolveColor('neutral.grayDark', 0.7)};
`;

interface ShowcaseItem {
  description: string;
}

const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    description: 'Functional Prototype',
  },
  {
    description: 'Decor Model',
  },
  {
    description: 'Mechanical Part',
  },
  {
    description: 'Artwork',
  },
];

interface Filament {
  name: string;
  description: string;
}

const FILAMENTS: Filament[] = [
  {
    name: 'PLA',
    description:
      'ECO-friendly, and ideal for prototypes, decorative models, and general-purpose parts.',
  },
  {
    name: 'PETG',
    description:
      'Strong, temperature-resistant, and slightly flexible — perfect for functional parts and mechanical use.',
  },
  {
    name: 'ABS',
    description:
      'Durable and impact-resistant material suitable for technical components and post-processing with acetone.',
  },
  {
    name: 'ASA',
    description:
      'UV-resistant and weatherproof filament, excellent for outdoor applications and long-lasting mechanical parts.',
  },
];

interface Feature {
  icon: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: '🧱',
    description: 'Wide Range of Filaments: PLA, PETG, ABS, ASA, and more',
  },
  {
    icon: '⚙️',
    description: 'Functional Prototypes: Durable, accurate, and ready for testing',
  },
  {
    icon: '🎨',
    description: 'Clean Print Quality: Smooth layers with precise detailing',
  },
  {
    icon: '🚀',
    description: 'Fast Turnaround: From upload to print in record time',
  },
  {
    icon: '📏',
    description: 'Dimensional Accuracy: Consistent tolerances across all prints',
  },
  {
    icon: '🔩',
    description: 'Strong Mechanical Parts: Optimized for strength and durability',
  },
  {
    icon: '🌿',
    description: 'Eco-Friendly Materials: Sustainable and low-waste printing process',
  },
  {
    icon: '💡',
    description: 'Design Assistance: Guidance on printability and material choice',
  },
];

export const App = () => {
  const videoRef = useRef<Nullable<HTMLVideoElement>>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(e => console.error('Error playing video:', e));
    }
  }, []);

  return (
    <>
      <HoneyBox
        $position="relative"
        $height="700px"
        $flexShrink={0}
        $overflow="hidden"
        data-testid="header"
      >
        <BackgroundVideo ref={videoRef} muted playsInline>
          <source src="/assets/videos/background.webm" type="video/webm" />
        </BackgroundVideo>

        <BlurOverlay />

        <HoneyFlexBox
          $position="absolute"
          $top="50%"
          $left="50%"
          $transform="translate(-50%, -50%)"
          $gap={3}
          $textAlign="center"
        >
          <Text variant="h1" $color="neutral.white">
            Precision FDM 3D Printing. Made Real.
          </Text>

          <Text variant="subtitle1" $color="neutral.white">
            High-quality FDM printing for your prototypes, parts and creative designs - made with
            professional grade materials and printers.
          </Text>

          <HoneyBox $display="flex" $justifyContent="center" $gap={2} $marginTop={3}>
            <Button color="accent" size="large" $height="50px">
              Get a Quote
            </Button>

            <Button color="secondary" size="large" $height="50px">
              See Details
            </Button>
          </HoneyBox>
        </HoneyFlexBox>
      </HoneyBox>

      <HoneyBox $padding={5} $backgroundColor="secondary.cloudMist">
        <Container $gap={3} $alignItems="center">
          <Text variant="h3" $textAlign="center">
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
                />

                <Text variant="subtitle2" $textAlign="center">
                  {showcaseItem.description}
                </Text>
              </HoneyFlexBox>
            ))}
          </HoneyBox>
        </Container>
      </HoneyBox>

      <Container $padding={{ xs: 3, md: 5 }} $gap={7}>
        <HoneyBox $display="flex" $gap={3} $flexWrap={{ xs: 'wrap', lg: 'nowrap' }}>
          <HoneyBox
            $width="100%"
            $maxWidth="450px"
            $minHeight="450px"
            $backgroundImage="url('/assets/images/IMG_1660.webp')"
            $backgroundSize="cover"
            $borderRadius="6px"
            $margin={[0, 'auto']}
          />

          <HoneyFlexBox $width="100%" $gap={3}>
            <Text variant="h3" $textAlign="center">
              Crafting with Precision, Layer by Layer
            </Text>

            <Text variant="body1">
              Using advanced FDM technology, we bring your designs to life layer by layer with
              exceptional precision. Each print is crafted using premium-quality filament to ensure
              outstanding detail, strength, and surface finish — so your model looks exactly as
              envisioned.
            </Text>

            <HoneyBox $display="flex" $gap={2} $justifyContent="center" $flexWrap="wrap">
              {FEATURES.map((feature, featureIndex) => (
                <HoneyBox
                  key={featureIndex}
                  $display="flex"
                  $gap={1}
                  $width="calc(50% - 8px)"
                  $minWidth="250px"
                  $padding={2}
                  $border="1px solid"
                  $borderColor="neutral.grayLight"
                  $borderRadius="6px"
                >
                  <div>{feature.icon}</div>

                  <Text variant="body1">{feature.description}</Text>
                </HoneyBox>
              ))}
            </HoneyBox>
          </HoneyFlexBox>
        </HoneyBox>

        <HoneyFlexBox $gap={3}>
          <Text variant="h3" $textAlign="center">
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
                  $backgroundImage="url('/assets/images/filament.webp')"
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
    </>
  );
};
