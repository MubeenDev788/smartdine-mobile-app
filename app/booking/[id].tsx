import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, FontSize, FontWeight } from '@/constants/Colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Calendar, Clock, Users, Plus, Minus, ChevronRight } from 'lucide-react-native';

export default function BookingScreen() {
  const { id, tableId } = useLocalSearchParams();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [chairSelection, setChairSelection] = useState({
    singleChairs: 2,
    doubleChairs: 0,
    highChairs: 0,
  });
  const [manualChairRequest, setManualChairRequest] = useState('');
  const [preOrders, setPreOrders] = useState<any[]>([]);
  const [specialRequests, setSpecialRequests] = useState('');

  // Mock data
  const restaurant = {
    name: 'Karachi Kitchen',
    table: {
      id: tableId,
      type: 'Medium',
      capacity: 4,
      price: 100,
    },
  };

  const availableDates = [
    { date: '2025-01-15', day: 'Today' },
    { date: '2025-01-16', day: 'Tomorrow' },
    { date: '2025-01-17', day: 'Thu' },
    { date: '2025-01-18', day: 'Fri' },
    { date: '2025-01-19', day: 'Sat' },
  ];

  const availableSlots = [
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
    '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM'
  ];

  const chairTypes = [
    { id: 'singleChairs', name: 'Single Chairs', price: 0 },
    { id: 'doubleChairs', name: 'Double Chairs', price: 20 },
    { id: 'highChairs', name: 'High Chairs (Kids)', price: 0 },
  ];

  const popularItems = [
    {
      id: '1',
      name: 'Chicken Biryani',
      price: 450,
      description: 'Aromatic basmati rice with tender chicken',
    },
    {
      id: '2',
      name: 'Karahi Chicken',
      price: 380,
      description: 'Traditional Pakistani chicken curry',
    },
  ];

  const updateChairCount = (type: string, increment: boolean) => {
    setChairSelection(prev => {
      const newCount = increment 
        ? prev[type as keyof typeof prev] + 1 
        : Math.max(0, prev[type as keyof typeof prev] - 1);
      
      return { ...prev, [type]: newCount };
    });
  };

  const getTotalChairs = () => {
    return chairSelection.singleChairs + chairSelection.doubleChairs + chairSelection.highChairs;
  };

  const getChairCost = () => {
    return chairSelection.doubleChairs * 20; // Only double chairs have extra cost
  };

  const getPreOrderTotal = () => {
    return preOrders.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalCost = () => {
    return restaurant.table.price + getChairCost() + getPreOrderTotal();
  };

  const addPreOrder = (item: any) => {
    setPreOrders(prev => {
      const existing = prev.find(p => p.id === item.id);
      if (existing) {
        return prev.map(p => 
          p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removePreOrder = (itemId: string) => {
    setPreOrders(prev => {
      return prev.map(p => 
        p.id === itemId ? { ...p, quantity: Math.max(0, p.quantity - 1) } : p
      ).filter(p => p.quantity > 0);
    });
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Missing Information', 'Please select date and time');
      return;
    }

    if (getTotalChairs() === 0 && !manualChairRequest.trim()) {
      Alert.alert('Chair Selection Required', 'Please select chairs or specify your chair requirements manually');
      return;
    }

    // Navigate to payment screen
    router.push({
      pathname: '/payment',
      params: {
        restaurantId: id,
        tableId: restaurant.table.id,
        date: selectedDate,
        time: selectedTime,
        chairs: JSON.stringify(chairSelection),
        manualChairRequest: manualChairRequest,
        preOrders: JSON.stringify(preOrders),
        total: getTotalCost(),
      }
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Book Table</Text>
      </View>

      <Card style={styles.restaurantCard}>
        <Text style={styles.restaurantName}>{restaurant.name}</Text>
        <Text style={styles.tableInfo}>
          {restaurant.table.type} Table • Up to {restaurant.table.capacity} guests • ₨{restaurant.table.price}/hour
        </Text>
      </Card>

      {/* Date Selection */}
      <Card style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Calendar size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Select Date</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.datesList}>
            {availableDates.map((dateItem) => (
              <TouchableOpacity
                key={dateItem.date}
                style={[
                  styles.dateCard,
                  selectedDate === dateItem.date && styles.selectedDateCard
                ]}
                onPress={() => setSelectedDate(dateItem.date)}
              >
                <Text style={[
                  styles.dateDay,
                  selectedDate === dateItem.date && styles.selectedDateText
                ]}>
                  {dateItem.day}
                </Text>
                <Text style={[
                  styles.dateNumber,
                  selectedDate === dateItem.date && styles.selectedDateText
                ]}>
                  {new Date(dateItem.date).getDate()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </Card>

      {/* Time Selection */}
      <Card style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Clock size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Select Time</Text>
        </View>
        <View style={styles.timeGrid}>
          {availableSlots.map((slot) => (
            <TouchableOpacity
              key={slot}
              style={[
                styles.timeSlot,
                selectedTime === slot && styles.selectedTimeSlot
              ]}
              onPress={() => setSelectedTime(slot)}
            >
              <Text style={[
                styles.timeText,
                selectedTime === slot && styles.selectedTimeText
              ]}>
                {slot}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {/* Chair Selection */}
      <Card style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Users size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Chair Selection</Text>
        </View>
        <Text style={styles.sectionSubtitle}>
          Total chairs: {getTotalChairs()} (Max: {restaurant.table.capacity})
        </Text>
        {chairTypes.map((chairType) => (
          <View key={chairType.id} style={styles.chairRow}>
            <View style={styles.chairInfo}>
              <Text style={styles.chairName}>{chairType.name}</Text>
              {chairType.price > 0 && (
                <Text style={styles.chairPrice}>+₨{chairType.price} each</Text>
              )}
            </View>
            <View style={styles.chairControls}>
              <TouchableOpacity
                style={styles.chairButton}
                onPress={() => updateChairCount(chairType.id, false)}
              >
                <Minus size={16} color={Colors.textSecondary} />
              </TouchableOpacity>
              <Text style={styles.chairCount}>
                {chairSelection[chairType.id as keyof typeof chairSelection]}
              </Text>
              <TouchableOpacity
                style={styles.chairButton}
                onPress={() => updateChairCount(chairType.id, true)}
                disabled={getTotalChairs() >= restaurant.table.capacity}
              >
                <Plus size={16} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Manual Chair Request */}
        <View style={styles.manualRequestSection}>
          <Text style={styles.manualRequestTitle}>Or specify your chair requirements manually:</Text>
          <TextInput
            style={styles.manualRequestInput}
            placeholder="e.g., 3 single chairs, 1 wheelchair accessible chair, 2 high chairs for kids"
            value={manualChairRequest}
            onChangeText={setManualChairRequest}
            multiline
            numberOfLines={3}
            placeholderTextColor={Colors.textLight}
          />
          <Text style={styles.manualRequestNote}>
            This will override the chair selection above. Our staff will arrange the chairs according to your request.
          </Text>
        </View>
      </Card>

      {/* Pre-Order Food */}
      <Card style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>🍽️</Text>
          <Text style={styles.sectionTitle}>Pre-Order Food (Optional)</Text>
        </View>
        <Text style={styles.sectionSubtitle}>
          Order ahead to reduce waiting time. Payment required first.
        </Text>
        {popularItems.map((item) => (
          <View key={item.id} style={styles.menuRow}>
            <View style={styles.menuInfo}>
              <Text style={styles.menuName}>{item.name}</Text>
              <Text style={styles.menuDescription}>{item.description}</Text>
              <Text style={styles.menuPrice}>₨{item.price}</Text>
            </View>
            <View style={styles.menuControls}>
              {preOrders.find(p => p.id === item.id) ? (
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => removePreOrder(item.id)}
                  >
                    <Minus size={16} color={Colors.surface} />
                  </TouchableOpacity>
                  <Text style={styles.quantity}>
                    {preOrders.find(p => p.id === item.id)?.quantity || 0}
                  </Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => addPreOrder(item)}
                  >
                    <Plus size={16} color={Colors.surface} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => addPreOrder(item)}
                >
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </Card>

      {/* Special Requests */}
      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Special Requests (Optional)</Text>
        <TextInput
          style={styles.specialRequestsInput}
          placeholder="Any special requests or dietary requirements..."
          value={specialRequests}
          onChangeText={setSpecialRequests}
          multiline
          numberOfLines={3}
          placeholderTextColor={Colors.textLight}
        />
      </Card>

      {/* Booking Summary */}
      <Card style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Booking Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Table Fee</Text>
          <Text style={styles.summaryValue}>₨{restaurant.table.price}</Text>
        </View>
        {getChairCost() > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Chair Upgrade</Text>
            <Text style={styles.summaryValue}>₨{getChairCost()}</Text>
          </View>
        )}
        {preOrders.length > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Pre-Orders</Text>
            <Text style={styles.summaryValue}>₨{getPreOrderTotal()}</Text>
          </View>
        )}
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryTotal}>Total</Text>
          <Text style={styles.summaryTotalValue}>₨{getTotalCost()}</Text>
        </View>
        {preOrders.length > 0 && (
          <Text style={styles.paymentNote}>
            Payment required first for food pre-orders
          </Text>
        )}
      </Card>

      <View style={styles.footer}>
        <Button
          title="Proceed to Payment"
          onPress={handleBooking}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    fontFamily: 'Poppins-Bold',
  },
  restaurantCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  restaurantName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    fontFamily: 'Poppins-Bold',
  },
  tableInfo: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
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
  sectionIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginLeft: Spacing.sm,
    fontFamily: 'Inter-SemiBold',
  },
  sectionSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    fontFamily: 'Inter-Regular',
  },
  datesList: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  dateCard: {
    width: 60,
    padding: Spacing.sm,
    borderRadius: 8,
    backgroundColor: Colors.borderLight,
    alignItems: 'center',
  },
  selectedDateCard: {
    backgroundColor: Colors.primary,
  },
  dateDay: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  dateNumber: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    fontFamily: 'Inter-SemiBold',
  },
  selectedDateText: {
    color: Colors.surface,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  timeSlot: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    backgroundColor: Colors.borderLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedTimeSlot: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timeText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  selectedTimeText: {
    color: Colors.surface,
  },
  chairRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  chairInfo: {
    flex: 1,
  },
  chairName: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    fontFamily: 'Inter-Regular',
  },
  chairPrice: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  chairControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  chairButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chairCount: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    minWidth: 20,
    textAlign: 'center',
    fontFamily: 'Inter-SemiBold',
  },
  manualRequestSection: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  manualRequestTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    fontFamily: 'Inter-SemiBold',
  },
  manualRequestInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: Spacing.md,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    backgroundColor: Colors.surface,
    textAlignVertical: 'top',
    fontFamily: 'Inter-Regular',
    marginBottom: Spacing.sm,
  },
  manualRequestNote: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    fontFamily: 'Inter-Regular',
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  menuInfo: {
    flex: 1,
  },
  menuName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    fontFamily: 'Inter-SemiBold',
  },
  menuDescription: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  menuPrice: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  menuControls: {
    marginLeft: Spacing.md,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    minWidth: 20,
    textAlign: 'center',
    fontFamily: 'Inter-SemiBold',
  },
  addButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  addButtonText: {
    fontSize: FontSize.sm,
    color: Colors.surface,
    fontWeight: FontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  specialRequestsInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: Spacing.md,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    backgroundColor: Colors.surface,
    textAlignVertical: 'top',
    fontFamily: 'Inter-Regular',
  },
  summaryCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  summaryTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    fontFamily: 'Inter-SemiBold',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  summaryLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  summaryValue: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    fontFamily: 'Inter-Regular',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  summaryTotal: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    fontFamily: 'Poppins-Bold',
  },
  summaryTotalValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    fontFamily: 'Poppins-Bold',
  },
  paymentNote: {
    fontSize: FontSize.xs,
    color: Colors.warning,
    fontStyle: 'italic',
    marginTop: Spacing.sm,
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