import React, { FC } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ShadowedView } from 'react-native-fast-shadow';

import { fontFamily, fontSize, IColorScheme, Radius } from '@/constants';
import { hp, wp } from '@/helpers/dimensions';
import { ClubModel } from '@/types/model';

interface ClubInfoProps {
  club: ClubModel;
  theme: IColorScheme;
  onEditPress: () => void;
}

const ClubInfo: FC<ClubInfoProps> = ({ club, theme, onEditPress }) => {
  const styles = createStyles(theme);
  
  return (
    <ShadowedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{club.name}</Text>
          <Text style={styles.subtitle}>{club.address.address}, {club.address.district}, {club.address.province}</Text>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Phone:</Text>
          <Text style={styles.infoValue}>{club.phone}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Sport Types:</Text>
          <Text style={styles.infoValue}>{club.sportTypes.map(st => st.name).join(', ')}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Units:</Text>
          <Text style={styles.infoValue}>{club.units.length} units</Text>
        </View>
      </View>
      
      <Text style={styles.description}>{club.description}</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesContainer}>
        {club.media.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image.filePath }}
            style={styles.image}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
    </ShadowedView>
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
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(2),
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    ...fontFamily.RALEWAY_BOLD,
    fontSize: fontSize.xl,
    color: theme.textDark,
    marginBottom: hp(0.5),
  },
  subtitle: {
    ...fontFamily.POPPINS_REGULAR,
    fontSize: fontSize.sm,
    color: theme.textLight,
  },
  editButton: {
    backgroundColor: theme.primary,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: Radius.xs,
  },
  editButtonText: {
    ...fontFamily.POPPINS_MEDIUM,
    fontSize: fontSize.xs,
    color: theme.white,
  },
  infoContainer: {
    marginBottom: hp(2),
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: hp(0.5),
  },
  infoLabel: {
    ...fontFamily.RALEWAY_MEDIUM,
    fontSize: fontSize.sm,
    color: theme.textDark,
    width: wp(25),
  },
  infoValue: {
    ...fontFamily.POPPINS_REGULAR,
    fontSize: fontSize.sm,
    color: theme.textLight,
    flex: 1,
  },
  description: {
    ...fontFamily.POPPINS_ITALIC,
    fontSize: fontSize.sm,
    color: theme.textDark,
    marginBottom: hp(2),
  },
  imagesContainer: {
    flexDirection: 'row',
    marginBottom: hp(1),
  },
  image: {
    width: wp(25),
    height: wp(25),
    borderRadius: Radius.xs,
    marginRight: wp(2),
  },
});

export default ClubInfo;
