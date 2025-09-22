import { StyleSheet } from 'react-native';

export const roleColors = {
  farmer: '#4CAF50',
  exporter: '#2196F3',
  organization: '#FF9800',
  fermentaryOwner: '#9C27B0',
};

export const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  meta: {
    fontSize: 14,
    marginBottom: 4,
    fontWeight: '600',
  },
  content: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 6,
  },
  timestamp: {
    fontSize: 12,
    color: '#ccc',
  },
  likeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  likeText: {
    marginLeft: 6,
    color: '#FF6F61',
    fontWeight: '600',
  },
});
