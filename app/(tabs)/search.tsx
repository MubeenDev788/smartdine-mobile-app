import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing, FontSize, FontWeight } from '@/constants/Colors';
import { Card } from '@/components/ui/Card';
import { Search, Filter, Star, MapPin, Clock, Heart, Wifi, Car, Users } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    cuisine: '',
    priceRange: '',
    rating: '',
    distance: '',
    facilities: [] as string[],
  });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState({ latitude: 24.8607, longitude: 67.0011 }); // Karachi

  // Mock restaurants with enhanced data
  const restaurants = [
    {
      id: '1',
      name: 'Karachi Kitchen',
      image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      totalReviews: 324,
      cuisine: 'Pakistani',
      distance: '0.5 km',
      deliveryTime: '25-30 min',
      priceRange: '₨₨',
      popular: true,
      address: '123 Main Street, Karachi',
      operatingHours: '10:00 AM - 11:00 PM',
      facilities: ['WiFi', 'Parking', 'AC'],
      coordinates: { latitude: 24.8607, longitude: 67.0011 },
      menu: [
        { name: 'Chicken Biryani', price: 450, category: 'Main Course' },
        { name: 'Seekh Kabab', price: 320, category: 'Appetizers' },
        { name: 'Karahi Chicken', price: 380, category: 'Main Course' },
      ],
      tables: [
        { id: 't1', type: 'Small', capacity: 2, available: true, bookedUntil: null },
        { id: 't2', type: 'Medium', capacity: 4, available: false, bookedUntil: '8:00 PM' },
        { id: 't3', type: 'Large', capacity: 6, available: true, bookedUntil: null },
      ],
      reviews: [
        { rating: 5, comment: 'Excellent food and service!', author: 'Ahmed K.' },
        { rating: 4, comment: 'Great biryani, will come again.', author: 'Sarah A.' },
      ]
    },
    {
      id: '2',
      name: 'Lahore Delights',
      image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.6,
      totalReviews: 256,
      cuisine: 'Punjabi',
      distance: '1.2 km',
      deliveryTime: '30-35 min',
      priceRange: '₨₨₨',
      popular: false,
      address: '456 Food Street, Lahore',
      operatingHours: '11:00 AM - 12:00 AM',
      facilities: ['WiFi', 'AC'],
      coordinates: { latitude: 24.8707, longitude: 67.0111 },
      menu: [
        { name: 'Lahori Chargha', price: 650, category: 'Main Course' },
        { name: 'Kulfi', price: 120, category: 'Desserts' },
      ],
      tables: [
        { id: 't1', type: 'Small', capacity: 2, available: true, bookedUntil: null },
        { id: 't2', type: 'Medium', capacity: 4, available: true, bookedUntil: null },
        { id: 't3', type: 'Large', capacity: 6, available: false, bookedUntil: '9:30 PM' },
      ],
      reviews: [
        { rating: 5, comment: 'Authentic Punjabi taste!', author: 'Hassan M.' },
        { rating: 4, comment: 'Good food, nice ambiance.', author: 'Fatima S.' },
      ]
    },
    {
      id: '3',
      name: 'Spice Garden',
      image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.7,
      totalReviews: 189,
      cuisine: 'Indian',
      distance: '0.8 km',
      deliveryTime: '20-25 min',
      priceRange: '₨₨',
      popular: true,
      address: '789 Spice Lane, Mumbai',
      operatingHours: '12:00 PM - 11:30 PM',
      facilities: ['WiFi', 'Parking'],
      coordinates: { latitude: 24.8507, longitude: 67.0211 },
      menu: [
        { name: 'Butter Chicken', price: 420, category: 'Main Course' },
        { name: 'Naan', price: 80, category: 'Bread' },
      ],
      tables: [
        { id: 't1', type: 'Small', capacity: 2, available: false, bookedUntil: '7:30 PM' },
        { id: 't2', type: 'Medium', capacity: 4, available: true, bookedUntil: null },
        { id: 't3', type: 'Large', capacity: 6, available: true, bookedUntil: null },
      ],
      reviews: [
        { rating: 5, comment: 'Best Indian food in the city!', author: 'Priya R.' },
      ]
    },
  ];

  const cuisineFilters = ['All', 'Pakistani', 'Indian', 'Chinese', 'Italian', 'Fast Food'];
  const priceFilters = ['All', '₨', '₨₨', '₨₨₨'];
  const ratingFilters = ['All', '4.5+', '4.0+', '3.5+'];
  const distanceFilters = ['All', '< 1 km', '< 2 km', '< 5 km'];
  const facilityFilters = ['WiFi', 'Parking', 'AC', 'Outdoor Seating'];

  // Calculate distance between two coordinates
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Filter restaurants based on user location and preferences
  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCuisine = selectedFilters.cuisine === '' || selectedFilters.cuisine === 'All' || 
                          restaurant.cuisine === selectedFilters.cuisine;
    const matchesPrice = selectedFilters.priceRange === '' || selectedFilters.priceRange === 'All' || 
                        restaurant.priceRange === selectedFilters.priceRange;
    const matchesRating = selectedFilters.rating === '' || selectedFilters.rating === 'All' || 
                         (selectedFilters.rating === '4.5+' && restaurant.rating >= 4.5) ||
                         (selectedFilters.rating === '4.0+' && restaurant.rating >= 4.0) ||
                         (selectedFilters.rating === '3.5+' && restaurant.rating >= 3.5);
    
    const distance = calculateDistance(
      userLocation.latitude, userLocation.longitude,
      restaurant.coordinates.latitude, restaurant.coordinates.longitude
    );
    
    const matchesDistance = selectedFilters.distance === '' || selectedFilters.distance === 'All' ||
                           (selectedFilters.distance === '< 1 km' && distance < 1) ||
                           (selectedFilters.distance === '< 2 km' && distance < 2) ||
                           (selectedFilters.distance === '< 5 km' && distance < 5);

    const matchesFacilities = selectedFilters.facilities.length === 0 ||
                             selectedFilters.facilities.every(facility => 
                               restaurant.facilities.includes(facility)
                             );
    
    return matchesSearch && matchesCuisine && matchesPrice && matchesRating && matchesDistance && matchesFacilities;
  }).sort((a, b) => {
    // Sort by distance from user
    const distanceA = calculateDistance(
      userLocation.latitude, userLocation.longitude,
      a.coordinates.latitude, a.coordinates.longitude
    );
    const distanceB = calculateDistance(
      userLocation.latitude, userLocation.longitude,
      b.coordinates.latitude, b.coordinates.longitude
    );
    return distanceA - distanceB;
  });

  const toggleFavorite = (restaurantId: string) => {
    setFavorites(prev => 
      prev.includes(restaurantId) 
        ? prev.filter(id => id !== restaurantId)
        : [...prev, restaurantId]
    );
  };

  const toggleFacilityFilter = (facility: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      cuisine: '',
      priceRange: '',
      rating: '',
      distance: '',
      facilities: [],
    });
  };

  const getAvailableTablesCount = (restaurant: any) => {
    return restaurant.tables.filter((table: any) => table.available).length;
  };

  const getNextAvailableTime = (restaurant: any) => {
    const bookedTables = restaurant.tables.filter((table: any) => !table.available);
    if (bookedTables.length === 0) return 'Available now';
    
    const earliestTime = bookedTables.reduce((earliest: string | null, table: any) => {
      if (!earliest || table.bookedUntil < earliest) {
        return table.bookedUntil;
      }
      return earliest;
    }, null);
    
    return `Available after ${earliestTime}`;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark]}
        style={styles.header}
      >
        <Text style={styles.title}>Discover Restaurants</Text>
        <Text style={styles.subtitle}>Find your perfect dining experience nearby</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color={Colors.textLight} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search restaurants, cuisines..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={Colors.textLight}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Quick Filters */}
        <View style={styles.filtersSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterChips}>
              {cuisineFilters.map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.filterChip,
                    selectedFilters.cuisine === filter && styles.filterChipActive
                  ]}
                  onPress={() => setSelectedFilters(prev => ({ 
                    ...prev, 
                    cuisine: prev.cuisine === filter ? '' : filter 
                  }))}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedFilters.cuisine === filter && styles.filterChipTextActive
                  ]}>
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          
          {/* Facility Filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.facilityFilters}>
            <View style={styles.filterChips}>
              {facilityFilters.map((facility) => (
                <TouchableOpacity
                  key={facility}
                  style={[
                    styles.facilityChip,
                    selectedFilters.facilities.includes(facility) && styles.facilityChipActive
                  ]}
                  onPress={() => toggleFacilityFilter(facility)}
                >
                  <Text style={[
                    styles.facilityChipText,
                    selectedFilters.facilities.includes(facility) && styles.facilityChipTextActive
                  ]}>
                    {facility === 'WiFi' && '📶'} 
                    {facility === 'Parking' && '🚗'} 
                    {facility === 'AC' && '❄️'} 
                    {facility === 'Outdoor Seating' && '🌳'} {facility}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          
          {(Object.values(selectedFilters).some(filter => 
            Array.isArray(filter) ? filter.length > 0 : filter !== ''
          )) && (
            <TouchableOpacity style={styles.clearFilters} onPress={clearFilters}>
              <Text style={styles.clearFiltersText}>Clear All Filters</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Results */}
        <View style={styles.results}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>
              {filteredRestaurants.length} restaurants found near you
            </Text>
            {searchQuery !== '' && (
              <Text style={styles.searchResultsText}>
                Results for "{searchQuery}"
              </Text>
            )}
          </View>
          
          <View style={styles.restaurantsList}>
            {filteredRestaurants.map((restaurant) => (
              <TouchableOpacity 
                key={restaurant.id} 
                style={styles.restaurantCard}
                onPress={() => router.push(`/(tabs)/restaurant/${restaurant.id}`)}
              >
                <Card style={styles.card}>
                  <View style={styles.restaurantContent}>
                    <Image 
                      source={{ uri: restaurant.image }} 
                      style={styles.restaurantImage}
                    />
                    <TouchableOpacity 
                      style={styles.favoriteButton}
                      onPress={() => toggleFavorite(restaurant.id)}
                    >
                      <Heart 
                        size={20} 
                        color={favorites.includes(restaurant.id) ? Colors.error : Colors.surface}
                        fill={favorites.includes(restaurant.id) ? Colors.error : 'transparent'}
                      />
                    </TouchableOpacity>
                    {restaurant.popular && (
                      <View style={styles.popularBadge}>
                        <Text style={styles.popularText}>Popular</Text>
                      </View>
                    )}
                    
                    <View style={styles.restaurantInfo}>
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
                      
                      {/* Facilities */}
                      <View style={styles.facilities}>
                        {restaurant.facilities.slice(0, 3).map((facility, index) => (
                          <View key={facility} style={styles.facilityTag}>
                            <Text style={styles.facilityTagText}>
                              {facility === 'WiFi' && '📶'} 
                              {facility === 'Parking' && '🚗'} 
                              {facility === 'AC' && '❄️'} {facility}
                            </Text>
                          </View>
                        ))}
                      </View>
                      
                      {/* Table Availability */}
                      <View style={styles.tableAvailability}>
                        <View style={styles.availabilityInfo}>
                          <Users size={14} color={Colors.success} />
                          <Text style={styles.availabilityText}>
                            {getAvailableTablesCount(restaurant)} tables available
                          </Text>
                        </View>
                        <Text style={styles.nextAvailable}>
                          {getNextAvailableTime(restaurant)}
                        </Text>
                      </View>
                      
                      {/* Popular Menu Items */}
                      <View style={styles.menuPreview}>
                        <Text style={styles.menuPreviewTitle}>Popular items:</Text>
                        <Text style={styles.menuItems}>
                          {restaurant.menu.slice(0, 2).map(item => item.name).join(', ')}
                        </Text>
                      </View>
                      
                      <Text style={styles.address}>{restaurant.address}</Text>
                      <Text style={styles.hours}>{restaurant.operatingHours}</Text>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>

          {filteredRestaurants.length === 0 && (
            <Card style={styles.noResultsCard}>
              <Text style={styles.noResultsTitle}>No restaurants found</Text>
              <Text style={styles.noResultsText}>
                Try adjusting your search or filters to find more restaurants near you
              </Text>
              <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
                <Text style={styles.clearFiltersButtonText}>Clear Filters</Text>
              </TouchableOpacity>
            </Card>
          )}
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
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
    marginBottom: Spacing.xs,
    fontFamily: 'Poppins-Bold',
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.surface,
    fontFamily: 'Inter-Regular',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    marginTop: -Spacing.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
    elevation: 2,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontFamily: 'Inter-Regular',
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 2,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  filtersSection: {
    marginBottom: Spacing.lg,
  },
  filterChips: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingRight: Spacing.lg,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  filterChipTextActive: {
    color: Colors.surface,
  },
  facilityFilters: {
    marginTop: Spacing.sm,
  },
  facilityChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  facilityChipActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  facilityChipText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  facilityChipTextActive: {
    color: Colors.surface,
  },
  clearFilters: {
    alignSelf: 'center',
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  clearFiltersText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  results: {
    flex: 1,
  },
  resultsHeader: {
    marginBottom: Spacing.md,
  },
  resultsTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    fontFamily: 'Inter-SemiBold',
  },
  searchResultsText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    fontFamily: 'Inter-Regular',
  },
  restaurantsList: {
    gap: Spacing.md,
  },
  restaurantCard: {
    marginBottom: Spacing.sm,
  },
  card: {
    padding: 0,
    elevation: 3,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  restaurantContent: {
    position: 'relative',
  },
  restaurantImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  favoriteButton: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.overlayLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popularBadge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
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
  restaurantInfo: {
    padding: Spacing.md,
  },
  restaurantName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
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
    marginBottom: Spacing.sm,
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
  facilities: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  facilityTag: {
    backgroundColor: Colors.borderLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
  },
  facilityTagText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  tableAvailability: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    padding: Spacing.sm,
    backgroundColor: Colors.success + '10',
    borderRadius: 8,
  },
  availabilityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  availabilityText: {
    fontSize: FontSize.sm,
    color: Colors.success,
    fontWeight: FontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  nextAvailable: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  menuPreview: {
    marginBottom: Spacing.sm,
  },
  menuPreviewTitle: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  menuItems: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  address: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
    marginBottom: Spacing.xs,
    fontFamily: 'Inter-Regular',
  },
  hours: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
    fontFamily: 'Inter-Regular',
  },
  noResultsCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  noResultsTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    fontFamily: 'Inter-SemiBold',
  },
  noResultsText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.md,
    fontFamily: 'Inter-Regular',
  },
  clearFiltersButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
  },
  clearFiltersButtonText: {
    fontSize: FontSize.sm,
    color: Colors.surface,
    fontWeight: FontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
});