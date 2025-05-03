import React, { FC } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity,
  Image
} from 'react-native';

import { fontFamily, fontSize, IColorScheme, Radius, PLACEHOLDER_IMAGE } from '@/constants';
import { hp, wp } from '@/helpers/dimensions';
import { Unit } from '@/types/club';

interface UnitsListProps {
  units: Unit[];
  theme: IColorScheme;
  onUnitPress: (unit: Unit) => void;
  onAddUnitPress: () => void;
}

const UnitsList: FC<UnitsListProps> = ({ units, theme, onUnitPress, onAddUnitPress }) => {
  const styles = createStyles(theme);
  
  const renderUnitItem = ({ item }: { item: Unit }) => {
    return (
      <TouchableOpacity 
        style={styles.unitCard}
        onPress={() => onUnitPress(item)}
      >
        <Image 
          source={{ uri: item.images.length > 0 ? item.images[0].filePath : PLACEHOLDER_IMAGE }} 
          style={styles.unitImage} 
        />
        <View style={styles.unitContent}>
          <View style={styles.unitHeader}>
            <Text style={styles.unitName}>{item.name}</Text>
            <View style={[styles.statusBadge, item.status === 1 ? styles.activeStatus : styles.inactiveStatus]}>
              <Text style={styles.statusText}>{item.status === 1 ? 'Active' : 'Inactive'}</Text>
            </View>
          </View>
          <Text style={styles.unitDetail}>Open: {item.openTime} - {item.closeTime}</Text>
          <Text style={styles.unitDetail}>Phone: {item.phone}</Text>
          <Text style={styles.unitDetail}>
            Sport Types: {item.sportTypes.map(st => st.name).join(', ')}
          </Text>
          <View style={styles.unitFooter}>
            <Text style={styles.unitFooterText}>
              Services: {item.services.length}
            </Text>
            <Text style={styles.unitFooterText}>
              Prices: {item.prices.length}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Units</Text>
        <TouchableOpacity style={styles.addButton} onPress={onAddUnitPress}>
          <Text style={styles.addButtonText}>+ Add Unit</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={units}
        renderItem={renderUnitItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const createStyles = (theme: IColorScheme) => StyleSheet.create({
  container: {
    backgroundColor: theme.white,
    borderRadius: Radius.md,
    padding: wp(4),
    marginBottom: hp(2),
    shadowColor: theme.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  title: {
    ...fontFamily.RALEWAY_BOLD,
    fontSize: fontSize.lg,
    color: theme.textDark,
  },
  addButton: {
    backgroundColor: theme.primary,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: Radius.xs,
  },
  addButtonText: {
    ...fontFamily.POPPINS_MEDIUM,
    fontSize: fontSize.xs,
    color: theme.white,
  },
  listContent: {
    paddingBottom: hp(1),
  },
  unitCard: {
    flexDirection: 'row',
    backgroundColor: theme.backgroundLight,
    borderRadius: Radius.md,
    marginBottom: hp(2),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  unitImage: {
    width: wp(25),
    height: '100%',
  },
  unitContent: {
    flex: 1,
    padding: wp(3),
  },
  unitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  unitName: {
    ...fontFamily.RALEWAY_BOLD,
    fontSize: fontSize.md,
    color: theme.textDark,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.3),
    borderRadius: Radius.full,
  },
  activeStatus: {
    backgroundColor: theme.success,
  },
  inactiveStatus: {
    backgroundColor: theme.error,
  },
  statusText: {
    ...fontFamily.POPPINS_MEDIUM,
    fontSize: fontSize.xs,
    color: theme.white,
  },
  unitDetail: {
    ...fontFamily.POPPINS_REGULAR,
    fontSize: fontSize.xs,
    color: theme.textMedium,
    marginBottom: hp(0.5),
  },
  unitFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(0.5),
  },
  unitFooterText: {
    ...fontFamily.POPPINS_MEDIUM,
    fontSize: fontSize.xs,
    color: theme.primary,
  },
});

export default UnitsList;
