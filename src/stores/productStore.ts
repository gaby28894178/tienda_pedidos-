import { create } from 'zustand';
import { Product } from './cartStore';

export interface Category {
  id: string;
  name: string;
  description: string;
}

interface ProductState {
  products: Product[];
  categories: Category[];
  filteredProducts: Product[];
  selectedCategory: string | null;
  searchTerm: string;
  loading: boolean;
  error: string | null;
  
  loadProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  setSelectedCategory: (categoryId: string | null) => void;
  setSearchTerm: (term: string) => void;
  filterProducts: () => void;
  getProductById: (id: string) => Product | undefined;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  categories: [],
  filteredProducts: [],
  selectedCategory: null,
  searchTerm: '',
  loading: false,
  error: null,
  
  loadProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/products.json');
      if (!response.ok) {
        throw new Error('Failed to load products');
      }
      const data = await response.json();
      set({
        products: data.products,
        categories: data.categories,
        filteredProducts: data.products,
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        loading: false,
      });
    }
  },
  
  setSelectedCategory: (categoryId) => {
    set({ selectedCategory: categoryId });
    get().filterProducts();
  },
  
  setSearchTerm: (term) => {
    set({ searchTerm: term });
    get().filterProducts();
  },
  
  filterProducts: () => {
    const { products, selectedCategory, searchTerm } = get();
    let filtered = products;
    
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
      );
    }
    
    // Only show available products
    filtered = filtered.filter(product => product.available);
    
    set({ filteredProducts: filtered });
  },
  
  addProduct: (productData) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
    };
    set(state => ({
      products: [...state.products, newProduct],
    }));
    get().filterProducts();
  },

  updateProduct: (id, productData) => {
    set(state => ({
      products: state.products.map(product =>
        product.id === id ? { ...product, ...productData } : product
      ),
    }));
    get().filterProducts();
  },

  removeProduct: (id) => {
    set(state => ({
      products: state.products.filter(product => product.id !== id),
    }));
    get().filterProducts();
  },

  getProductById: (id) => {
    return get().products.find(product => product.id === id);
  },
}));