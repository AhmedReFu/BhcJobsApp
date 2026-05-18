import React, {useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useIndustries, useJobs, useCompanies} from '../hooks/useFetch';
import {
  getIndustryImageUrl,
  getJobImageUrl,
  getCompanyImageUrl,
} from '../services/api';
import {
  SectionHeader,
  IndustryCard,
  JobCard,
  CompanyCard,
  SkeletonBox,
  ErrorView,
  IndustryItem,
  JobItem,
  CompanyItem,
} from '../components/UIComponents';
import {COLORS, FONT_SIZES, SPACING, RADIUS, SHADOW} from '../utils/theme';
import {RootStackParamList} from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Landing'>;

const IndustrySkeleton = () => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={{paddingLeft: SPACING.lg}}>
    {[...Array(4)].map((_, i) => (
      <SkeletonBox
        key={i}
        width={130}
        height={110}
        style={{marginRight: SPACING.md}}
      />
    ))}
  </ScrollView>
);

const JobSkeleton = () => (
  <View>
    {[...Array(3)].map((_, i) => (
      <View
        key={i}
        style={[
          styles.jobSkeletonRow,
          {marginHorizontal: SPACING.lg, marginBottom: SPACING.md},
        ]}>
        <SkeletonBox width={52} height={52} style={{marginRight: SPACING.md}} />
        <View style={{flex: 1}}>
          <SkeletonBox width="80%" height={16} style={{marginBottom: 8}} />
          <SkeletonBox width="50%" height={12} />
        </View>
      </View>
    ))}
  </View>
);

