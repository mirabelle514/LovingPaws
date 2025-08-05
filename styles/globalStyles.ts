import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const globalStyles = StyleSheet.create({
  // Home Screen Layout Styles
  homeContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  homeScrollView: {
    flex: 1,
  },
  homeHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  homeGreeting: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  homeWelcomeText: {
    fontSize: 16,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  homeSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  homeSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  homeSectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
  },
  homeAddButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.border.dark,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  homePetsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  homeQuickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  homeRecentEntries: {
    gap: 12,
  },
  homeInsightCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  homeInsightBackground: {
    padding: 20,
  },
  homeInsightContent: {
    alignItems: 'flex-start',
  },
  homeInsightTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.inverse,
    marginBottom: 8,
  },
  homeInsightText: {
    fontSize: 14,
    color: colors.text.inverse,
    opacity: 0.9,
    marginBottom: 16,
    lineHeight: 20,
  },
  homeInsightButton: {
    backgroundColor: colors.main.dustyBlue,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.main.dustyBlue,
  },
  homeInsightButtonText: {
    color: colors.text.primary,
    fontWeight: '600',
    fontSize: 14,
  },

  // QuickActionCard Styles
  quickActionCardContainer: {
    width: '48%',
    marginBottom: 12
  },
  quickActionCard: {
    padding: 16,
    borderRadius: 16,
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  quickActionCardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.main.softPeriwinkle,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.inverse,
    textAlign: 'center',
    marginBottom: 4,
  },
  quickActionCardSubtitle: {
    fontSize: 12,
    color: colors.text.inverse,
    opacity: 0.9,
    textAlign: 'center',
  },

  // PetCard Styles
  petCardContainer: {
    marginRight: 16,
  },
  petCard: {
    width: 280,
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 16,
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  petCardImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 12,
  },
  petCardContent: {
    gap: 8,
  },
  petCardName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  petCardDetails: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  petCardHealthSection: {
    marginTop: 8,
  },
  petCardHealthLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '500',
    marginBottom: 6,
  },
  petCardHealthBar: {
    height: 6,
    backgroundColor: colors.border.light,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  petCardHealthFill: {
    height: '100%',
    borderRadius: 3,
  },
  petCardHealthScore: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'right',
  },
  petCardLastCheckup: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 4,
  },

  // RecentEntry Styles
  recentEntryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.dark,
    padding: 16,
    borderRadius: 12,
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  recentEntryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.main.softPeriwinkle,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recentEntryContent: {
    flex: 1,
  },
  recentEntryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  recentEntryDetails: {
    fontSize: 14,
    color: colors.text.primary,
    marginBottom: 2,
  },
  recentEntryTime: {
    fontSize: 12,
    color: colors.text.primary,
  },

  // EmergencyAlert Styles
  emergencyAlertContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  emergencyAlertCard: {
    backgroundColor: colors.main.warmOffWhite,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.main.deepBlueGray,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emergencyAlertIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.main.softPeriwinkle,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  emergencyAlertContent: {
    flex: 1,
  },
  emergencyAlertTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 2,
  },
  emergencyAlertSubtitle: {
    fontSize: 12,
    color: colors.text.primary,
    lineHeight: 16,
  },
  emergencyAlertCallButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.main.softPeriwinkle,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  // ActionButton Styles
  actionButtonContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionButtonPrimary: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonPrimaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.inverse,
  },
  actionButtonSecondary: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.main.deepBlueGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonSecondaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.main.deepBlueGray,
  },

  // ProfileHeader Styles
  profileHeaderContainer: {
    marginBottom: 24,
  },
  profileHeaderBackground: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  profileHeaderSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileHeaderAvatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profileHeaderAvatar: {
    width: '80%',
    height: 200,
    maxWidth: 300,
    borderRadius: 10,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.dark,
  },
  profileHeaderAvatarText: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.text.inverse,
  },
  profileHeaderCameraButton: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background.quaternary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  profileHeaderUserInfo: {
    flex: 1,
  },
  profileHeaderUserName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.inverse,
    marginBottom: 2,
  },
  profileHeaderUserEmail: {
    fontSize: 14,
    color: colors.text.inverse,
    opacity: 0.9,
    marginBottom: 2,
  },
  profileHeaderMemberSince: {
    fontSize: 12,
    color: colors.text.inverse,
    opacity: 0.7,
  },
  profileHeaderEditButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.overlay.light,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.overlay.medium,
  },

  // AnalyticsCard Styles
  analyticsCardContainer: {
    width: '48%',
    marginBottom: 12,
  },
  analyticsCard: {
    padding: 16,
    borderRadius: 16,
    minHeight: 120,
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  analyticsCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  analyticsCardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.main.softPeriwinkle,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  analyticsCardTitle: {
    fontSize: 12,
    color: colors.text.inverse,
    opacity: 0.9,
    marginBottom: 4,
  },
  analyticsCardValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.inverse,
    marginBottom: 2,
  },
  analyticsCardChange: {
    fontSize: 12,
    color: colors.text.inverse,
    opacity: 0.8,
  },

  // VetClinicCard Styles
  vetClinicCardContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 16,
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  vetClinicCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  vetClinicCardInfo: {
    flex: 1,
  },
  vetClinicCardName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  vetClinicCardAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  vetClinicCardAddress: {
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: 4,
    flex: 1,
  },
  vetClinicCardDistance: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  vetClinicCardRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  vetClinicCardRatingText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.main.deepBlueGray,
    marginLeft: 4,
  },
  vetClinicCardStatusRow: {
    marginBottom: 12,
  },
  vetClinicCardStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vetClinicCardStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  vetClinicCardStatusText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginRight: 8,
  },
  vetClinicCardHoursText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  vetClinicCardSpecialties: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 6,
  },
  vetClinicCardSpecialtyTag: {
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  vetClinicCardSpecialtyText: {
    fontSize: 12,
    color: colors.main.deepBlueGray,
    fontWeight: '500',
  },
  vetClinicCardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  vetClinicCardActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.main.deepBlueGray,
    backgroundColor: colors.background.secondary,
  },
  vetClinicCardActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.main.deepBlueGray,
    marginLeft: 4,
  },
  vetClinicCardPrimaryAction: {
    backgroundColor: colors.main.deepBlueGray,
    borderColor: colors.main.deepBlueGray,
  },
  vetClinicCardPrimaryActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.inverse,
  },

  // EntryTypeCard Styles
  entryTypeCardContainer: {
    width: '48%',
    marginBottom: 12,
  },
  entryTypeCard: {
    padding: 16,
    borderRadius: 16,
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  entryTypeCardSelected: {
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  entryTypeCardUnselected: {
    borderWidth: 2,
    borderColor: colors.border.light,
  },
  entryTypeCardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.main.softPeriwinkle,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryTypeCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  entryTypeCardSubtitle: {
    fontSize: 12,
    textAlign: 'center',
  },

  // HealthTrendChart Styles
  healthTrendChartContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  healthTrendChart: {
    flexDirection: 'row',
    height: 140,
  },
  healthTrendChartYAxis: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 8,
    width: 30,
  },
  healthTrendChartAxisLabel: {
    fontSize: 10,
    color: colors.text.tertiary,
  },
  healthTrendChartArea: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  healthTrendChartBarsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  healthTrendChartBarColumn: {
    alignItems: 'center',
    flex: 1,
  },
  healthTrendChartBar: {
    width: 20,
    borderRadius: 4,
    marginBottom: 8,
    minHeight: 4,
  },
  healthTrendChartDayLabel: {
    fontSize: 10,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  healthTrendChartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  healthTrendChartLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthTrendChartLegendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  healthTrendChartLegendText: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '500',
  },

  // SettingsItem Styles
  settingsItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  settingsItemIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.main.softPeriwinkle,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsItemTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  settingsItemRightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // EmergencyContact Styles
  emergencyContactContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.shadow.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  emergencyContactCard: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emergencyContactIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.main.softPeriwinkle,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  emergencyContactContent: {
    flex: 1,
  },
  emergencyContactTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.inverse,
    marginBottom: 4,
  },
  emergencyContactSubtitle: {
    fontSize: 12,
    color: colors.text.inverse,
    opacity: 0.9,
    lineHeight: 16,
  },
  emergencyContactActions: {
    flexDirection: 'row',
    gap: 8,
  },
  emergencyContactButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.overlay.light,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.overlay.medium,
  },

  // PetSelector Styles
  petSelectorContainer: {
    gap: 12,
  },
  petSelectorOption: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.light,
    elevation: 2,
  },
  petSelectorSelectedOption: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
  },
  petSelectorInfo: {
    flex: 1,
  },
  petSelectorName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 2,
  },
  petSelectorSelectedName: {
    color: colors.main.deepBlueGray,
  },
  petSelectorType: {
    fontSize: 14,
    color: colors.text.primary,
  },
  petSelectorSelectedType: {
    color: colors.text.primary,
  },
  petSelectorRadioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  petSelectorSelectedRadioButton: {
    borderColor: colors.main.deepBlueGray,
  },
  petSelectorRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.main.deepBlueGray,
  },

  // NotFound Styles
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
  },
  notFoundLink: {
    marginTop: 15,
    paddingVertical: 15,
  },

  // Profile Screen Styles
  profileContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  profileScrollView: {
    flex: 1,
  },
  profileSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  profileSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
  },
  profileStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  profileStatCard: {
    width: '48%',
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  profileStatValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.main.deepBlueGray,
    marginBottom: 4,
  },
  profileStatLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  profileSettingsList: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  profileFooter: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  profileAppVersion: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginBottom: 4,
  },
  profileFooterText: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },

  // Analytics Screen Styles
  analyticsContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  analyticsScrollView: {
    flex: 1,
  },
  analyticsHeader: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  analyticsTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  analyticsSubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  analyticsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  analyticsSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  analyticsInsightCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.shadow.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  analyticsInsightBackground: {
    padding: 20,
  },
  analyticsInsightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  analyticsInsightTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.inverse,
    marginLeft: 12,
  },
  analyticsInsightText: {
    fontSize: 14,
    color: colors.text.inverse,
    opacity: 0.9,
    marginBottom: 16,
    lineHeight: 20,
  },
  analyticsInsightButton: {
    backgroundColor: colors.overlay.light,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.overlay.medium,
    alignSelf: 'flex-start',
  },
  analyticsInsightButtonText: {
    color: colors.text.inverse,
    fontWeight: '600',
    fontSize: 14,
  },
  analyticsPatternsList: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  analyticsPatternItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  analyticsPatternDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.main.deepBlueGray,
    marginRight: 12,
  },
  analyticsPatternText: {
    fontSize: 14,
    color: colors.text.secondary,
    flex: 1,
  },

  // Add Entry Screen Styles
  addEntryContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  addEntryScrollView: {
    flex: 1,
  },
  addEntryHeader: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  addEntryTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  addEntrySubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  addEntrySection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  addEntrySectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
  },
  addEntryTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  addEntryNotesContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  addEntryNotesInput: {
    backgroundColor: colors.main.warmOffWhite,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text.primary,
    minHeight: 120,
    borderWidth: 1,
    borderColor: colors.main.deepBlueGray,
  },
  addEntryActions: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 12,
  },

  // Veterinary Screen Styles
  veterinaryContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  veterinaryScrollView: {
    flex: 1,
  },
  veterinaryHeader: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  veterinaryTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  veterinarySubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  veterinarySection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  veterinarySectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
  },
  veterinarySearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.main.warmOffWhite,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.main.deepBlueGray,
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  veterinarySearchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: colors.main.warmOffWhite,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.main.deepBlueGray,
  },
  veterinaryQuickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  veterinaryActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.main.deepBlueGray,
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  veterinaryActionText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: colors.main.deepBlueGray,
  },
  veterinaryVetList: {
    gap: 16,
  },
  veterinaryAppointmentsList: {
    gap: 12,
  },
  veterinaryAppointmentItem: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  veterinaryAppointmentDate: {
    width: 60,
    alignItems: 'center',
    marginRight: 16,
  },
  veterinaryAppointmentDay: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.main.deepBlueGray,
  },
  veterinaryAppointmentMonth: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  veterinaryAppointmentDetails: {
    flex: 1,
  },
  veterinaryAppointmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  veterinaryAppointmentVet: {
    fontSize: 14,
    color: colors.main.deepBlueGray,
    marginBottom: 2,
  },
  veterinaryAppointmentTime: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  veterinaryAppointmentAction: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.background.tertiary,
    borderRadius: 8,
  },
  veterinaryAppointmentActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.main.deepBlueGray,
  },

  // Profile Edit Screen Styles
  profileHeaderBackButton: {
    padding: 8,
  },
  profileHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  profileHeaderSaveButton: {
    padding: 8,
  },
  profileAvatarSection: {
    alignItems: 'flex-start',
    marginTop: 16,
  },
  profileFormField: {
    marginBottom: 20,
  },
  profileFormLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  profileFormInput: {
    backgroundColor: colors.main.warmOffWhite,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text.primary,
    borderWidth: 2, // Increased border width for better visibility
    borderColor: colors.border.medium, // Using a more visible border color
    // Platform-specific fixes
    textAlignVertical: 'top', // Android
    includeFontPadding: false, // Android
    // iOS specific
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
    // Additional properties to ensure styling works
    minHeight: 48,
    textAlign: 'left',
    // Ensure border is visible
    borderStyle: 'solid',
  },
  profileFormReadOnly: {
    backgroundColor: colors.main.warmOffWhite,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.medium,
  },
  profileSettingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  profileSettingsItemText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  profileSettingsItemArrow: {
    fontSize: 18,
    color: colors.text.secondary,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  profileSaveButton: {
    backgroundColor: colors.main.deepBlueGray,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileSaveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background.primary,
  },
  profileHeaderAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
    resizeMode: 'cover',
  },
  petTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  petTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border.dark,
    backgroundColor: colors.background.primary,
    gap: 6,
  },
  petTypeSelectedOption: {
    borderColor: colors.main.deepBlueGray,
    backgroundColor: colors.main.deepBlueGray,
  },
  petTypeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
  petTypeSelectedLabel: {
    color: colors.background.primary,
  },

  // Emergency Alert Styles
  emergencySymptomContainer: {
    backgroundColor: colors.background.tertiary,
    borderRadius: 12,
    padding: 16,
  },
  emergencySymptomTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  emergencySymptomText: {
    fontSize: 14,
    color: colors.text.primary,
    marginTop: 8,
  },

  // Health Entry Details Styles
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    backgroundColor: colors.background.primary,
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginVertical: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 8,
  },
  detailValue: {
    fontSize: 16,
    color: colors.text.primary,
    flex: 1,
    textAlign: 'right',
  },

  // Dropdown Styles
  dropdownContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: colors.border.light,
    position: 'absolute',
    top: 60,
    zIndex: 1000,
    elevation: 5,
    shadowColor: colors.shadow.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  dropdownOptionText: {
    textAlign: 'center',
  },
  dropdownOptionTextSelected: {
    color: colors.main.deepBlueGray,
    fontWeight: '600',
  },
  dropdownOptionTextUnselected: {
    color: colors.text.primary,
    fontWeight: '400',
  },
  dropdownTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    color: colors.text.primary,
  },
  dropdownTextPlaceholder: {
    color: colors.text.secondary,
  },
  formRow: {
    flexDirection: 'row',
    gap: 8,
  },
  formInputFlex: {
    flex: 0.6,
  },
  formInputFull: {
    flex: 1,
  },
  formDropdownFlex: {
    flex: 0.4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  formInputMultiline: {
    height: 80,
  },

}); 