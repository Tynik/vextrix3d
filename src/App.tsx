import React, { useEffect, useRef } from 'react';
import { resolveColor, styled } from '@react-hive/honey-style';
import { Button, Container, Text } from '~/components';
import type { Nullable } from '~/types';
import { HoneyBox, HoneyFlexBox } from '@react-hive/honey-layout';

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
        <BackgroundVideo ref={videoRef} muted loop playsInline>
          <source src="/assets/videos/background.mp4" type="video/mp4" />
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
            {Array.from({ length: 4 }).map((_, index) => (
              <HoneyBox
                key={index}
                $width="250px"
                $height="250px"
                $backgroundColor="neutral.grayLight"
                $borderRadius="6px"
              />
            ))}
          </HoneyBox>
        </Container>
      </HoneyBox>

      <Container $padding={5} $gap={5}>
        <HoneyBox $display="flex" $gap={2}>
          <HoneyBox
            $width="100%"
            $height="350px"
            $backgroundImage="url('/assets/images/IMG_1660.webp')"
            $backgroundSize="cover"
            $borderRadius="6px"
          />

          <HoneyFlexBox $width="100%" $gap={3}>
            <Text variant="h3" $textAlign="center">
              Crafting with Precision, Layer by Layer
            </Text>

            <Text variant="subtitle2">
              Using advance FDM technology, we create a 3D model of your design, layer by layer,
              ensuring that each layer is printed with the highest quality possible. Every model is
              printed with a high-quality filament, ensuring that your design is perfect.
            </Text>
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

                <HoneyFlexBox $gap={2}>
                  <Text variant="h6">{filament.name}</Text>
                  <Text variant="subtitle2">{filament.description}</Text>
                </HoneyFlexBox>
              </HoneyBox>
            ))}
          </HoneyBox>
        </HoneyFlexBox>
      </Container>
    </>
  );
};
