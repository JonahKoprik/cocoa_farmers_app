import { TextStyle } from 'react-native';
import { colors } from './colors';

export const typography: {
  heading: TextStyle;
  subheading: TextStyle;
  body: TextStyle;
  caption: TextStyle;
} = {
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
  },
  subheading: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
  },
  body: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textDark,
  },
  caption: {
    fontSize: 12,
    fontWeight: '300',
    color: colors.textDark,
  },
};
