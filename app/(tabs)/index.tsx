import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing, FontSize, FontWeight } from '@/constants/Colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { Star, MapPin, Clock, Users, TrendingUp, Calendar, DollarSign, BarChart3, PieChart, Activity } from 'lucide-react-native';
import { LineChart, BarChart, PieChart as RNPieChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { user } = useAuth();

  if (user?.role === 'restaurant_owner') {
    return <RestaurantOwnerDashboard />;
  }

  return <CustomerHome />;
}

function RestaurantOwnerDashboard() {
  const chartConfig = {
    backgroundColor: Colors.primary,
    backgroundGradientFrom: Colors.primary,
    backgroundGradientTo: Colors.primaryDark,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: Colors.surface
    }
  };

  const revenueData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [12000, 15000, 18000, 22000, 25000, 30000, 28000],
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 3
      }
    ]
  };

  const bookingsData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [8, 12, 15, 18, 20, 25, 22]
      }
    ]
  };

  const popularDishesData = [
    {
      name: "Biryani",
      population: 35,
      color: Colors.primary,
      legendFontColor: Colors.textPrimary,
      legendFontSize: 12,
    },
    {
      name: "Karahi",
      population: 25,
      color: Colors.secondary,
      legendFontColor: Colors.textPrimary,
      legendFontSize: 12,
    },
    {
      name: "BBQ",
      population: 20,
      color: Colors.accent,
      legendFontColor: Colors.textPrimary,
      legendFontSize: 12,
    },
    {
      name: "Others",
      population: 20,
      color: Colors.warning,
      legendFontColor: Colors.textPrimary,
      legendFontSize: 12,
    },
  ];

  const stats = [
    { 
      title: 'Today\'s Revenue', 
      value: '₨28,400', 
      icon: DollarSign, 
      color: Colors.success,
      change: '+12%',
      changeType: 'positive'
    },
    { 
      title: 'Active Bookings', 
      value: '15', 
      icon: Calendar, 
      color: Colors.primary,
      change: '+5',
      changeType: 'positive'
    },
    { 
      title: 'Table Occupancy', 
      value: '75%', 
      icon: Users, 
      color: Colors.accent,
      change: '+8%',
      changeType: 'positive'
    },
    { 
      title: 'Average Rating', 
      value: '4.8', 
      icon: Star, 
      color: Colors.warning,
      change: '+0.2',
      changeType: 'positive'
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.welcomeText}>Welcome back!</Text>
          <Text style={styles.restaurantName}>Karachi Kitchen</Text>
          <Text style={styles.subtitle}>Here's your business overview</Text>
        </View>
      </LinearGradient>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <Card key={index} style={styles.statCard}>
            <LinearGradient
              colors={[stat.color + '10', stat.color + '05']}
              style={styles.statGradient}
            >
              <View style={styles.statHeader}>
                <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                  <stat.icon size={24} color={stat.color} />
                </View>
                <View style={[styles.changeIndicator, { 
                  backgroundColor: stat.changeType === 'positive' ? Colors.success + '20' : Colors.error + '20' 
                }]}>
                  <Text style={[styles.changeText, { 
                    color: stat.changeType === 'positive' ? Colors.success : Colors.error 
                  }]}>
                    {stat.change}
                  </Text>
                </View>
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
            </LinearGradient>
          </Card>
        ))}
      </View>

      {/* Revenue Chart */}
      <Card style={styles.chartCard}>
        <Text style={styles.chartTitle}>Weekly Revenue Trend</Text>
        <LineChart
          data={revenueData}
          width={width - 80}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </Card>

      {/* Bookings Chart */}
      <Card style={styles.chartCard}>
        <Text style={styles.chartTitle}>Daily Bookings</Text>
        <BarChart
          data={bookingsData}
          width={width - 80}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
        />
      </Card>

      {/* Popular Dishes */}
      <Card style={styles.chartCard}>
        <Text style={styles.chartTitle}>Popular Dishes Distribution</Text>
        <RNPieChart
          data={popularDishesData}
          width={width - 80}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          style={styles.chart}
        />
      </Card>

      {/* Recent Activity */}
      <Card style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Activity size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Recent Activity</Text>
        </View>
        <View style={styles.activityList}>
          <View style={styles.activityItem}>
            <View style={[styles.activityDot, { backgroundColor: Colors.success }]} />
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>New booking from Ahmed Khan</Text>
              <Text style={styles.activityTime}>2 minutes ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <View style={[styles.activityDot, { backgroundColor: Colors.warning }]} />
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>Payment received for Table 5</Text>
              <Text style={styles.activityTime}>15 minutes ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <View style={[styles.activityDot, { backgroundColor: Colors.accent }]} />
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>Menu item updated: Chicken Biryani</Text>
              <Text style={styles.activityTime}>1 hour ago</Text>
            </View>
          </View>
        </View>
      </Card>

      {/* Quick Actions */}
      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              style={styles.quickActionGradient}
            >
              <Calendar size={24} color={Colors.surface} />
              <Text style={styles.quickActionText}>View Bookings</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <LinearGradient
              colors={[Colors.secondary, Colors.secondaryDark]}
              style={styles.quickActionGradient}
            >
              <Users size={24} color={Colors.surface} />
              <Text style={styles.quickActionText}>Manage Tables</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <LinearGradient
              colors={[Colors.accent, Colors.accentDark]}
              style={styles.quickActionGradient}
            >
              <BarChart3 size={24} color={Colors.surface} />
              <Text style={styles.quickActionText}>Analytics</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Card>
    </ScrollView>
  );
}

