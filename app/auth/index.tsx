import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, withSequence } from 'react-native-reanimated';
import { Colors, Spacing, FontSize, FontWeight } from '@/constants/Colors';
import { Button } from '@/components/ui/Button';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function AuthIndex() {
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50);
  const scaleAnim = useSharedValue(0.8);

  useEffect(() => {
    fadeAnim.value = withDelay(500, withTiming(1, { duration: 1000 }));
    slideAnim.value = withDelay(700, withTiming(0, { duration: 800 }));
    scaleAnim.value = withDelay(300, withSequence(
      withTiming(1.1, { duration: 600 }),
      withTiming(1, { duration: 300 })
    ));
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [
        { translateY: slideAnim.value },
        { scale: scaleAnim.value }
      ],
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ translateY: slideAnim.value }],
    };
  });

  return (
    <View style={styles.container}>
      {/* Background Image with Overlay */}
      <ImageBackground
        source={{ uri: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1200' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'rgba(255,107,53,0.8)', 'rgba(0,0,0,0.8)']}
          style={styles.overlay}
        />
      </ImageBackground>

      {/* Content */}
      <View style={styles.content}>
        {/* Hero Section */}
        <Animated.View style={[styles.heroSection, headerAnimatedStyle]}>
          <View style={styles.logoContainer}>
            <View style={styles.logoWrapper}>
              <Text style={styles.logoEmoji}>🍽️</Text>
            </View>
          </View>

          <Text style={styles.mainTitle}>SmartDine AI</Text>
          <Text style={styles.subtitle}>Revolutionizing Restaurant Experience</Text>
          <Text style={styles.tagline}>Book • Order • Dine • Enjoy</Text>
        </Animated.View>

        {/* Features Section */}
        <Animated.View style={[styles.featuresSection, contentAnimatedStyle]}>
          <View style={styles.featureCard}>
            <Text style={styles.featureEmoji}>🎯</Text>
            <Text style={styles.featureTitle}>Smart Table Booking</Text>
            <Text style={styles.featureDescription}>
              Find and reserve the perfect table with AI-powered recommendations
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureEmoji}>🍜</Text>
            <Text style={styles.featureTitle}>Pre-Order Meals</Text>
            <Text style={styles.featureDescription}>
              Order your favorite dishes before arriving to skip the wait
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureEmoji}>💳</Text>
            <Text style={styles.featureTitle}>Secure Payments</Text>
            <Text style={styles.featureDescription}>
              Multiple payment options with secure transactions
            </Text>
          </View>
        </Animated.View>

        {/* CTA Section */}
        <Animated.View style={[styles.ctaSection, contentAnimatedStyle]}>
          <View style={styles.buttonContainer}>
            <Button
              title="Get Started"
              onPress={() => router.push('/auth/role-selection')}
              variant="primary"
              size="large"
              style={styles.primaryButton}
            />
            
            <Button
              title="Already have an account?"
              onPress={() => router.push('/auth/sign-in')}
              variant="ghost"
              size="medium"
              style={styles.secondaryButton}
              textStyle={styles.secondaryButtonText}
            />
          </View>
        </Animated.View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>10K+</Text>
            <Text style={styles.statLabel}>Happy Customers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>500+</Text>
            <Text style={styles.statLabel}>Partner Restaurants</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>50K+</Text>
            <Text style={styles.statLabel}>Successful Bookings</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: height * 0.1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: Spacing.lg,
  },
  logoEmoji: {
    fontSize: 48,
  },
  mainTitle: {
    fontSize: FontSize.xxxl + 8,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    fontFamily: 'Poppins-Bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: FontSize.lg,
    color: Colors.surface,
    textAlign: 'center',
    marginBottom: Spacing.md,
    fontFamily: 'Inter-Medium',
    opacity: 0.9,
  },
  tagline: {
    fontSize: FontSize.md,
    color: Colors.surface,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    opacity: 0.8,
  },
  featuresSection: {
    gap: Spacing.lg,
    marginVertical: Spacing.xl,
  },
  featureCard: {
    backgroundColor: Colors.surface + '15',
    padding: Spacing.lg,
    borderRadius: 16,
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  featureEmoji: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  featureTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
    textAlign: 'center',
    marginBottom: Spacing.xs,
    fontFamily: 'Poppins-Bold',
  },
  featureDescription: {
    fontSize: FontSize.sm,
    color: Colors.surface,
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
    opacity: 0.9,
  },
  ctaSection: {
    marginBottom: Spacing.lg,
  },
  buttonContainer: {
    gap: Spacing.md,
  },
  primaryButton: {
    backgroundColor: Colors.surface,
    shadowColor: Colors.surface,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.surface + '50',
  },
  secondaryButtonText: {
    color: Colors.surface,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.surface + '10',
    borderRadius: 16,
    paddingVertical: Spacing.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
    fontFamily: 'Poppins-Bold',
  },
  statLabel: {
    fontSize: FontSize.sm,
    color: Colors.surface,
    fontFamily: 'Inter-Regular',
    opacity: 0.8,
  },
});