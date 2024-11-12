import type { Schema, Struct } from '@strapi/strapi';

export interface IapAppleProductIDs extends Struct.ComponentSchema {
  collectionName: 'components_iap_apple_product_i_ds';
  info: {
    description: '';
    displayName: 'Apple Product IDs';
  };
  attributes: {
    appleProductID: Schema.Attribute.String &
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
      Schema.Attribute.SetMinMaxLength<{
        minLength: 2;
      }>;
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
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
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
      Schema.Attribute.SetMinMaxLength<{
        minLength: 2;
      }>;
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
      'stripe.stripe-legacy-plans': StripeStripeLegacyPlans;
      'stripe.stripe-plan-choices': StripeStripePlanChoices;
      'stripe.stripe-promo-codes': StripeStripePromoCodes;
    }
  }
}
