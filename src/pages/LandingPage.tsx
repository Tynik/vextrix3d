import React from 'react';
import { useHoneyStyle } from '@react-hive/honey-style';
import { HoneyBox, HoneyFlexBox } from '@react-hive/honey-layout';

import { MATERIALS } from '~/configs';
import { Container, Text } from '~/components';
import { QuoteRequestButton } from './widgets';

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
    description: 'Wide range of materials - PLA, PETG, ABS, ASA, and more',
  },
  {
    icon: '⚙️',
    description: 'Functional prototypes - Durable, accurate, and ready for real testing',
  },
  {
    icon: '🎨',
    description:
      'Clean print quality - Smooth layers and precise detailing for professional results',
  },
  {
    icon: '🚀',
    description: 'Fast turnaround - From upload to finished print in record time',
  },
  {
    icon: '📏',
    description: 'Dimensional accuracy - Consistent tolerances across all technologies',
  },
  {
    icon: '🔩',
    description: 'Strong mechanical parts - Optimized for strength and long-term durability',
  },
  {
    icon: '🌿',
    description: 'Eco-friendly options - Sustainable materials and low-waste processes',
  },
  {
    icon: '💡',
    description: 'Design assistance - Guidance on printability and the best material choice',
  },
  {
    icon: '🔬',
    description:
      'Ultra-high detail - Resin prints with ~16.8 × 24.8 µm X/Y resolution for sharp fine features',
  },
  {
    icon: '💎',
    description:
      'Premium surface finish - Virtually invisible layers for smooth, high-quality parts',
  },
  {
    icon: '🌌',
    description:
      'Large resin build volume - Up to 223(L) × 126(W) × 230(H) mm for bigger detailed models',
  },
  {
    icon: '🧷',
    description:
      'Tiny and intricate components - Perfect for miniatures, jewelry, and micro-mechanical parts',
  },
];

export const LandingPage = () => {
  const { resolveColor } = useHoneyStyle();

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
            Precision FDM/SLA 3D Printing
          </Text>

          <Text variant="subtitle1" $color="neutral.white" shadow="strong">
            High-quality FDM/SLA printing for your prototypes, parts and creative designs - made
            with professional grade materials and printers.
          </Text>

          <QuoteRequestButton $marginTop={3} $margin={[0, 'auto']} />
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
                    $borderRadius="4px"
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
                $borderRadius="4px"
                $margin={[0, 'auto']}
              />

              <HoneyFlexBox $width="100%" $gap={3}>
                <Text variant="h3" $textAlign="center" $textTransform="uppercase">
                  Crafting with Precision
                </Text>

                <Text variant="body1">
                  Using advanced FDM and SLA technologies, we bring your designs to life with
                  exceptional precision. Whether printed with premium filaments or high-resolution
                  resins, every model is crafted for outstanding detail, strength, and a smooth
                  professional finish.
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
                      $borderRadius="4px"
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
                {MATERIALS.map(material => (
                  <HoneyBox
                    key={material.name}
                    $display="flex"
                    $gap={2}
                    $width="100%"
                    $maxWidth="450px"
                    $minHeight="150px"
                    $padding={2}
                    $borderRadius="4px"
                    $border="1px solid"
                    $borderColor="neutral.grayLight"
                  >
                    <HoneyBox
                      $flexShrink={0}
                      $width="100px"
                      $height="100px"
                      $backgroundImage={`url('/assets/images/${material.image}')`}
                      $backgroundSize="cover"
                    />

                    <HoneyFlexBox $gap={1}>
                      <Text variant="subtitle1">{material.name}</Text>
                      <Text variant="body1">{material.description}</Text>
                    </HoneyFlexBox>
                  </HoneyBox>
                ))}
              </HoneyBox>
            </HoneyFlexBox>

            <QuoteRequestButton $margin={[0, 'auto']} />
          </Container>
        </HoneyBox>
      </main>
    </>
  );
};