interface HeroSectionProps {
  onLoginPress: () => void;
  onRegisterPress: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  onLoginPress,
  onRegisterPress,
}) => (
  <View style={styles.hero}>
    <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
    <View style={styles.heroBubble1} />
    <View style={styles.heroBubble2} />

    <View style={styles.heroNav}>
      <Text style={styles.heroLogo}>
        BHC<Text style={{color: COLORS.accent}}>Jobs</Text>
      </Text>
      <View style={styles.heroNavBtns}>
        <TouchableOpacity style={styles.heroNavBtn} onPress={onLoginPress}>
          <Text style={styles.heroNavBtnText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.heroNavBtnFilled}
          onPress={onRegisterPress}>
          <Text style={styles.heroNavBtnFilledText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>

    <View style={styles.heroContent}>
      <Text style={styles.heroHeadline}>Find Your{'\n'}Dream Job Today</Text>
      <Text style={styles.heroSub}>
        Thousands of opportunities across Bangladesh's top companies
      </Text>

      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Job title, company, or keyword…"
          placeholderTextColor={COLORS.textMuted}
          returnKeyType="search"
        />
      </View>

      <View style={styles.statsRow}>
        {[
          {num: '10K+', label: 'Jobs'},
          {num: '5K+', label: 'Companies'},
          {num: '50K+', label: 'Seekers'},
        ].map(s => (
          <View key={s.label} style={styles.statItem}>
            <Text style={styles.statNum}>{s.num}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>
    </View>
  </View>
);

const LandingScreen: React.FC<Props> = ({navigation}) => {
  const industries = useIndustries();
  const jobs = useJobs();
  const companies = useCompanies();

  const refreshing =
    industries.loading && jobs.loading && companies.loading;

  const onRefresh = useCallback(() => {
    industries.refetch();
    jobs.refetch();
    companies.refetch();
  }, [industries, jobs, companies]);

  const industryItems: IndustryItem[] = (
    (industries.data as any)?.data ||
    industries.data ||
    []
  ).map((item: any) => ({
    ...item,
    imageUrl: getIndustryImageUrl(item.image),
  }));

  const jobItems: JobItem[] = (
    (jobs.data as any)?.data ||
    jobs.data ||
    []
  ).map((item: any) => ({
    ...item,
    imageUrl: getJobImageUrl(item.image),
  }));

  const companyItems: CompanyItem[] = (
    (companies.data as any)?.data ||
    companies.data ||
    []
  ).map((item: any) => ({
    ...item,
    imageUrl: getCompanyImageUrl(item.image),
  }));

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }>
        <HeroSection
          onLoginPress={() => navigation.navigate('Login')}
          onRegisterPress={() => navigation.navigate('Register')}
        />

        <View style={styles.section}>
          <SectionHeader
            title="Popular Industries"
            subtitle="Explore jobs by sector"
            onSeeAll={() => {}}
          />
          {industries.loading ? (
            <IndustrySkeleton />
          ) : industries.error ? (
            <ErrorView
              message={industries.error}
              onRetry={industries.refetch}
            />
          ) : (
            <FlatList
              data={industryItems}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => String(item.id)}
              renderItem={({item}) => <IndustryCard item={item} />}
              contentContainerStyle={{
                paddingLeft: SPACING.lg,
                paddingRight: SPACING.sm,
              }}
            />
          )}
        </View>

        <View style={[styles.section, {backgroundColor: COLORS.background}]}>
          <SectionHeader
            title="Recommended Jobs"
            subtitle="Handpicked for you"
            onSeeAll={() => {}}
          />
          {jobs.loading ? (
            <JobSkeleton />
          ) : jobs.error ? (
            <ErrorView message={jobs.error} onRetry={jobs.refetch} />
          ) : (
            jobItems
              .slice(0, 6)
              .map(item => <JobCard key={String(item.id)} item={item} />)
          )}
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Popular Companies"
            subtitle="Top employers hiring now"
            onSeeAll={() => {}}
          />
          {companies.loading ? (
            <IndustrySkeleton />
          ) : companies.error ? (
            <ErrorView
              message={companies.error}
              onRetry={companies.refetch}
            />
          ) : (
            <FlatList
              data={companyItems}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => String(item.id)}
              renderItem={({item}) => <CompanyCard item={item} />}
              contentContainerStyle={{
                paddingLeft: SPACING.lg,
                paddingRight: SPACING.sm,
              }}
            />
          )}
        </View>

        <TouchableOpacity
          style={styles.prepCard}
          onPress={() => navigation.navigate('Questions')}
          activeOpacity={0.85}>
          <View style={styles.prepInfo}>
            <Text style={styles.prepTitle}>Interview Prep PDF</Text>
            <Text style={styles.prepSub}>Generate your full project Q&A document</Text>
          </View>
          <View style={styles.prepIconWrap}>
            <Text style={styles.prepIcon}>📄</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.ctaBanner}>
          <Text style={styles.ctaTitle}>Ready to get hired?</Text>
          <Text style={styles.ctaSub}>
            Join 50,000+ job seekers on BHCJobs
          </Text>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.85}>
            <Text style={styles.ctaBtnText}>Create Free Account</Text>
          </TouchableOpacity>
        </View>

        <View style={{height: SPACING.xxxl}} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: COLORS.primary},
  container: {flex: 1, backgroundColor: COLORS.white},

  hero: {
    backgroundColor: COLORS.primary,
    paddingBottom: SPACING.xxxl + 8,
    overflow: 'hidden',
  },
  heroBubble1: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: -60,
    right: -60,
  },
  heroBubble2: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(240,165,0,0.12)',
    bottom: 20,
    left: -40,
  },
  heroNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg + 20,
  },
  heroLogo: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  heroNavBtns: {flexDirection: 'row', gap: 8},
  heroNavBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  heroNavBtnText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  heroNavBtnFilled: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accent,
  },
  heroNavBtnFilledText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
  },
  heroContent: {paddingHorizontal: SPACING.lg, paddingTop: SPACING.xxl},
  heroHeadline: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: '800',
    color: COLORS.white,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  heroSub: {
    fontSize: FONT_SIZES.md,
    color: 'rgba(255,255,255,0.75)',
    marginTop: SPACING.sm,
    lineHeight: 22,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.lg,
    height: 50,
    marginTop: SPACING.xl,
    ...SHADOW.md,
  },
  searchIcon: {fontSize: 18, marginRight: SPACING.sm},
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: SPACING.xl,
    gap: SPACING.xl,
  },
  statItem: {alignItems: 'center'},
  statNum: {fontSize: FONT_SIZES.xl, fontWeight: '800', color: COLORS.accent},
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  section: {
    paddingVertical: SPACING.xxl,
    backgroundColor: COLORS.white,
  },
  jobSkeletonRow: {flexDirection: 'row', alignItems: 'center'},
  ctaBanner: {
    backgroundColor: COLORS.primary,
    margin: SPACING.lg,
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    alignItems: 'center',
    ...SHADOW.lg,
  },
  ctaTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '800',
    color: COLORS.white,
    textAlign: 'center',
  },
  ctaSub: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  ctaBtn: {
    backgroundColor: COLORS.accent,
    paddingVertical: 12,
    paddingHorizontal: SPACING.xxl,
    borderRadius: RADIUS.full,
    marginTop: SPACING.lg,
    ...SHADOW.sm,
  },
  ctaBtnText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: FONT_SIZES.md,
  },
  prepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  prepInfo: {flex: 1},
  prepTitle: {fontSize: FONT_SIZES.md, fontWeight: '700', color: COLORS.textPrimary},
  prepSub: {fontSize: FONT_SIZES.xs, color: COLORS.textMuted, marginTop: 3},
  prepIconWrap: {
    width: 44, height: 44, borderRadius: RADIUS.lg,
    backgroundColor: '#EBF8FF',
    alignItems: 'center', justifyContent: 'center',
    marginLeft: SPACING.md,
  },
  prepIcon: {fontSize: 22},
});

export default LandingScreen;
