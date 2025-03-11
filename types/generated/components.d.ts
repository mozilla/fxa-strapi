import type { Schema, Struct } from '@strapi/strapi';

export interface IapAppleProductIDs extends Struct.ComponentSchema {
  collectionName: 'components_iap_apple_product_i_ds';
  info: {
    description: '';
    displayName: 'Apple Product IDs';
  };
  attributes: {
    appleProductID: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 2;
      }>;
  };
}

export interface IapGoogleSkUs extends Struct.ComponentSchema {
  collectionName: 'components_iap_google_s_kuses';
  info: {
    description: '';
    displayName: 'Google SKUs';
  };
  attributes: {
    googleSKU: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 2;
      }>;
  };
}

export interface IapStripeLegacyIapPrices extends Struct.ComponentSchema {
  collectionName: 'components_iap_stripe_legacy_iap_prices';
  info: {
    description: '';
    displayName: 'Stripe Legacy IAP Prices';
  };
  attributes: {
    stripeLegacyIapPrices: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
  };
}

export interface IapStripePlanChoices extends Struct.ComponentSchema {
  collectionName: 'components_iap_stripe_plan_choices';
  info: {
    description: '';
    displayName: 'Stripe Plan Choices';
  };
  attributes: {
    stripePlanChoices: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
  };
}

export interface StripeStripeLegacyPlans extends Struct.ComponentSchema {
  collectionName: 'components_stripe_stripe_legacy_plans';
  info: {
    description: '';
    displayName: 'Stripe Legacy Plans';
  };
  attributes: {
    stripeLegacyPlan: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
  };
}

export interface StripeStripePlanChoices extends Struct.ComponentSchema {
  collectionName: 'components_stripe_stripe_plan_choices';
  info: {
    description: '';
    displayName: 'Stripe Plan Choices';
  };
  attributes: {
    stripePlanChoice: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
  };
}

export interface StripeStripePromoCodes extends Struct.ComponentSchema {
  collectionName: 'components_codes_stripe_promo_codes';
  info: {
    description: '';
    displayName: 'Stripe Promo Codes';
  };
  attributes: {
    PromoCode: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 2;
      }>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'iap.apple-product-i-ds': IapAppleProductIDs;
      'iap.google-sk-us': IapGoogleSkUs;
      'iap.stripe-legacy-iap-prices': IapStripeLegacyIapPrices;
      'iap.stripe-plan-choices': IapStripePlanChoices;
      'stripe.stripe-legacy-plans': StripeStripeLegacyPlans;
      'stripe.stripe-plan-choices': StripeStripePlanChoices;
      'stripe.stripe-promo-codes': StripeStripePromoCodes;
    }
  }
}
