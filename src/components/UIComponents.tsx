import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  StyleSheet,
  Animated,
  ViewStyle,
} from 'react-native';
import {COLORS, FONT_SIZES, SPACING, RADIUS, SHADOW} from '../utils/theme';

// ── Item types ─────────────────────────────────
export interface IndustryItem {
  id: number | string;
  name: string;
  imageUrl: string | null;
  image?: string;
}

export interface JobItem {
  id: number | string;
  title: string;
  company_name?: string;
  imageUrl: string | null;
  image?: string;
  job_type?: string;
  location?: string;
  salary?: string;
}

export interface CompanyItem {
  id: number | string;
  name: string;
  imageUrl: string | null;
  image?: string;
  open_jobs?: number;
}

// ── PrimaryButton ──────────────────────────────
interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  loading,
  disabled,
  style,
}) => (
  <TouchableOpacity
    style={[styles.primaryBtn, disabled && styles.btnDisabled, style]}
    onPress={onPress}
    disabled={disabled || loading}
    activeOpacity={0.85}>
    {loading ? (
      <ActivityIndicator color={COLORS.white} size="small" />
    ) : (
      <Text style={styles.primaryBtnText}>{title}</Text>
    )}
  </TouchableOpacity>
);

// ── SecondaryButton ────────────────────────────
interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  title,
  onPress,
  style,
}) => (
  <TouchableOpacity
    style={[styles.secondaryBtn, style]}
    onPress={onPress}
    activeOpacity={0.85}>
    <Text style={styles.secondaryBtnText}>{title}</Text>
  </TouchableOpacity>
);

// ── SectionHeader ──────────────────────────────
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  onSeeAll?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  onSeeAll,
}) => (
  <View style={styles.sectionHeader}>
    <View style={{flex: 1}}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle ? (
        <Text style={styles.sectionSubtitle}>{subtitle}</Text>
      ) : null}
    </View>
    {onSeeAll && (
      <TouchableOpacity onPress={onSeeAll}>
        <Text style={styles.seeAll}>See All</Text>
      </TouchableOpacity>
    )}
  </View>
);

// ── SkeletonBox ────────────────────────────────
interface SkeletonBoxProps {
  width: number | string;
  height: number;
  style?: ViewStyle;
}

export const SkeletonBox: React.FC<SkeletonBoxProps> = ({
  width,
  height,
  style,
}) => {
  const opacity = React.useRef(new Animated.Value(0.4)).current;

  React.useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: COLORS.skeleton,
          borderRadius: RADIUS.md,
          opacity,
        },
        style,
      ]}
    />
  );
};

// ── IndustryCard ───────────────────────────────
interface IndustryCardProps {
  item: IndustryItem;
  onPress?: () => void;
}

export const IndustryCard: React.FC<IndustryCardProps> = ({item, onPress}) => (
  <TouchableOpacity
    style={styles.industryCard}
    onPress={onPress}
    activeOpacity={0.85}>
    <Image
      source={{uri: item.imageUrl ?? undefined}}
      style={styles.industryImage}
      resizeMode="cover"
    />
    <View style={styles.industryOverlay}>
      <Text style={styles.industryName} numberOfLines={2}>
        {item.name}
      </Text>
    </View>
  </TouchableOpacity>
);

// ── JobCard ────────────────────────────────────
interface JobCardProps {
  item: JobItem;
  onPress?: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({item, onPress}) => (
  <TouchableOpacity
    style={styles.jobCard}
    onPress={onPress}
    activeOpacity={0.85}>
    <Image
      source={{uri: item.imageUrl ?? undefined}}
      style={styles.jobLogo}
      resizeMode="contain"
    />
    <View style={styles.jobInfo}>
      <Text style={styles.jobTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.jobCompany} numberOfLines={1}>
        {item.company_name}
      </Text>
      <View style={styles.jobMeta}>
        {item.job_type ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.job_type}</Text>
          </View>
        ) : null}
        {item.location ? (
          <Text style={styles.jobLocation}>📍 {item.location}</Text>
        ) : null}
      </View>
    </View>
    {item.salary ? (
      <Text style={styles.jobSalary}>{item.salary}</Text>
    ) : null}
  </TouchableOpacity>
);

// ── CompanyCard ────────────────────────────────
interface CompanyCardProps {
  item: CompanyItem;
  onPress?: () => void;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({item, onPress}) => (
  <TouchableOpacity
    style={styles.companyCard}
    onPress={onPress}
    activeOpacity={0.85}>
    <Image
      source={{uri: item.imageUrl ?? undefined}}
      style={styles.companyLogo}
      resizeMode="contain"
    />
    <Text style={styles.companyName} numberOfLines={2}>
      {item.name}
    </Text>
    {item.open_jobs !== undefined && (
      <Text style={styles.companyJobs}>{item.open_jobs} Jobs</Text>
    )}
  </TouchableOpacity>
);

// ── ErrorView ──────────────────────────────────
interface ErrorViewProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({message, onRetry}) => (
  <View style={styles.errorView}>
    <Text style={styles.errorEmoji}>⚠️</Text>
    <Text style={styles.errorText}>{message}</Text>
    {onRetry && (
      <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
        <Text style={styles.retryText}>Try Again</Text>
      </TouchableOpacity>
    )}
  </View>
);

// ── Styles ─────────────────────────────────────
const styles = StyleSheet.create({
  primaryBtn: {
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW.md,
  },
  primaryBtnText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  btnDisabled: {opacity: 0.55},
  secondaryBtn: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    paddingVertical: 13,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.full,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  sectionSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  seeAll: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.accent,
    fontWeight: '600',
  },
  industryCard: {
    width: 130,
    height: 110,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginRight: SPACING.md,
    ...SHADOW.sm,
  },
  industryImage: {width: '100%', height: '100%'},
  industryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
    padding: SPACING.sm,
  },
  industryName: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
  },
  jobCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    alignItems: 'center',
    ...SHADOW.sm,
  },
  jobLogo: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background,
    marginRight: SPACING.md,
  },
  jobInfo: {flex: 1},
  jobTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  jobCompany: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  jobMeta: {flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 8},
  badge: {
    backgroundColor: '#EBF8FF',
    borderRadius: RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    fontWeight: '600',
  },
  jobLocation: {fontSize: FONT_SIZES.xs, color: COLORS.textMuted},
  jobSalary: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: COLORS.accent,
    marginLeft: SPACING.sm,
  },
  companyCard: {
    width: 120,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    marginRight: SPACING.md,
    ...SHADOW.sm,
  },
  companyLogo: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background,
    marginBottom: SPACING.sm,
  },
  companyName: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  companyJobs: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.accent,
    marginTop: 4,
    fontWeight: '600',
  },
  errorView: {alignItems: 'center', padding: SPACING.xl},
  errorEmoji: {fontSize: 32, marginBottom: SPACING.sm},
  errorText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
  },
  retryText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: FONT_SIZES.sm,
  },
});
