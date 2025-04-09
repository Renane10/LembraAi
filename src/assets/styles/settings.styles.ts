import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  titleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    marginBottom: 15,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  optionTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  optionText: {
    fontSize: 16,
  },
  pickerContainer: {
    width: 100,
  },
  infoContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  version: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
    opacity: 0.6,
  },
});

export const getHeaderImageStyle = (
  colorScheme: string | null | undefined,
) => ({
  opacity: colorScheme === 'dark' ? 0.8 : 0.1,
  transform: [{ rotate: '-10deg' }],
});
