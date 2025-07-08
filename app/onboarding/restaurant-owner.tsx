import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing, FontSize, FontWeight } from '@/constants/Colors';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { ChevronRight, MapPin, Clock, Users, Utensils, Camera, Plus, X } from 'lucide-react-native';

export default function RestaurantOwnerOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    restaurantName: '',
    address: '',
    contactNumber: '',
    operatingHours: {
      openTime: '',
      closeTime: '',
    },
    cuisineTypes: [] as string[],
    totalTables: '',
    chefCount: '',
    waiterCount: '',
    hasWifi: false,
    hasParking: false,
    bookingSlotDuration: '60',
    jazzcashWallet: '',
    easypaisaWallet: '',
    images: [] as string[],
    videos: [] as string[],
  });

  const steps = [
    'Basic Information',
    'Media Upload',
    'Operating Hours',
    'Cuisine & Facilities',
    'Staff & Tables',
    'Payment Setup',
  ];

  const cuisineOptions = [
    'Pakistani', 'Indian', 'Chinese', 'Italian', 'Fast Food',
    'BBQ', 'Continental', 'Seafood', 'Desserts', 'Beverages'
  ];

  const sampleImages = [
    'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=400',
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    Alert.alert(
      'Setup Complete!',
      'Your restaurant profile has been created successfully.',
      [
        {
          text: 'Continue',
          onPress: () => router.replace('/(tabs)'),
        },
      ]
    );
  };

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const toggleCuisine = (cuisine: string) => {
    setFormData(prev => ({
      ...prev,
      cuisineTypes: prev.cuisineTypes.includes(cuisine)
        ? prev.cuisineTypes.filter(c => c !== cuisine)
        : [...prev.cuisineTypes, cuisine]
    }));
  };

  const addSampleImage = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, imageUrl]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <MapPin size={24} color={Colors.primary} />
              <Text style={styles.stepTitle}>Basic Information</Text>
            </View>
            <Input
              label="Restaurant Name"
              value={formData.restaurantName}
              onChangeText={(value) => updateFormData('restaurantName', value)}
              placeholder="Enter your restaurant name"
            />
            <Input
              label="Address"
              value={formData.address}
              onChangeText={(value) => updateFormData('address', value)}
              placeholder="Enter complete address"
              multiline
              numberOfLines={3}
            />
            <Input
              label="Contact Number"
              value={formData.contactNumber}
              onChangeText={(value) => updateFormData('contactNumber', value)}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
          </View>
        );

      case 1:
        return (
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <Camera size={24} color={Colors.primary} />
              <Text style={styles.stepTitle}>Restaurant Media</Text>
            </View>
            <Text style={styles.sectionDescription}>
              Add photos and videos of your restaurant to attract customers
            </Text>
            
            {/* Current Images */}
            {formData.images.length > 0 && (
              <View style={styles.mediaSection}>
                <Text style={styles.sectionTitle}>Added Images ({formData.images.length})</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.imagesList}>
                    {formData.images.map((image, index) => (
                      <View key={index} style={styles.imageContainer}>
                        <Image source={{ uri: image }} style={styles.previewImage} />
                        <TouchableOpacity 
                          style={styles.removeButton}
                          onPress={() => removeImage(index)}
                        >
                          <X size={16} color={Colors.surface} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}

            {/* Sample Images to Add */}
            <View style={styles.mediaSection}>
              <Text style={styles.sectionTitle}>Sample Restaurant Images</Text>
              <Text style={styles.sectionSubtitle}>Tap to add to your restaurant gallery</Text>
              <View style={styles.sampleImagesGrid}>
                {sampleImages.map((image, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.sampleImageContainer}
                    onPress={() => addSampleImage(image)}
                    disabled={formData.images.includes(image)}
                  >
                    <Image source={{ uri: image }} style={styles.sampleImage} />
                    {formData.images.includes(image) ? (
                      <View style={styles.addedOverlay}>
                        <Text style={styles.addedText}>✓ Added</Text>
                      </View>
                    ) : (
                      <View style={styles.addOverlay}>
                        <Plus size={20} color={Colors.surface} />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Upload Options */}
            <View style={styles.uploadSection}>
              <TouchableOpacity style={styles.uploadButton}>
                <Camera size={24} color={Colors.primary} />
                <Text style={styles.uploadButtonText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.uploadButton}>
                <Plus size={24} color={Colors.primary} />
                <Text style={styles.uploadButtonText}>Upload from Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <Clock size={24} color={Colors.primary} />
              <Text style={styles.stepTitle}>Operating Hours</Text>
            </View>
            <Input
              label="Opening Time"
              value={formData.operatingHours.openTime}
              onChangeText={(value) => updateFormData('operatingHours', { ...formData.operatingHours, openTime: value })}
              placeholder="e.g., 10:00 AM"
            />
            <Input
              label="Closing Time"
              value={formData.operatingHours.closeTime}
              onChangeText={(value) => updateFormData('operatingHours', { ...formData.operatingHours, closeTime: value })}
              placeholder="e.g., 11:00 PM"
            />
            <Input
              label="Booking Slot Duration (minutes)"
              value={formData.bookingSlotDuration}
              onChangeText={(value) => updateFormData('bookingSlotDuration', value)}
              placeholder="60"
              keyboardType="numeric"
            />
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <Utensils size={24} color={Colors.primary} />
              <Text style={styles.stepTitle}>Cuisine & Facilities</Text>
            </View>
            <Text style={styles.sectionTitle}>Cuisine Types</Text>
            <View style={styles.cuisineGrid}>
              {cuisineOptions.map((cuisine) => (
                <TouchableOpacity
                  key={cuisine}
                  style={[
                    styles.cuisineChip,
                    formData.cuisineTypes.includes(cuisine) && styles.cuisineChipSelected
                  ]}
                  onPress={() => toggleCuisine(cuisine)}
                >
                  <Text style={[
                    styles.cuisineChipText,
                    formData.cuisineTypes.includes(cuisine) && styles.cuisineChipTextSelected
                  ]}>
                    {cuisine}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.sectionTitle}>Facilities</Text>
            <TouchableOpacity
              style={styles.facilityItem}
              onPress={() => updateFormData('hasWifi', !formData.hasWifi)}
            >
              <View style={[styles.checkbox, formData.hasWifi && styles.checkboxSelected]}>
                {formData.hasWifi && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.facilityText}>WiFi Available</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.facilityItem}
              onPress={() => updateFormData('hasParking', !formData.hasParking)}
            >
              <View style={[styles.checkbox, formData.hasParking && styles.checkboxSelected]}>
                {formData.hasParking && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.facilityText}>Parking Available</Text>
            </TouchableOpacity>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <Users size={24} color={Colors.primary} />
              <Text style={styles.stepTitle}>Staff & Tables</Text>
            </View>
            <Input
              label="Number of Tables"
              value={formData.totalTables}
              onChangeText={(value) => updateFormData('totalTables', value)}
              placeholder="e.g., 20"
              keyboardType="numeric"
            />
            <Input
              label="Number of Chefs"
              value={formData.chefCount}
              onChangeText={(value) => updateFormData('chefCount', value)}
              placeholder="e.g., 3"
              keyboardType="numeric"
            />
            <Input
              label="Number of Waiters"
              value={formData.waiterCount}
              onChangeText={(value) => updateFormData('waiterCount', value)}
              placeholder="e.g., 5"
              keyboardType="numeric"
            />
          </View>
        );

      case 5:
        return (
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepIcon}>💳</Text>
              <Text style={styles.stepTitle}>Payment Setup</Text>
            </View>
            <Input
              label="JazzCash Wallet ID (Optional)"
              value={formData.jazzcashWallet}
              onChangeText={(value) => updateFormData('jazzcashWallet', value)}
              placeholder="Enter JazzCash wallet ID"
            />
            <Input
              label="EasyPaisa Wallet ID (Optional)"
              value={formData.easypaisaWallet}
              onChangeText={(value) => updateFormData('easypaisaWallet', value)}
              placeholder="Enter EasyPaisa wallet ID"
            />
            <Text style={styles.paymentNote}>
              You can set up additional payment methods later from your dashboard
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Restaurant Setup</Text>
        <Text style={styles.subtitle}>Step {currentStep + 1} of {steps.length}</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${((currentStep + 1) / steps.length) * 100}%` }]} />
          </View>
        </View>
      </View>

      <Card style={styles.card}>
        {renderStep()}
      </Card>

      <View style={styles.buttons}>
        {currentStep > 0 && (
          <Button
            title="Back"
            onPress={handleBack}
            variant="outline"
            size="large"
            style={styles.backButton}
          />
        )}
        <Button
          title={currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
          onPress={handleNext}
          variant="primary"
          size="large"
          style={styles.nextButton}
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
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    fontFamily: 'Inter-Regular',
  },
  progressContainer: {
    marginTop: Spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  card: {
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  stepContent: {
    gap: Spacing.md,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  stepIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  stepTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginLeft: Spacing.md,
    fontFamily: 'Poppins-Bold',
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    fontFamily: 'Inter-SemiBold',
  },
  sectionSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    fontFamily: 'Inter-Regular',
  },
  sectionDescription: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
  },
  mediaSection: {
    marginBottom: Spacing.lg,
  },
  imagesList: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingRight: Spacing.lg,
  },
  imageContainer: {
    position: 'relative',
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sampleImagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  sampleImageContainer: {
    position: 'relative',
    width: '48%',
  },
  sampleImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  addOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  addedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.success + '80',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  addedText: {
    color: Colors.surface,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  uploadSection: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  uploadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    gap: Spacing.sm,
  },
  uploadButtonText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  cuisineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  cuisineChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.borderLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cuisineChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  cuisineChipText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  cuisineChipTextSelected: {
    color: Colors.surface,
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.border,
    marginRight: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkmark: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: FontWeight.bold,
  },
  facilityText: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontFamily: 'Inter-Regular',
  },
  paymentNote: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: Spacing.sm,
    fontFamily: 'Inter-Regular',
  },
  buttons: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
});