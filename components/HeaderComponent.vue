<template>
  <div class="menu">
    <span class="UBadge">
      <UBadge
        icon="material-symbols:storefront"
        size="xl"
        color="primary"
        variant="solid"
        >Store</UBadge
      >
    </span>
    <UNavigationMenu :items="items" class="w-full justify-start" />

    <UModal title="Create Product">
      <div class="flex justify-end items-center gap-2 p-4">
        <UButton
          icon="material-symbols:add-circle"
          size="xl"
          color="primary"
          variant="solid"
        />
      </div>

      <UDrawer direction="right">
        <UButton
          color="primary"
          variant="solid"
          size="xl"
          icon="material-symbols:shopping-cart"
        />
        <template #content>
          <div class="flex flex-col gap-4 p-4 overflow-y-auto">
            <UContainer v-for="cartItem in cartItems">
              <div class="flex items-center gap-4">
                <UButton
                  icon="material-symbols:delete"
                  color="error"
                  variant="solid"
                  size="sm"
                  @click="removeCartItem(cartItem.id)"
                />
                <img
                  :src="cartItem.image_url || '/placeholder-image.jpg'"
                  :alt="cartItem.name"
                  class="w-10 h-16 object-contain hover:scale-105 transition-transform duration-200"
                />
                <div>
                  <h1>{{ cartItem.name }}</h1>
                  <p class="text-sm text-gray-500">R$ {{ cartItem.price }}</p>
                  <UInputNumber
                    size="sm"
                    v-model="cartItem.quantity"
                    @update:model-value="
                      (val) => updateCartQuantity(cartItem.id, val)
                    "
                    :min="1"
                  />
                </div>
              </div>
            </UContainer>
          </div>
        </template>
      </UDrawer>

      <template #body>
        <div class="content">
          <UForm
            :validate="validate"
            :state="state"
            class="space-y-4"
            @submit="onSubmit"
          >
            <UFormField label="Name" name="name">
              <UInput v-model="state.name" class="w-full" />
            </UFormField>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UFormField label="Price" name="price">
                <UInput v-model="state.price" type="number" class="w-full" />
              </UFormField>

              <UFormField label="Category" name="category">
                <UInput v-model="state.category" type="text" class="w-full" />
              </UFormField>
            </div>

            <UFormField label="Description" name="description">
              <UTextarea
                v-model="state.description"
                type="text"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Url Image" name="image_url">
              <UInput v-model="state.image_url" class="w-full" />
            </UFormField>
            <div class="flex justify-end gap-2">
              <UButton type="submit"> Submit </UButton>
            </div>
          </UForm>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import type { FormError, FormSubmitEvent } from "@nuxt/ui";
import { storeToRefs } from "pinia";
import { useCartStore } from "../stores/cart";
import { useProductsStore } from "../stores/products";

export interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  category: string;
}

const items = ref<NavigationMenuItem[]>([
  {
    label: "Home",
    icon: "material-symbols:home-outline-rounded",
    to: "/",
    active: true,
  },
]);
const cartStore = useCartStore();
const productsStore = useProductsStore();
const { items: cartItems } = storeToRefs(cartStore);
const toast = useToast();
const state = reactive({
  name: undefined,
  price: undefined,
  description: undefined,
  category: undefined,
  image_url: undefined,
});

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.name) errors.push({ name: "name", message: "Name is required" });
  if (!state.price)
    errors.push({ name: "price", message: "Price is required" });
  if (!state.category)
    errors.push({ name: "category", message: "Category is required" });
  if (!state.description)
    errors.push({ name: "description", message: "Description is required" });
  return errors;
};

async function onSubmit(event: FormSubmitEvent<typeof state>) {
  try {
    await productsStore.createProduct({
      name: event.data.name,
      description: event.data.description,
      price: event.data.price ? parseFloat(event.data.price) : 0,
      category: event.data.category,
      image_url: event.data.image_url || null,
    });
    toast.add({
      title: "Success",
      description: "Product created successfully!",
      color: "success",
    });
    Object.assign(state, {
      name: undefined,
      price: undefined,
      description: undefined,
      category: undefined,
      image_url: undefined,
    });
  } catch (error) {
    toast.add({
      title: "Error",
      description: "Failed to create product. Please try again.",
      color: "error",
    });
  }
}

function updateCartQuantity(id: number, quantity: number) {
  cartStore.updateQuantity(id, quantity);
}

function removeCartItem(id: number) {
  cartStore.removeFromCart(id);
}

window.addEventListener("storage", (event) => {
  if (event.key === "cart") {
    cartStore.loadFromLocalStorage();
  }
});

onMounted(() => {
  cartStore.loadFromLocalStorage();
});
</script>

<style scoped>
.menu {
  display: flex;
  justify-content: start;
  align-items: center;
  flex-direction: row;
  padding: 12px 16px;
  .UBadge {
    margin-right: 16px;
  }
}
.content {
  margin: 16px;
  width: auto;
  height: auto;
}
</style>
