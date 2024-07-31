import type { Schema, Attribute } from '@strapi/strapi';

export interface IapAppleProductIDs extends Schema.Component {
  collectionName: 'components_iap_apple_product_i_ds';
  info: {
    displayName: 'Apple Product IDs';
    description: '';
  };
  attributes: {
    appleProductID: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 2;
      }>;
  };
}

export interface IapGoogleSkUs extends Schema.Component {
  collectionName: 'components_iap_google_s_kuses';
  info: {
    displayName: 'Google SKUs';
    description: '';
  };
  attributes: {
    googleSKU: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 2;
      }>;
  };
}

export interface StripeStripeLegacyPlans extends Schema.Component {
  collectionName: 'components_stripe_stripe_legacy_plans';
  info: {
    displayName: 'Stripe Legacy Plans';
    description: '';
  };
  attributes: {
    stripeLegacyPlan: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
  };
}

export interface StripeStripePlanChoices extends Schema.Component {
  collectionName: 'components_stripe_stripe_plan_choices';
  info: {
    displayName: 'Stripe Plan Choices';
    description: '';
  };
  attributes: {
    stripePlanChoice: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 2;
      }>;
  };
}

export interface StripeStripePromoCodes extends Schema.Component {
  collectionName: 'components_codes_stripe_promo_codes';
  info: {
    displayName: 'Stripe Promo Codes';
    description: '';
  };
  attributes: {
    PromoCode: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 2;
      }>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'iap.apple-product-i-ds': IapAppleProductIDs;
      'iap.google-sk-us': IapGoogleSkUs;
      'stripe.stripe-legacy-plans': StripeStripeLegacyPlans;
      'stripe.stripe-plan-choices': StripeStripePlanChoices;
      'stripe.stripe-promo-codes': StripeStripePromoCodes;
    }
  }
}
