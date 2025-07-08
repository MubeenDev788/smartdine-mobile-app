import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert, Modal } from 'react-native';
import { Colors, Spacing, FontSize, FontWeight } from '@/constants/Colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Search, CreditCard as Edit, Trash2, Star, Camera, X } from 'lucide-react-native';

export default function MenuScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: 'Chicken Biryani',
      description: 'Aromatic basmati rice with tender chicken and traditional spices',
      price: 450,
      category: 'Main Course',
      image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=300',
      available: true,
      popular: true,
      rating: 4.8,
      preparationTime: 25,
    },
    {
      id: 2,
      name: 'Seekh Kabab',
      description: 'Grilled minced meat skewers with herbs and spices',
      price: 320,
      category: 'Appetizers',
      image: 'https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg?auto=compress&cs=tinysrgb&w=300',
      available: true,
      popular: false,
      rating: 4.6,
      preparationTime: 15,
    },
    {
      id: 3,
      name: 'Karahi Chicken',
      description: 'Traditional Pakistani chicken curry cooked in a wok',
      price: 380,
      category: 'Main Course',
      image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=300',
      available: false,
      popular: true,
      rating: 4.7,
      preparationTime: 30,
    },
    {
      id: 4,
      name: 'Gulab Jamun',
      description: 'Sweet milk dumplings in rose-flavored syrup',
      price: 180,
      category: 'Desserts',
      image: 'https://images.pexels.com/photos/1625228/pexels-photo-1625228.jpeg?auto=compress&cs=tinysrgb&w=300',
      available: true,
      popular: false,
      rating: 4.5,
      preparationTime: 5,
    },
  ]);

  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Main Course',
    image: '',
    available: true,
    preparationTime: '',
  });

  const categories = ['All', 'Appetizers', 'Main Course', 'Desserts', 'Beverages'];
  
  const sampleImages = [
    'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=300',
    'https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg?auto=compress&cs=tinysrgb&w=300',
    'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=300',
    'https://images.pexels.com/photos/1625228/pexels-photo-1625228.jpeg?auto=compress&cs=tinysrgb&w=300',
    'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&w=300',
    'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=300',
  ];

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const item = {
      id: Date.now(),
      ...newItem,
      price: parseInt(newItem.price),
      preparationTime: parseInt(newItem.preparationTime) || 15,
      popular: false,
      rating: 4.0,
    };

    setMenuItems(prev => [...prev, item]);
    setNewItem({
      name: '',
      description: '',
      price: '',
      category: 'Main Course',
      image: '',
      available: true,
      preparationTime: '',
    });
    setShowAddModal(false);
    Alert.alert('Success', 'Menu item added successfully!');
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.image,
      available: item.available,
      preparationTime: item.preparationTime.toString(),
    });
    setShowAddModal(true);
  };

  const handleUpdateItem = () => {
    if (!newItem.name || !newItem.price) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setMenuItems(prev => prev.map(item => 
      item.id === editingItem.id 
        ? {
            ...item,
            ...newItem,
            price: parseInt(newItem.price),
            preparationTime: parseInt(newItem.preparationTime) || 15,
          }
        : item
    ));

    setEditingItem(null);
    setNewItem({
      name: '',
      description: '',
      price: '',
      category: 'Main Course',
      image: '',
      available: true,
      preparationTime: '',
    });
    setShowAddModal(false);
    Alert.alert('Success', 'Menu item updated successfully!');
  };

  const handleDeleteItem = (itemId: number) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this menu item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setMenuItems(prev => prev.filter(item => item.id !== itemId));
            Alert.alert('Success', 'Menu item deleted successfully!');
          },
        },
      ]
    );
  };

  const toggleAvailability = (itemId: number) => {
    setMenuItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, available: !item.available } : item
    ));
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingItem(null);
    setNewItem({
      name: '',
      description: '',
      price: '',
      category: 'Main Course',
      image: '',
      available: true,
      preparationTime: '',
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Menu Management</Text>
        <Text style={styles.subtitle}>Manage your restaurant menu</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={Colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search menu items..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.textLight}
          />
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Plus size={24} color={Colors.surface} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        <View style={styles.categories}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.categoryChipActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryChipText,
                selectedCategory === category && styles.categoryChipTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>
          {filteredItems.length} items found
        </Text>
        
        <View style={styles.menuList}>
          {filteredItems.map((item) => (
            <Card key={item.id} style={styles.menuCard}>
              <View style={styles.menuItemContent}>
                <Image 
                  source={{ uri: item.image }} 
                  style={styles.menuImage}
                />
                <View style={styles.menuInfo}>
                  <View style={styles.menuHeader}>
                    <Text style={styles.menuName}>{item.name}</Text>
                    <View style={styles.menuActions}>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handleEditItem(item)}
                      >
                        <Edit size={16} color={Colors.textLight} />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 size={16} color={Colors.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <Text style={styles.menuDescription}>{item.description}</Text>
                  
                  <View style={styles.menuMeta}>
                    <View style={styles.rating}>
                      <Star size={14} color={Colors.warning} />
                      <Text style={styles.ratingText}>{item.rating}</Text>
                    </View>
                    <Text style={styles.preparationTime}>{item.preparationTime} min</Text>
                    <Text style={styles.category}>{item.category}</Text>
                  </View>
                  
                  <View style={styles.menuFooter}>
                    <Text style={styles.price}>₨{item.price}</Text>
                    <View style={styles.badges}>
                      {item.popular && (
                        <View style={[styles.badge, { backgroundColor: Colors.primary + '20' }]}>
                          <Text style={[styles.badgeText, { color: Colors.primary }]}>Popular</Text>
                        </View>
                      )}
                      <TouchableOpacity
                        style={[
                          styles.badge,
                          { backgroundColor: item.available ? Colors.success + '20' : Colors.error + '20' }
                        ]}
                        onPress={() => toggleAvailability(item.id)}
                      >
                        <Text style={[
                          styles.badgeText,
                          { color: item.available ? Colors.success : Colors.error }
                        ]}>
                          {item.available ? 'Available' : 'Out of Stock'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </View>

      {/* Add/Edit Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
            </Text>
            <TouchableOpacity onPress={closeModal}>
              <X size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <Input
              label="Item Name *"
              value={newItem.name}
              onChangeText={(value) => setNewItem(prev => ({ ...prev, name: value }))}
              placeholder="Enter item name"
            />

            <Input
              label="Description"
              value={newItem.description}
              onChangeText={(value) => setNewItem(prev => ({ ...prev, description: value }))}
              placeholder="Enter item description"
              multiline
              numberOfLines={3}
            />

            <Input
              label="Price (₨) *"
              value={newItem.price}
              onChangeText={(value) => setNewItem(prev => ({ ...prev, price: value }))}
              placeholder="Enter price"
              keyboardType="numeric"
            />

            <Input
              label="Preparation Time (minutes)"
              value={newItem.preparationTime}
              onChangeText={(value) => setNewItem(prev => ({ ...prev, preparationTime: value }))}
              placeholder="Enter preparation time"
              keyboardType="numeric"
            />

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.categorySelector}>
                {categories.filter(cat => cat !== 'All').map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categorySelectorItem,
                      newItem.category === category && styles.categorySelectorItemActive
                    ]}
                    onPress={() => setNewItem(prev => ({ ...prev, category }))}
                  >
                    <Text style={[
                      styles.categorySelectorText,
                      newItem.category === category && styles.categorySelectorTextActive
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Item Image</Text>
              {newItem.image && (
                <View style={styles.selectedImageContainer}>
                  <Image source={{ uri: newItem.image }} style={styles.selectedImage} />
                  <TouchableOpacity 
                    style={styles.removeImageButton}
                    onPress={() => setNewItem(prev => ({ ...prev, image: '' }))}
                  >
                    <X size={16} color={Colors.surface} />
                  </TouchableOpacity>
                </View>
              )}
              
              <Text style={styles.sampleImagesTitle}>Choose from sample images:</Text>
              <View style={styles.sampleImagesGrid}>
                {sampleImages.map((image, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.sampleImageItem,
                      newItem.image === image && styles.sampleImageItemSelected
                    ]}
                    onPress={() => setNewItem(prev => ({ ...prev, image }))}
                  >
                    <Image source={{ uri: image }} style={styles.sampleImagePreview} />
                    {newItem.image === image && (
                      <View style={styles.selectedOverlay}>
                        <Text style={styles.selectedText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.uploadImageButton}>
                <Camera size={20} color={Colors.primary} />
                <Text style={styles.uploadImageText}>Upload Custom Image</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.availabilityToggle}>
              <Text style={styles.inputLabel}>Availability</Text>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  newItem.available && styles.toggleButtonActive
                ]}
                onPress={() => setNewItem(prev => ({ ...prev, available: !prev.available }))}
              >
                <Text style={[
                  styles.toggleButtonText,
                  newItem.available && styles.toggleButtonTextActive
                ]}>
                  {newItem.available ? 'Available' : 'Out of Stock'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <Button
              title="Cancel"
              onPress={closeModal}
              variant="outline"
              size="large"
              style={styles.modalButton}
            />
            <Button
              title={editingItem ? 'Update Item' : 'Add Item'}
              onPress={editingItem ? handleUpdateItem : handleAddItem}
              variant="primary"
              size="large"
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>
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
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
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
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontFamily: 'Inter-Regular',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesContainer: {
    marginBottom: Spacing.lg,
  },
  categories: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryChipText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  categoryChipTextActive: {
    color: Colors.surface,
  },
  menuSection: {
    paddingHorizontal: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    fontFamily: 'Inter-SemiBold',
  },
  menuList: {
    gap: Spacing.md,
  },
  menuCard: {
    padding: 0,
    marginBottom: Spacing.sm,
  },
  menuItemContent: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
  menuImage: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  menuInfo: {
    flex: 1,
    padding: Spacing.md,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  menuName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    flex: 1,
    fontFamily: 'Poppins-Bold',
  },
  menuActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    padding: Spacing.xs,
    borderRadius: 4,
  },
  menuDescription: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    lineHeight: 18,
    fontFamily: 'Inter-Regular',
  },
  menuMeta: {
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
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  preparationTime: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
    fontFamily: 'Inter-Regular',
  },
  category: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
    fontFamily: 'Inter-Regular',
  },
  menuFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    fontFamily: 'Poppins-Bold',
  },
  badges: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    fontFamily: 'Poppins-Bold',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    fontFamily: 'Inter-SemiBold',
  },
  categorySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categorySelectorItem: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categorySelectorItemActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categorySelectorText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  categorySelectorTextActive: {
    color: Colors.surface,
  },
  selectedImageContainer: {
    position: 'relative',
    alignSelf: 'flex-start',
    marginBottom: Spacing.md,
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
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
  sampleImagesTitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    fontFamily: 'Inter-Regular',
  },
  sampleImagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sampleImageItem: {
    position: 'relative',
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
  },
  sampleImageItemSelected: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  sampleImagePreview: {
    width: '100%',
    height: '100%',
  },
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.primary + '80',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedText: {
    color: Colors.surface,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  uploadImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    gap: Spacing.sm,
  },
  uploadImageText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  availabilityToggle: {
    marginBottom: Spacing.lg,
  },
  toggleButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  toggleButtonText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  toggleButtonTextActive: {
    color: Colors.surface,
    fontWeight: FontWeight.semibold,
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  modalButton: {
    flex: 1,
  },
});