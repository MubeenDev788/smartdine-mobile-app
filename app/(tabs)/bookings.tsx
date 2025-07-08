import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Colors, Spacing, FontSize, FontWeight } from '@/constants/Colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, Clock, Users, MapPin, CircleCheck as CheckCircle, Circle as XCircle, CircleAlert as AlertCircle, CreditCard } from 'lucide-react-native';

export default function BookingsScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');

  if (user?.role === 'restaurant_owner') {
    return <RestaurantBookings />;
  }

  return <CustomerBookings activeTab={activeTab} setActiveTab={setActiveTab} />;
}

function RestaurantBookings() {
  const [selectedDate, setSelectedDate] = useState('today');
  const [bookings, setBookings] = useState([
    {
      id: 1,
      customerName: 'Ahmed Khan',
      customerPhone: '+92 300 1234567',
      table: 'Table 5',
      guests: 4,
      date: '2025-01-15',
      time: '7:30 PM',
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'jazzcash',
      specialRequests: 'Window seat preferred',
      totalAmount: 1200,
    },
    {
      id: 2,
      customerName: 'Sarah Ali',
      customerPhone: '+92 301 2345678',
      table: 'Table 12',
      guests: 2,
      date: '2025-01-15',
      time: '8:00 PM',
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'card',
      specialRequests: '',
      totalAmount: 800,
    },
    {
      id: 3,
      customerName: 'Hassan Shah',
      customerPhone: '+92 302 3456789',
      table: 'Table 8',
      guests: 6,
      date: '2025-01-15',
      time: '6:30 PM',
      status: 'completed',
      paymentStatus: 'paid',
      paymentMethod: 'easypaisa',
      specialRequests: 'Birthday celebration',
      totalAmount: 2400,
    },
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={20} color={Colors.success} />;
      case 'pending':
        return <AlertCircle size={20} color={Colors.warning} />;
      case 'completed':
        return <CheckCircle size={20} color={Colors.accent} />;
      default:
        return <XCircle size={20} color={Colors.error} />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { backgroundColor: Colors.success + '20', color: Colors.success };
      case 'pending':
        return { backgroundColor: Colors.warning + '20', color: Colors.warning };
      case 'completed':
        return { backgroundColor: Colors.accent + '20', color: Colors.accent };
      default:
        return { backgroundColor: Colors.error + '20', color: Colors.error };
    }
  };

  const getPaymentStatusStyle = (status: string) => {
    switch (status) {
      case 'paid':
        return { backgroundColor: Colors.success + '20', color: Colors.success };
      case 'pending':
        return { backgroundColor: Colors.warning + '20', color: Colors.warning };
      case 'failed':
        return { backgroundColor: Colors.error + '20', color: Colors.error };
      default:
        return { backgroundColor: Colors.textLight + '20', color: Colors.textLight };
    }
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'jazzcash': return 'JazzCash';
      case 'easypaisa': return 'EasyPaisa';
      case 'card': return 'Card';
      case 'cash': return 'Cash';
      default: return method;
    }
  };

  const handleConfirmBooking = (bookingId: number) => {
    Alert.alert(
      'Confirm Booking',
      'Are you sure you want to confirm this booking?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            setBookings(prev => prev.map(booking => 
              booking.id === bookingId 
                ? { ...booking, status: 'confirmed' }
                : booking
            ));
            Alert.alert('Success', 'Booking confirmed successfully!');
          },
        },
      ]
    );
  };

  const handleDeclineBooking = (bookingId: number) => {
    Alert.alert(
      'Decline Booking',
      'Are you sure you want to decline this booking?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: () => {
            setBookings(prev => prev.map(booking => 
              booking.id === bookingId 
                ? { ...booking, status: 'cancelled' }
                : booking
            ));
            Alert.alert('Success', 'Booking declined successfully!');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Bookings Management</Text>
        <Text style={styles.subtitle}>Manage your restaurant bookings</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Today</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>18</Text>
          <Text style={styles.statLabel}>This Week</Text>
        </View>
      </View>

      <View style={styles.bookingsList}>
        {bookings.map((booking) => (
          <Card key={booking.id} style={styles.bookingCard}>
            <View style={styles.bookingHeader}>
              <View style={styles.bookingInfo}>
                <Text style={styles.customerName}>{booking.customerName}</Text>
                <Text style={styles.customerPhone}>{booking.customerPhone}</Text>
              </View>
              <View style={[styles.statusBadge, getStatusStyle(booking.status)]}>
                {getStatusIcon(booking.status)}
                <Text style={[styles.statusText, { color: getStatusStyle(booking.status).color }]}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </Text>
              </View>
            </View>

            <View style={styles.bookingDetails}>
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Calendar size={16} color={Colors.textLight} />
                  <Text style={styles.detailText}>{booking.date}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Clock size={16} color={Colors.textLight} />
                  <Text style={styles.detailText}>{booking.time}</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <MapPin size={16} color={Colors.textLight} />
                  <Text style={styles.detailText}>{booking.table}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Users size={16} color={Colors.textLight} />
                  <Text style={styles.detailText}>{booking.guests} guests</Text>
                </View>
              </View>
            </View>

            {/* Payment Information */}
            <View style={styles.paymentSection}>
              <View style={styles.paymentHeader}>
                <CreditCard size={16} color={Colors.textSecondary} />
                <Text style={styles.paymentTitle}>Payment Details</Text>
              </View>
              <View style={styles.paymentInfo}>
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>Method:</Text>
                  <Text style={styles.paymentValue}>{getPaymentMethodName(booking.paymentMethod)}</Text>
                </View>
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>Status:</Text>
                  <View style={[styles.paymentStatusBadge, getPaymentStatusStyle(booking.paymentStatus)]}>
                    <Text style={[styles.paymentStatusText, { color: getPaymentStatusStyle(booking.paymentStatus).color }]}>
                      {booking.paymentStatus === 'paid' ? 'Verified/Paid' : booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                    </Text>
                  </View>
                </View>
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>Amount:</Text>
                  <Text style={styles.paymentAmount}>₨{booking.totalAmount}</Text>
                </View>
              </View>
            </View>

            {booking.specialRequests && (
              <View style={styles.specialRequests}>
                <Text style={styles.specialRequestsTitle}>Special Requests:</Text>
                <Text style={styles.specialRequestsText}>{booking.specialRequests}</Text>
              </View>
            )}

            <View style={styles.bookingFooter}>
              <View style={styles.actionButtons}>
                {booking.status === 'pending' && (
                  <>
                    <Button
                      title="Confirm"
                      onPress={() => handleConfirmBooking(booking.id)}
                      variant="primary"
                      size="small"
                    />
                    <Button
                      title="Decline"
                      onPress={() => handleDeclineBooking(booking.id)}
                      variant="outline"
                      size="small"
                    />
                  </>
                )}
                {booking.status === 'confirmed' && (
                  <Button
                    title="Contact Customer"
                    onPress={() => Alert.alert('Contact', `Calling ${booking.customerPhone}`)}
                    variant="outline"
                    size="small"
                  />
                )}
              </View>
            </View>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

function CustomerBookings({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  const tabs = [
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'past', label: 'Past' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  const bookings = [
    {
      id: 1,
      restaurantName: 'Karachi Kitchen',
      restaurantImage: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400',
      table: 'Table 5',
      guests: 4,
      date: '2025-01-20',
      time: '7:30 PM',
      status: 'confirmed',
      totalAmount: 1200,
      qrCode: 'QR123456',
    },
    {
      id: 2,
      restaurantName: 'Lahore Delights',
      restaurantImage: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400',
      table: 'Table 12',
      guests: 2,
      date: '2025-01-18',
      time: '8:00 PM',
      status: 'completed',
      totalAmount: 800,
      qrCode: 'QR123457',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={20} color={Colors.success} />;
      case 'pending':
        return <AlertCircle size={20} color={Colors.warning} />;
      case 'completed':
        return <CheckCircle size={20} color={Colors.accent} />;
      default:
        return <XCircle size={20} color={Colors.error} />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { backgroundColor: Colors.success + '20', color: Colors.success };
      case 'pending':
        return { backgroundColor: Colors.warning + '20', color: Colors.warning };
      case 'completed':
        return { backgroundColor: Colors.accent + '20', color: Colors.accent };
      default:
        return { backgroundColor: Colors.error + '20', color: Colors.error };
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
        <Text style={styles.subtitle}>Manage your restaurant reservations</Text>
      </View>

      <View style={styles.tabsContainer}>
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

      <View style={styles.bookingsList}>
        {bookings.map((booking) => (
          <Card key={booking.id} style={styles.bookingCard}>
            <View style={styles.bookingHeader}>
              <View style={styles.bookingInfo}>
                <Text style={styles.restaurantName}>{booking.restaurantName}</Text>
                <Text style={styles.bookingId}>Booking #{booking.id}</Text>
              </View>
              <View style={[styles.statusBadge, getStatusStyle(booking.status)]}>
                {getStatusIcon(booking.status)}
                <Text style={[styles.statusText, { color: getStatusStyle(booking.status).color }]}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </Text>
              </View>
            </View>

            <View style={styles.bookingDetails}>
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Calendar size={16} color={Colors.textLight} />
                  <Text style={styles.detailText}>{booking.date}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Clock size={16} color={Colors.textLight} />
                  <Text style={styles.detailText}>{booking.time}</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <MapPin size={16} color={Colors.textLight} />
                  <Text style={styles.detailText}>{booking.table}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Users size={16} color={Colors.textLight} />
                  <Text style={styles.detailText}>{booking.guests} guests</Text>
                </View>
              </View>
            </View>

            <View style={styles.bookingFooter}>
              <Text style={styles.totalAmount}>₨{booking.totalAmount}</Text>
              <View style={styles.actionButtons}>
                {booking.status === 'confirmed' && (
                  <>
                    <Button
                      title="View QR"
                      onPress={() => {}}
                      variant="primary"
                      size="small"
                    />
                    <Button
                      title="Cancel"
                      onPress={() => {}}
                      variant="outline"
                      size="small"
                    />
                  </>
                )}
                {booking.status === 'completed' && (
                  <Button
                    title="Review"
                    onPress={() => {}}
                    variant="outline"
                    size="small"
                  />
                )}
              </View>
            </View>
          </Card>
        ))}
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
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    fontFamily: 'Poppins-Bold',
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    fontFamily: 'Poppins-Bold',
  },
  statLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  bookingsList: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  bookingCard: {
    marginBottom: Spacing.sm,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  bookingInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    fontFamily: 'Poppins-Bold',
  },
  restaurantName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    fontFamily: 'Poppins-Bold',
  },
  customerPhone: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  bookingId: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
    gap: Spacing.xs,
  },
  statusText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  bookingDetails: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flex: 1,
  },
  detailText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  paymentSection: {
    backgroundColor: Colors.borderLight,
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.md,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  paymentTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    fontFamily: 'Inter-SemiBold',
  },
  paymentInfo: {
    gap: Spacing.xs,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  paymentValue: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    fontFamily: 'Inter-Regular',
  },
  paymentStatusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
  },
  paymentStatusText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  paymentAmount: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    fontFamily: 'Poppins-Bold',
  },
  specialRequests: {
    padding: Spacing.md,
    backgroundColor: Colors.borderLight,
    borderRadius: 8,
    marginBottom: Spacing.md,
  },
  specialRequestsTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    fontFamily: 'Inter-SemiBold',
  },
  specialRequestsText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalAmount: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    fontFamily: 'Poppins-Bold',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
});