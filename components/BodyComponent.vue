<template>
  <div class="margin-body">
    <div class="filter">
      <div class="search">
        <UInput
          v-model="searchValue"
          icon="i-lucide-search"
          size="lg"
          variant="outline"
          placeholder="Search..."
          class="w-full"
        />
      </div>

      <USelect v-model="categoryValue" :items="categoryOptions" class="w-48" />
      <div class="select-filter">
        <UCheckboxGroup
          v-model="selectedCheckOptions"
          :items="checkOptions"
          size="lg"
          orientation="horizontal"
        />
      </div>
    </div>
    <div
      v-if="products.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <UCard
        v-for="product in products"
        :key="product.id"
        class="h-full flex flex-col bg-gray-50 hover:bg-white transition-colors duration-200 shadow-sm hover:shadow-md font-sans"
      >
        <template #header>
          <div class="space-y-1">
            <h3 class="font-semibold text-sm truncate text-gray-800">
              {{ product.name }}
            </h3>
            <span
              class="text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded-full font-medium"
            >
              {{ product.category }}
            </span>
          </div>
        </template>

        <div class="space-y-3 flex-1 flex flex-col">
          <div class="aspect-square overflow-hidden rounded-md bg-gray-100">
            <img
              :src="product.image_url || '/placeholder-image.jpg'"
              :alt="product.name"
              class="w-full h-full object-contain hover:scale-105 transition-transform duration-200"
            />
          </div>
          <div class="flex-1 flex flex-col justify-between">
            <p class="text-gray-600 text-sm line-clamp-2">
              {{ product.description }}
            </p>
            <p class="text-lg font-bold text-green-600 mt-2">
              R$ {{ product.price }}
            </p>
          </div>
        </div>

        <template #footer>
          <UButtonGroup orientation="horizontal" class="w-full">
            <UButton color="primary" block @click="addToCart(product)">
              Add in Cart
            </UButton>
            <UModal title="Edit Product">
              <UButton
                color="secondary"
                variant="solid"
                icon="i-lucide-edit"
                @click="editProduct(product)"
              />

              <template #body>
                <div class="content">
                  <UForm
                    :validate="validate"
                    :state="product"
                    class="space-y-4"
                    @submit="onSubmit"
                  >
                    <UFormField label="Name" name="name">
                      <UInput v-model="product.name" class="w-full" />
                    </UFormField>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <UFormField label="Price" name="price">
                        <UInput
                          v-model="product.price"
                          type="number"
                          class="w-full"
                        />
                      </UFormField>

                      <UFormField label="Category" name="category">
                        <UInput
                          v-model="product.category"
                          type="text"
                          class="w-full"
                        />
                      </UFormField>
                    </div>

                    <UFormField label="Description" name="description">
                      <UTextarea
                        v-model="product.description"
                        type="text"
                        class="w-full"
                      />
                    </UFormField>

                    <UFormField label="Url Image" name="image_url">
                      <UInput v-model="product.image_url" class="w-full" />
                    </UFormField>
                    <div class="flex justify-end gap-2">
                      <UButton type="submit"> Submit </UButton>
                    </div>
                  </UForm>
                </div>
              </template>
            </UModal>

            <UButton
              color="error"
              variant="solid"
              icon="i-lucide-trash"
              @click="deleteProduct(product.id)"
            />
          </UButtonGroup>
        </template>
      </UCard>
    </div>

    <div
      v-else
      class="flex flex-col items-center justify-center py-16 text-center"
    >
      <div class="text-6xl text-gray-300 mb-4">🔍</div>
      <h3 class="text-xl font-semibold text-gray-700 mb-2">Not Found</h3>
      <p class="text-gray-500">No products match your search</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "@nuxt/ui";
import { ref, watch, computed } from "vue";
import { useCartStore } from "../stores/cart";
import { useProductsStore } from "../stores/products";
const cartStore = useCartStore();
const productsStore = useProductsStore();
const categoryOptions = computed(() => props.categories);
const categoryValue = ref("all");
const searchValue = ref("");
const checkOptions = ref([
  { label: "With Image", value: "with_image" },
  { label: "Without Image", value: "without_image" },
]);
const selectedCheckOptions = ref<string[]>([]);
const props = defineProps<{
  products: Product[];
  categories: string[];
}>();
const toast = useToast();

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  category: string;
}

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

const emit = defineEmits<{
  search: [name: string];
  categoryChange: [category: string];
  imageFilterChange: [filterType: string | null];
  deleteProduct: [id: number];
  editProduct: [product: Product];
}>();

const addToCart = (product: Product) => {
  cartStore.addToCart({
    ...product,
    quantity: 1,
  });
};

const deleteProduct = (productId: number) => {
  emit("deleteProduct", productId);
};

const editProduct = (product: Product) => {
  emit("editProduct", product);
};

let searchTimeout: NodeJS.Timeout;

watch(searchValue, (newValue) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  searchTimeout = setTimeout(() => {
    emit("search", newValue);
  }, 500);
});

watch(categoryValue, (newValue) => {
  emit("categoryChange", newValue);
});

watch(selectedCheckOptions, (newValue) => {
  let filterType: string | null = null;

  const hasWithImage = newValue.includes("with_image");
  const hasWithoutImage = newValue.includes("without_image");

  if (hasWithImage && hasWithoutImage) {
    filterType = null;
  } else if (hasWithImage) {
    filterType = "with_image";
  } else if (hasWithoutImage) {
    filterType = "without_image";
  }

  emit("imageFilterChange", filterType);
});

async function onSubmit(event: FormSubmitEvent<any>) {
  try {
    await productsStore.updateProductByEvent(event);
    toast.add({
      title: "Success",
      description: "Product updated successfully!",
      color: "success",
    });
  } catch (error) {
    toast.add({
      title: "Error",
      description: "Failed to create product. Please try again.",
      color: "error",
    });
  }
}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");

.margin-body {
  margin: 16px !important;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;

  .filter {
    display: flex;
    justify-content: start;
    margin-bottom: 16px;

    .search {
      width: 50%;
      margin-right: 16px;
    }

    .select-filter {
      display: flex;
      align-items: center;
      justify-items: center;
      margin-left: 16px;
    }
  }
}
</style>
