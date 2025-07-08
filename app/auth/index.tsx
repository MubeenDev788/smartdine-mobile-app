import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, withSequence, interpolate } from 'react-native-reanimated';
import { Colors, Spacing, FontSize, FontWeight } from '@/constants/Colors';
import { Button } from '@/components/ui/Button';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function AuthIndex() {
  const scrollY = useSharedValue(0);
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

  const parallaxStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, height],
            [0, -height * 0.3]
          ),
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      {/* Background Video/Image with Overlay */}
      <ImageBackground
        source={{ uri: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1200' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'rgba(255,107,53,0.8)', 'rgba(0,0,0,0.9)']}
          style={styles.overlay}
        />
      </ImageBackground>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={(event) => {
          scrollY.value = event.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
      >
        {/* Hero Section */}
        <Animated.View style={[styles.heroSection, parallaxStyle]}>
          <Animated.View style={[styles.logoContainer, headerAnimatedStyle]}>
            <View style={styles.logoWrapper}>
              <Text style={styles.logoEmoji}>🍽️</Text>
            </View>
            <View style={styles.logoGlow} />
          </Animated.View>

          <Animated.View style={[styles.titleContainer, headerAnimatedStyle]}>
            <Text style={styles.mainTitle}>SmartDine AI</Text>
            <Text style={styles.subtitle}>Revolutionizing Restaurant Experience</Text>
            <Text style={styles.tagline}>Book • Order • Dine • Enjoy</Text>
          </Animated.View>
        </Animated.View>

        {/* Features Section */}
        <Animated.View style={[styles.featuresSection, contentAnimatedStyle]}>
          <View style={styles.featureCard}>
            <LinearGradient
              colors={[Colors.primary + '20', Colors.primary + '10']}
              style={styles.featureGradient}
            >
              <Text style={styles.featureEmoji}>🎯</Text>
              <Text style={styles.featureTitle}>Smart Table Booking</Text>
              <Text style={styles.featureDescription}>
                Find and reserve the perfect table with AI-powered recommendations
              </Text>
            </LinearGradient>
          </View>

          <View style={styles.featureCard}>
            <LinearGradient
              colors={[Colors.secondary + '20', Colors.secondary + '10']}
              style={styles.featureGradient}
            >
              <Text style={styles.featureEmoji}>🍜</Text>
              <Text style={styles.featureTitle}>Pre-Order Meals</Text>
              <Text style={styles.featureDescription}>
                Order your favorite dishes before arriving to skip the wait
              </Text>
            </LinearGradient>
          </View>

          <View style={styles.featureCard}>
            <LinearGradient
              colors={[Colors.accent + '20', Colors.accent + '10']}
              style={styles.featureGradient}
            >
              <Text style={styles.featureEmoji}>💳</Text>
              <Text style={styles.featureTitle}>Secure Payments</Text>
              <Text style={styles.featureDescription}>
                Multiple payment options with secure transactions
              </Text>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* CTA Section */}
        <Animated.View style={[styles.ctaSection, contentAnimatedStyle]}>
          <View style={styles.ctaCard}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              style={styles.ctaGradient}
            >
              <Text style={styles.ctaTitle}>Ready to Transform Your Dining?</Text>
              <Text style={styles.ctaSubtitle}>Join thousands of satisfied customers</Text>
              
              <View style={styles.buttonContainer}>
                <Button
                  title="Get Started"
                  onPress={() => router.push('/auth/role-selection')}
                  variant="secondary"
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
            </LinearGradient>
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
      </ScrollView>
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
    height: height * 1.2,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    height: height * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
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
  },
  logoEmoji: {
    fontSize: 48,
  },
  logoGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.primary + '30',
    top: -10,
    left: -10,
  },
  titleContainer: {
    alignItems: 'center',
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
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
    gap: Spacing.lg,
  },
  featureCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  featureGradient: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  featureEmoji: {
    fontSize: 40,
    marginBottom: Spacing.md,
  },
  featureTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    fontFamily: 'Poppins-Bold',
  },
  featureDescription: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: 'Inter-Regular',
  },
  ctaSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xxl,
  },
  ctaCard: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaGradient: {
    padding: Spacing.xxl,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    fontFamily: 'Poppins-Bold',
  },
  ctaSubtitle: {
    fontSize: FontSize.md,
    color: Colors.surface,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    fontFamily: 'Inter-Regular',
    opacity: 0.9,
  },
  buttonContainer: {
    width: '100%',
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
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
    backgroundColor: Colors.surface + '10',
    marginHorizontal: Spacing.xl,
    borderRadius: 20,
    marginBottom: Spacing.xxl,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FontSize.xxl,
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