function CustomerHome() {
  const featuredRestaurants = [
    {
      id: 1,
      name: 'Karachi Kitchen',
      image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      cuisine: 'Pakistani',
      distance: '0.5 km',
      deliveryTime: '25-30 min',
      priceRange: '₨₨',
      discount: '20% OFF',
    },
    {
      id: 2,
      name: 'Lahore Delights',
      image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.6,
      cuisine: 'Punjabi',
      distance: '1.2 km',
      deliveryTime: '30-35 min',
      priceRange: '₨₨₨',
      discount: null,
    },
    {
      id: 3,
      name: 'Spice Garden',
      image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.7,
      cuisine: 'Indian',
      distance: '0.8 km',
      deliveryTime: '20-25 min',
      priceRange: '₨₨',
      discount: '15% OFF',
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark]}
        style={styles.customerHeader}
      >
        <View style={styles.customerHeaderContent}>
          <Text style={styles.customerWelcome}>Hello, John! 👋</Text>
          <Text style={styles.customerSubtitle}>What would you like to eat today?</Text>
        </View>
      </LinearGradient>

      <View style={styles.customerContent}>
        {/* Search Section */}
        <TouchableOpacity 
          style={styles.searchContainer}
          onPress={() => router.push('/(tabs)/search')}
        >
          <LinearGradient
            colors={[Colors.surface, Colors.borderLight]}
            style={styles.searchGradient}
          >
            <Text style={styles.searchText}>🔍 Search restaurants, cuisines...</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionCard}>
              <LinearGradient
                colors={[Colors.primary + '20', Colors.primary + '10']}
                style={styles.quickActionContent}
              >
                <Calendar size={28} color={Colors.primary} />
                <Text style={styles.quickActionLabel}>Book Table</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionCard}>
              <LinearGradient
                colors={[Colors.secondary + '20', Colors.secondary + '10']}
                style={styles.quickActionContent}
              >
                <Users size={28} color={Colors.secondary} />
                <Text style={styles.quickActionLabel}>Group Booking</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionCard}>
              <LinearGradient
                colors={[Colors.accent + '20', Colors.accent + '10']}
                style={styles.quickActionContent}
              >
                <TrendingUp size={28} color={Colors.accent} />
                <Text style={styles.quickActionLabel}>Popular Now</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured Restaurants */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Featured Restaurants</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/search')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.restaurantsList}>
              {featuredRestaurants.map((restaurant) => (
                <TouchableOpacity 
                  key={restaurant.id} 
                  style={styles.restaurantCard}
                  onPress={() => router.push(`/(tabs)/restaurant/${restaurant.id}`)}
                >
                  <Card style={styles.restaurantCardContent}>
                    <View style={styles.restaurantImageContainer}>
                      <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
                      {restaurant.discount && (
                        <View style={styles.discountBadge}>
                          <Text style={styles.discountText}>{restaurant.discount}</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.restaurantInfo}>
                      <Text style={styles.restaurantName}>{restaurant.name}</Text>
                      <View style={styles.restaurantMeta}>
                        <View style={styles.rating}>
                          <Star size={14} color={Colors.warning} fill={Colors.warning} />
                          <Text style={styles.ratingText}>{restaurant.rating}</Text>
                        </View>
                        <Text style={styles.restaurantCuisine}>{restaurant.cuisine}</Text>
                        <Text style={styles.priceRange}>{restaurant.priceRange}</Text>
                      </View>
                      <View style={styles.restaurantDetails}>
                        <View style={styles.detailItem}>
                          <MapPin size={12} color={Colors.textLight} />
                          <Text style={styles.restaurantDistance}>{restaurant.distance}</Text>
                        </View>
                        <View style={styles.detailItem}>
                          <Clock size={12} color={Colors.textLight} />
                          <Text style={styles.restaurantTime}>{restaurant.deliveryTime}</Text>
                        </View>
                      </View>
                    </View>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse by Cuisine</Text>
          <View style={styles.categoriesGrid}>
            {['Pakistani', 'Indian', 'Chinese', 'Italian', 'Fast Food', 'BBQ'].map((category, index) => (
              <TouchableOpacity key={category} style={styles.categoryCard}>
                <LinearGradient
                  colors={[Colors.primary + '15', Colors.primary + '05']}
                  style={styles.categoryContent}
                >
                  <Text style={styles.categoryEmoji}>
                    {['🍛', '🍜', '🥟', '🍝', '🍔', '🍖'][index]}
                  </Text>
                  <Text style={styles.categoryName}>{category}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: Spacing.xxl + 20,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  headerContent: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: FontSize.md,
    color: Colors.surface,
    fontFamily: 'Inter-Regular',
    opacity: 0.9,
  },
  restaurantName: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
    marginVertical: Spacing.sm,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.surface,
    fontFamily: 'Inter-Regular',
    opacity: 0.8,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    marginTop: -Spacing.xl,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 0,
    elevation: 4,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statGradient: {
    padding: Spacing.md,
    borderRadius: 12,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeIndicator: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  changeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  statValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    fontFamily: 'Poppins-Bold',
  },
  statTitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  chartCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    padding: Spacing.md,
  },
  chartTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    fontFamily: 'Poppins-Bold',
  },
  chart: {
    borderRadius: 16,
  },
  sectionCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginLeft: Spacing.sm,
    fontFamily: 'Poppins-Bold',
  },
  activityList: {
    gap: Spacing.md,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    fontFamily: 'Inter-Regular',
  },
  activityTime: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
    fontFamily: 'Inter-Regular',
  },
  quickActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  quickAction: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  quickActionGradient: {
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  quickActionText: {
    fontSize: FontSize.sm,
    color: Colors.surface,
    fontWeight: FontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  // Customer styles
  customerHeader: {
    paddingTop: Spacing.xxl + 20,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  customerHeaderContent: {
    alignItems: 'center',
  },
  customerWelcome: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
    fontFamily: 'Poppins-Bold',
    marginBottom: Spacing.sm,
  },
  customerSubtitle: {
    fontSize: FontSize.md,
    color: Colors.surface,
    fontFamily: 'Inter-Regular',
    opacity: 0.9,
  },
  customerContent: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    marginTop: -Spacing.lg,
  },
  searchContainer: {
    marginBottom: Spacing.xl,
  },
  searchGradient: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchText: {
    fontSize: FontSize.md,
    color: Colors.textLight,
    fontFamily: 'Inter-Regular',
  },
  quickActionsSection: {
    marginBottom: Spacing.xl,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  quickActionCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  quickActionContent: {
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  quickActionLabel: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  seeAllText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  restaurantsList: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingRight: Spacing.lg,
  },
  restaurantCard: {
    width: 280,
  },
  restaurantCardContent: {
    padding: 0,
    overflow: 'hidden',
  },
  restaurantImageContainer: {
    position: 'relative',
  },
  restaurantImage: {
    width: '100%',
    height: 160,
  },
  discountBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.error,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  discountText: {
    fontSize: FontSize.xs,
    color: Colors.surface,
    fontWeight: FontWeight.bold,
    fontFamily: 'Inter-Bold',
  },
  restaurantInfo: {
    padding: Spacing.md,
  },
  restaurantName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    fontFamily: 'Poppins-Bold',
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  restaurantCuisine: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  priceRange: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  restaurantDetails: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  restaurantDistance: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
    fontFamily: 'Inter-Regular',
  },
  restaurantTime: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
    fontFamily: 'Inter-Regular',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  categoryCard: {
    width: (width - Spacing.lg * 2 - Spacing.md * 2) / 3,
    borderRadius: 12,
    overflow: 'hidden',
  },
  categoryContent: {
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
});