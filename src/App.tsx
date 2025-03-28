import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Button, Alert, ActivityIndicator, TextInput, ToastAndroid } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const ProductsScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      Alert.alert('error', 'failed to fetch products');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async () => {
    try {
      const response = await fetch('https://fakestoreapi.com/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          price: parseFloat(newPrice),
          description: 'A new product',
          image:'https://img.freepik.com/free-photo/copy-icon-right-side_187299-45738.jpg?t=st=1743186924~exp=1743190524~hmac=208f982c141cb2838c1ed98ef168b1904ef038a16e91d523ecc62fae81fbc305&w=900',
          category: 'electronics',
        }),
      });
      const newProduct = await response.json();
      setProducts([...products, newProduct]);
      setNewTitle('');
      setNewPrice('');
      ToastAndroid.show('product added successfully!', ToastAndroid.SHORT);
    } catch (error) {
      Alert.alert('error', 'could not add product');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Products</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text style={styles.productTitle}>{item.title}</Text>
              <Text style={styles.price}>INR₹{item.price}</Text>
            </View>
          )}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Product Title"
        value={newTitle}
        onChangeText={setNewTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Product Price"
        value={newPrice}
        onChangeText={setNewPrice}
        keyboardType="numeric"
      />
      <Button title="Add Product" onPress={addProduct} color="#007bff" />
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Products" component={ProductsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa', padding: 10 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, color: '#333' },
  productCard: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginVertical: 8, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  image: { width: 100, height: 100, resizeMode: 'contain', marginBottom: 10 },
  productTitle: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 5 },
  price: { fontSize: 16, fontWeight: 'bold', color: '#28a745', marginBottom: 10 },
  input: { width: '80%', padding: 10, marginVertical: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5 },
});
