import type { ExternalPathString} from 'expo-router';

import React from 'react';
import { Link } from 'expo-router';
import { Platform } from 'react-native';
import { type ComponentProps } from 'react';
import { openBrowserAsync } from 'expo-web-browser';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: string };

export function ExternalLink({ href, ...rest }: Props) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href as ExternalPathString}
      onPress={async (event) => {
        if (Platform.OS !== 'web') {
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault();
          // Open the link in an in-app browser.
          await openBrowserAsync(href);
        }
      }}
    />
  );
}
