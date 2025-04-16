import { Injectable } from '@angular/core';
import { Product } from '../../app.model';
import { HttpClient } from '@angular/common/http';
import { Firestore, collection, collectionData, doc, docData, setDoc, addDoc, updateDoc, deleteDoc, getDoc, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  constructor(private firestore: Firestore, private http: HttpClient) {}

  getProductsObservable(): Observable<Product[]> {
    const productsRef = collection(this.firestore, 'products');
    return collectionData(productsRef, { idField: 'id' }) as Observable<Product[]>;
  }

  addProduct(product: Product) {
    const productsRef = collection(this.firestore, 'products');
    return addDoc(productsRef, product);
  }

  getProductById(id: string): Observable<Product | undefined> {
    const productRef = doc(this.firestore, `products/${id}`);
    return docData(productRef, { idField: 'id' }) as Observable<Product>;
  }

  getCartProducts(): Observable<Product[]> {
    const cartRef = collection(this.firestore, 'cart');
    return collectionData(cartRef, { idField: 'id' }) as Observable<Product[]>;
  }

  getOrders(): Observable<Product[]> {
    const ordersRef = collection(this.firestore, 'orders');
    return collectionData(ordersRef, { idField: 'id' }) as Observable<Product[]>;
  }

  addToCart(product: Product) {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    console.log(user)
    product.userEmail = user.email;
    product.userName = user.username;

    const cartDocRef = doc(this.firestore, `cart/${product.id}_${user.email}`);
    getDoc(cartDocRef).then(docSnap => {
      if (docSnap.exists()) {
        const cartProduct = docSnap.data() as Product;
        setDoc(cartDocRef, { quantity: (cartProduct.quantity || 0) + 1 });
      } else {
        setDoc(cartDocRef, { ...product, quantity: 1 });
      }
    });
  }

  checkout(product: Product) {
    const productRef = doc(this.firestore, `products/${product.id}`);
    getDoc(productRef).then(docSnap => {
      if (docSnap.exists()) {
        const productData = docSnap.data() as Product;
        const newQuantity = Math.max(0, productData.quantity + product.quantity);
        updateDoc(productRef, { quantity: newQuantity }).then(() => {
          const cartRef = doc(this.firestore, `cart/${product.id}`);
          deleteDoc(cartRef);
        });
      }
    });
  }

  buy(product: Product) {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    product.status = 'In-transit';
    product.timestamp = new Date().toLocaleString();
    product.userEmail = user.email;
    product.userName = user.username;

    const ordersRef = collection(this.firestore, 'orders');
    addDoc(ordersRef, product).then(() => {
      const cartRef = doc(this.firestore, `cart/${product.id}`);
      deleteDoc(cartRef);
    });
  }

  // updateProduct(updatedProduct: Product) {
  //   const productRef = doc(this.firestore, `products/${updatedProduct.id}`);
  //   return updateDoc(productRef, updatedProduct);
  // }

  deleteProduct(product: Product) {
    this.updateCartProductQuantity(product, 0);
    const productRef = doc(this.firestore, `products/${product.id}`);
    return deleteDoc(productRef);
  }

  updateCartProductQuantity(product: Product, change: number) {
    const cartRef = doc(this.firestore, `cart/${product.id}`);
    getDoc(cartRef).then(docSnap => {
      if (docSnap.exists()) {
        const cartItem = docSnap.data() as Product;
        const newQuantity = Math.max(0, (cartItem.quantity || 0) + change);
        if (newQuantity === 0 || change === 0) {
          deleteDoc(cartRef);
        } else {
          setDoc(cartRef, { quantity: newQuantity });
        }
      } else if (change > 0) {
        setDoc(cartRef, { ...product, quantity: change });
      }
    });
  }

  updateOrder(updatedOrder: Product) {
    if (!updatedOrder.id) {
      console.error('Error: Order ID is missing');
      return;
    }
    const orderRef = doc(this.firestore, `orders/${updatedOrder.id}`);
    return setDoc(orderRef, updatedOrder);
  }

  getOrdersForUser(userEmail: string): Observable<Product[]> {
    const ordersRef = collection(this.firestore, 'orders');
    const q = query(ordersRef, where('userEmail', '==', userEmail));
    return collectionData(q, { idField: 'id' }) as Observable<Product[]>;
  }

  getCartForUser(userEmail: string): Observable<Product[]> {
    const cartRef = collection(this.firestore, 'cart');
    const q = query(cartRef, where('userEmail', '==', userEmail));
    return collectionData(q, { idField: 'id' }) as Observable<Product[]>;
  }

  updateProduct(updatedProduct: Product) {
    const productRef = doc(this.firestore, `products/${updatedProduct.id}`);
    return updateDoc(productRef, {
      name: updatedProduct.name,
      description: updatedProduct.description,
      quantity: updatedProduct.quantity
    });
  }
  

  
  
}
