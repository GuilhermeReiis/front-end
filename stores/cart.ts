import { defineStore } from 'pinia';

export interface CartItem {
    id: number;
    name: string;
    description: string;
    price: number;
    image_url: string | null;
    category: string;
    quantity: number;
}
const toast = useToast();

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [] as CartItem[],
    }),
    actions: {
        loadFromLocalStorage() {
            const data = localStorage.getItem('cart');
            this.items = data ? JSON.parse(data) : [];
        },
        saveToLocalStorage() {
            localStorage.setItem('cart', JSON.stringify(this.items))
        },
        addToCart(item: CartItem) {
            const found = this.items.find(i => i.id === item.id);
            if (found) {
                found.quantity += item.quantity;
            } else {
                this.items.push({ ...item });
            }
            this.saveToLocalStorage();
            toast.add({
                title: "success",
                description: "Cart updated successfully.",
                color: "success",
            });
        },
        removeFromCart(id: number) {
            this.items = this.items.filter(i => i.id !== id);
            this.saveToLocalStorage();
            toast.add({
                title: "success",
                description: "Cart removed successfully.",
                color: "success",
            });
        },
        updateQuantity(id: number, quantity: number) {
            const found = this.items.find(i => i.id === id);
            if (found) {
                found.quantity = quantity;
                this.saveToLocalStorage();
            }
        },
    },
});
