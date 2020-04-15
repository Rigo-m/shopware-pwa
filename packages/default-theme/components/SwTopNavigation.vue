<template>
  <div class="top-navigation">
    <SfHeader
      title="Shopware-PWA"
      :has-mobile-search="false"
      :is-sticky="false"
      :cart-items-qty="count.toString()"
    >
      <template #logo>
        <nuxt-link to="/" class="sf-header__logo">
          <SfImage src="/img/logo.png" alt="Shopware PWA" />
        </nuxt-link>
      </template>
      <template #navigation>
        <SfHeaderNavigationItem
          v-for="category in navigationElements"
          :key="category.name"
          class="sf-header__link"
          @mouseover="setHoverNavigationItem(category.name)"
          @mouseleave="setHoverNavigationItem('')"
          @keyup.tab="setHoverNavigationItem(category.name)"
        >
          <nuxt-link class="sf-header__link" :to="path(category)">
            {{ category.name }}
          </nuxt-link>
          <SwMegaMenu :category="category" :hoveredItem="hoveredNavigationItem" v-if="category.children.length"/>
        </SfHeaderNavigationItem>
      </template>
      <template #search>
        <SfSearchBar
          placeholder="Search for products"
          class="sf-header__search"
          @enter="fulltextSearch"
        />
      </template>
      <template #header-icons="{accountIcon, cartIcon}">
        <div class="sf-header__icons desktop-only">
          <div class="sf-header__icons">
            <SfCircleIcon
              v-if="accountIcon"
              :icon="accountIcon"
              icon-size="1.25rem"
              class="sf-header__circle-icon"
              :class="{
                'sf-header__circle-icon--is-active':
                  activeIcon === 'account-icon'
              }"
              role="button"
              aria-label="account-icon"
              :aria-pressed="activeIcon === 'account-icon' ? 'true' : 'false'"
              :has-badge="isLoggedIn"
              @click="userIconClick"
            />
            <SfCircleIcon
              v-if="cartIcon"
              :icon="cartIcon"
              :has-badge="count > 0"
              :badge-label="count.toString()"
              icon-size="1.25rem"
              class="sf-header__circle-icon"
              :class="{
                'sf-header__circle-icon--is-active': activeIcon === 'cart-icon'
              }"
              role="button"
              aria-label="cart-icon"
              :aria-pressed="activeIcon === 'cart-icon' ? 'true' : 'false'"
              @click="toggleSidebar"
            />
          </div>
        </div>
      </template>
    </SfHeader>
    <SwLoginModal :is-open="isModalOpen" @close="isModalOpen = false" />
  </div>
</template>

<script>
import { SfHeader, SfCircleIcon, SfImage, SfSearchBar } from '@storefront-ui/vue'
import {
  useUser,
  useCart,
  useCartSidebar,
  useUserLoginModal,
  useNavigation,
  useProductSearch
} from '@shopware-pwa/composables'
import SwLoginModal from '@shopware-pwa/default-theme/components/modals/SwLoginModal'
import SwMegaMenu from '@shopware-pwa/default-theme/components/SwMegaMenu'
import { ref, reactive, onMounted } from "@vue/composition-api";
import { PAGE_ACCOUNT } from '@shopware-pwa/default-theme/helpers/pages'
import helpers from '@shopware-pwa/default-theme/helpers'

export default {
  components: { SfHeader, SfCircleIcon, SwLoginModal, SfImage, SfSearchBar, SwMegaMenu },
  setup() {
    const { isLoggedIn, logout } = useUser()
    const { count } = useCart()
    const { toggleSidebar } = useCartSidebar()
    const { toggleModal } = useUserLoginModal()
    const { search: fulltextSearch } = useProductSearch()
    const {hoveredNavigationItem, getNavigationElements, navigationElements} = useNavigation()

    // onMounted(getNavigationElements(3))

    function setHoverNavigationItem(itemName) {
      hoveredNavigationItem.value = itemName
    }

    return {
      count,
      toggleModal,
      toggleSidebar,
      isLoggedIn,
      logout,
      fulltextSearch,
      navigationElements,
      hoveredNavigationItem,
      setHoverNavigationItem,
      path: helpers.getCategoryRoutePath,
      getNavigationElements
    }
  },
  data() {
    return {
      activeSidebar: 'account',
      activeIcon: '',
      isModalOpen: false
    }
  },
  async mounted() {
    await this.getNavigationElements(3)
  },
  methods: {
    userIconClick() {
      if (this.isLoggedIn) this.$router.push(PAGE_ACCOUNT)
      else this.toggleModal()
    }
  },

}
</script>

<style lang="scss">
@import '~@storefront-ui/vue/styles.scss';

.top-navigation {
  margin-bottom: var(--spacer-medium);
  @include for-desktop {

    .sf-header {
      display: flex;
      justify-content: space-between;

      &__sticky-container {
        width: 100%;
      }

      &__container {
        @include for-desktop {
          padding: 0px;
        }
      }

      &__navigation {
        flex: 1;
      }

      &__link {
        display: flex;
        align-items: center;
        height: 100;
      }
    }
  }

  .sf-image img {
    height: 2rem;
    width: 2.1rem;
  }
}

.sf-header__logo {
  height: 2rem;
}
</style>