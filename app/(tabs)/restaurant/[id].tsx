import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, FontSize, FontWeight } from '@/constants/Colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Star, MapPin, Clock, Phone, Wifi, Car, Users, Heart, Share2, Calendar } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('tables');
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock restaurant data with enhanced table information
  const restaurant = {
    id: '1',
    name: 'Karachi Kitchen',
    image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
    ],
    rating: 4.8,
    totalReviews: 324,
    cuisine: 'Pakistani',
    distance: '0.5 km',
    deliveryTime: '25-30 min',
    priceRange: '₨₨',
    address: '123 Main Street, Karachi',
    phone: '+92 300 1234567',
    operatingHours: {
      open: '10:00 AM',
      close: '11:00 PM',
    },
    facilities: [
      { name: 'WiFi', icon: Wifi, available: true },
      { name: 'Parking', icon: Car, available: true },
    ],
    description: 'Authentic Pakistani cuisine with traditional flavors and modern presentation. Family-owned restaurant serving the community for over 20 years.',
    menu: [
      {
        category: 'Main Course',
        items: [
          {
            id: '1',
            name: 'Chicken Biryani',
            description: 'Aromatic basmati rice with tender chicken and traditional spices',
            price: 450,
            image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=300',
            popular: true,
            spiceLevel: 3,
          },
          {
            id: '2',
            name: 'Karahi Chicken',
            description: 'Traditional Pakistani chicken curry cooked in a wok',
            price: 380,
            image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=300',
            popular: true,
            spiceLevel: 4,
          },
        ],
      },
      {
        category: 'Appetizers',
        items: [
          {
            id: '3',
            name: 'Seekh Kabab',
            description: 'Grilled minced meat skewers with herbs and spices',
            price: 320,
            image: 'https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg?auto=compress&cs=tinysrgb&w=300',
            popular: false,
            spiceLevel: 2,
          },
        ],
      },
    ],
    tables: [
      { 
        id: '1', 
        type: 'Small', 
        capacity: 2, 
        available: true, 
        price: 50,
        bookedSlots: [],
        nextAvailable: 'Available now'
      },
      { 
        id: '2', 
        type: 'Medium', 
        capacity: 4, 
        available: false, 
        price: 100,
        bookedSlots: ['6:00 PM - 8:00 PM', '8:30 PM - 10:30 PM'],
        nextAvailable: 'Available after 10:30 PM'
      },
      { 
        id: '3', 
        type: 'Large', 
        capacity: 6, 
        available: true, 
        price: 150,
        bookedSlots: ['7:00 PM - 9:00 PM'],
        nextAvailable: 'Available after 9:00 PM'
      },
      { 
        id: '4', 
        type: 'Family', 
        capacity: 8, 
        available: true, 
        price: 200,
        bookedSlots: [],
        nextAvailable: 'Available now'
      },
    ],
    reviews: [
      {
        id: '1',
        customerName: 'Ahmed Khan',
        rating: 5,
        comment: 'Excellent food and service. The biryani was amazing!',
        date: '2025-01-10',
      },
      {
        id: '2',
        customerName: 'Sarah Ali',
        rating: 4,
        comment: 'Great atmosphere and delicious food. Will definitely come back.',
        date: '2025-01-08',
      },
    ],
  };

  const tabs = [
    { id: 'tables', label: 'Tables' },
    { id: 'menu', label: 'Menu' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'info', label: 'Info' },
  ];

  const renderSpiceLevel = (level: number) => {
    return (
      <View style={styles.spiceLevel}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Text key={i} style={[styles.spiceIcon, { opacity: i <= level ? 1 : 0.3 }]}>
            🌶️
          </Text>
        ))}
      </View>
    );
  };

  const renderTables = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Table Availability</Text>
      <Text style={styles.sectionSubtitle}>
        Real-time table status and booking information
      </Text>
      
      <View style={styles.tablesGrid}>
        {restaurant.tables.map((table) => (
          <Card key={table.id} style={[
            styles.tableCard,
            !table.available && styles.tableCardUnavailable
          ]}>
            <View style={styles.tableHeader}>
              <View style={styles.tableInfo}>
                <Text style={styles.tableType}>{table.type} Table</Text>
                <View style={styles.tableCapacity}>
                  <Users size={16} color={Colors.textSecondary} />
                  <Text style={styles.tableCapacityText}>{table.capacity} seats</Text>
                </View>
                <Text style={styles.tablePrice}>₨{table.price}/hour</Text>
              </View>
              <View style={[
                styles.tableStatus,
                { backgroundColor: table.available ? Colors.success : Colors.error }
              ]}>
                <Text style={styles.tableStatusText}>
                  {table.available ? 'Available' : 'Occupied'}
                </Text>
              </View>
            </View>

            {/* Booking Schedule */}
            <View style={styles.bookingSchedule}>
              <Text style={styles.scheduleTitle}>Today's Schedule:</Text>
              {table.bookedSlots.length > 0 ? (
                table.bookedSlots.map((slot, index) => (
                  <View key={index} style={styles.bookedSlot}>
                    <View style={styles.bookedSlotIndicator} />
                    <Text style={styles.bookedSlotText}>{slot}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noBookingsText}>No bookings today</Text>
              )}
            </View>

            <View style={styles.tableFooter}>
              <Text style={styles.nextAvailableText}>{table.nextAvailable}</Text>
              {table.available && (
                <TouchableOpacity
                  style={styles.bookNowButton}
                  onPress={() => router.push(`/booking/${restaurant.id}?tableId=${table.id}`)}
                >
                  <Text style={styles.bookNowText}>Book Now</Text>
                </TouchableOpacity>
              )}
            </View>
          </Card>
        ))}
      </View>

      {/* Booking Legend */}
      <Card style={styles.legendCard}>
        <Text style={styles.legendTitle}>Booking Status Legend</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.success }]} />
            <Text style={styles.legendText}>Available for booking</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.error }]} />
            <Text style={styles.legendText}>Currently occupied</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.warning }]} />
            <Text style={styles.legendText}>Booked for later</Text>
          </View>
        </View>
      </Card>
    </View>
  );

  const renderMenu = () => (
    <View style={styles.tabContent}>
      {restaurant.menu.map((category) => (
        <View key={category.category} style={styles.menuCategory}>
          <Text style={styles.categoryTitle}>{category.category}</Text>
          {category.items.map((item) => (
            <Card key={item.id} style={styles.menuItem}>
              <View style={styles.menuItemContent}>
                <Image source={{ uri: item.image }} style={styles.menuItemImage} />
                <View style={styles.menuItemInfo}>
                  <View style={styles.menuItemHeader}>
                    <Text style={styles.menuItemName}>{item.name}</Text>
                    {item.popular && (
                      <View style={styles.popularBadge}>
                        <Text style={styles.popularText}>Popular</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.menuItemDescription}>{item.description}</Text>
                  {renderSpiceLevel(item.spiceLevel)}
                  <View style={styles.menuItemFooter}>
                    <Text style={styles.menuItemPrice}>₨{item.price}</Text>
                    <Button
                      title="Add"
                      onPress={() => {}}
                      variant="primary"
                      size="small"
                    />
                  </View>
                </View>
              </View>
            </Card>
          ))}
        </View>
      ))}
    </View>
  );

  const renderReviews = () => (
    <View style={styles.tabContent}>
      <View style={styles.reviewsHeader}>
        <Text style={styles.sectionTitle}>Customer Reviews</Text>
        <View style={styles.overallRating}>
          <Star size={20} color={Colors.warning} fill={Colors.warning} />
          <Text style={styles.ratingText}>{restaurant.rating}</Text>
          <Text style={styles.reviewCount}>({restaurant.totalReviews} reviews)</Text>
        </View>
      </View>
      {restaurant.reviews.map((review) => (
        <Card key={review.id} style={styles.reviewCard}>
          <View style={styles.reviewHeader}>
            <Text style={styles.reviewerName}>{review.customerName}</Text>
            <View style={styles.reviewRating}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={14}
                  color={star <= review.rating ? Colors.warning : Colors.borderLight}
                  fill={star <= review.rating ? Colors.warning : 'transparent'}
                />
              ))}
            </View>
          </View>
          <Text style={styles.reviewComment}>{review.comment}</Text>
          <Text style={styles.reviewDate}>{review.date}</Text>
        </Card>
      ))}
    </View>
  );

  const renderInfo = () => (
    <View style={styles.tabContent}>
      <Card style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Restaurant Information</Text>
        <View style={styles.infoItem}>
          <MapPin size={20} color={Colors.textSecondary} />
          <Text style={styles.infoText}>{restaurant.address}</Text>
        </View>
        <View style={styles.infoItem}>
          <Phone size={20} color={Colors.textSecondary} />
          <Text style={styles.infoText}>{restaurant.phone}</Text>
        </View>
        <View style={styles.infoItem}>
          <Clock size={20} color={Colors.textSecondary} />
          <Text style={styles.infoText}>
            {restaurant.operatingHours.open} - {restaurant.operatingHours.close}
          </Text>
        </View>
      </Card>

      <Card style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Facilities</Text>
        {restaurant.facilities.map((facility) => (
          <View key={facility.name} style={styles.facilityItem}>
            <facility.icon size={20} color={facility.available ? Colors.success : Colors.textLight} />
            <Text style={[
              styles.facilityText,
              { color: facility.available ? Colors.textPrimary : Colors.textLight }
            ]}>
              {facility.name}
            </Text>
            {facility.available && (
              <Text style={styles.availableText}>Available</Text>
            )}
          </View>
        ))}
      </Card>

      <Card style={styles.infoCard}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.description}>{restaurant.description}</Text>
      </Card>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'tables':
        return renderTables();
      case 'menu':
        return renderMenu();
      case 'reviews':
        return renderReviews();
      case 'info':
        return renderInfo();
      default:
        return renderTables();
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Image source={{ uri: restaurant.image }} style={styles.headerImage} />
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
          style={styles.headerOverlay}
        >
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionButton} onPress={() => router.back()}>
              <ArrowLeft size={24} color={Colors.surface} />
            </TouchableOpacity>
            <View style={styles.rightActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setIsFavorite(!isFavorite)}
              >
                <Heart
                  size={24}
                  color={isFavorite ? Colors.error : Colors.surface}
                  fill={isFavorite ? Colors.error : 'transparent'}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Share2 size={24} color={Colors.surface} />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.content}>
        <Card style={styles.restaurantInfo}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <View style={styles.restaurantMeta}>
            <View style={styles.rating}>
              <Star size={16} color={Colors.warning} fill={Colors.warning} />
              <Text style={styles.ratingText}>{restaurant.rating}</Text>
              <Text style={styles.reviewCount}>({restaurant.totalReviews})</Text>
            </View>
            <Text style={styles.cuisine}>{restaurant.cuisine}</Text>
            <Text style={styles.priceRange}>{restaurant.priceRange}</Text>
          </View>
          <View style={styles.restaurantDetails}>
            <View style={styles.detailItem}>
              <MapPin size={14} color={Colors.textLight} />
              <Text style={styles.detailText}>{restaurant.distance}</Text>
            </View>
            <View style={styles.detailItem}>
              <Clock size={14} color={Colors.textLight} />
              <Text style={styles.detailText}>{restaurant.deliveryTime}</Text>
            </View>
          </View>
        </Card>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.gallery}
        >
          {restaurant.gallery.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.galleryImage} />
          ))}
        </ScrollView>

        <View style={styles.tabs}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && styles.activeTab
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {renderTabContent()}
      </View>

      <View style={styles.footer}>
        <Button
          title="Book Table"
          onPress={() => router.push(`/booking/${restaurant.id}`)}
          variant="primary"
          size="large"
          style={styles.bookButton}
        />
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
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: 250,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.overlayLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    marginTop: -Spacing.lg,
  },
  restaurantInfo: {
    marginBottom: Spacing.lg,
  },
  restaurantName: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    fontFamily: 'Poppins-Bold',
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  ratingText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  reviewCount: {
    fontSize: FontSize.sm,
    color: Colors.textLight,
    fontFamily: 'Inter-Regular',
  },
  cuisine: {
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
    gap: Spacing.lg,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  detailText: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
    fontFamily: 'Inter-Regular',
  },
  gallery: {
    marginBottom: Spacing.lg,
  },
  galleryImage: {
    width: 120,
    height: 80,
    borderRadius: 8,
    marginRight: Spacing.sm,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: Spacing.xs,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  activeTabText: {
    color: Colors.surface,
    fontWeight: FontWeight.semibold,
  },
  tabContent: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    fontFamily: 'Poppins-Bold',
  },
  sectionSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    fontFamily: 'Inter-Regular',
  },
  tablesGrid: {
    gap: Spacing.md,
  },
  tableCard: {
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tableCardUnavailable: {
    opacity: 0.7,
    backgroundColor: Colors.borderLight,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  tableInfo: {
    flex: 1,
  },
  tableType: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    fontFamily: 'Inter-SemiBold',
  },
  tableCapacity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  tableCapacityText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  tablePrice: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  tableStatus: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
    alignItems: 'center',
  },
  tableStatusText: {
    fontSize: FontSize.xs,
    color: Colors.surface,
    fontWeight: FontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  bookingSchedule: {
    marginBottom: Spacing.md,
  },
  scheduleTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    fontFamily: 'Inter-SemiBold',
  },
  bookedSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  bookedSlotIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
    marginRight: Spacing.sm,
  },
  bookedSlotText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  noBookingsText: {
    fontSize: FontSize.sm,
    color: Colors.textLight,
    fontStyle: 'italic',
    fontFamily: 'Inter-Regular',
  },
  tableFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextAvailableText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    flex: 1,
    fontFamily: 'Inter-Regular',
  },
  bookNowButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
  },
  bookNowText: {
    fontSize: FontSize.sm,
    color: Colors.surface,
    fontWeight: FontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  legendCard: {
    marginTop: Spacing.lg,
  },
  legendTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    fontFamily: 'Inter-SemiBold',
  },
  legendItems: {
    gap: Spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  menuCategory: {
    marginBottom: Spacing.lg,
  },
  categoryTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    fontFamily: 'Inter-SemiBold',
  },
  menuItem: {
    marginBottom: Spacing.md,
    padding: 0,
  },
  menuItemContent: {
    flexDirection: 'row',
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  menuItemInfo: {
    flex: 1,
    padding: Spacing.md,
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  menuItemName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    flex: 1,
    fontFamily: 'Inter-SemiBold',
  },
  popularBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  popularText: {
    fontSize: FontSize.xs,
    color: Colors.surface,
    fontWeight: FontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  menuItemDescription: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    fontFamily: 'Inter-Regular',
  },
  spiceLevel: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  spiceIcon: {
    fontSize: 12,
    marginRight: 2,
  },
  menuItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemPrice: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    fontFamily: 'Poppins-Bold',
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  overallRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  reviewCard: {
    marginBottom: Spacing.md,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  reviewerName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    fontFamily: 'Inter-SemiBold',
  },
  reviewRating: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    lineHeight: 18,
    fontFamily: 'Inter-Regular',
  },
  reviewDate: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
    fontFamily: 'Inter-Regular',
  },
  infoCard: {
    marginBottom: Spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  infoText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    flex: 1,
    fontFamily: 'Inter-Regular',
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  facilityText: {
    fontSize: FontSize.sm,
    flex: 1,
    fontFamily: 'Inter-Regular',
  },
  availableText: {
    fontSize: FontSize.xs,
    color: Colors.success,
    fontWeight: FontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  description: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
  },
  footer: {
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  bookButton: {
    marginBottom: Spacing.sm,
  },
});