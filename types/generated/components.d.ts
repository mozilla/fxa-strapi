import type { Struct, Schema } from '@strapi/strapi';

export interface StripeStripePromoCodes extends Struct.ComponentSchema {
  collectionName: 'components_codes_stripe_promo_codes';
  info: {
    displayName: 'Stripe Promo Codes';
    description: '';
  };
  attributes: {
    PromoCode: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 2;
      }>;
  };
}

export interface StripeStripePlanChoices extends Struct.ComponentSchema {
  collectionName: 'components_stripe_stripe_plan_choices';
  info: {
    displayName: 'Stripe Plan Choices';
    description: '';
  };
  attributes: {
    stripePlanChoice: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 2;
      }>;
  };
}

export interface StripeStripeLegacyPlans extends Struct.ComponentSchema {
  collectionName: 'components_stripe_stripe_legacy_plans';
  info: {
    displayName: 'Stripe Legacy Plans';
    description: '';
  };
  attributes: {
    stripeLegacyPlan: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
  };
}

export interface IapGoogleSkUs extends Struct.ComponentSchema {
  collectionName: 'components_iap_google_s_kuses';
  info: {
    displayName: 'Google SKUs';
    description: '';
  };
  attributes: {
    googleSKU: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 2;
      }>;
  };
}

export interface IapAppleProductIDs extends Struct.ComponentSchema {
  collectionName: 'components_iap_apple_product_i_ds';
  info: {
    displayName: 'Apple Product IDs';
    description: '';
  };
  attributes: {
    appleProductID: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 2;
      }>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'stripe.stripe-promo-codes': StripeStripePromoCodes;
      'stripe.stripe-plan-choices': StripeStripePlanChoices;
      'stripe.stripe-legacy-plans': StripeStripeLegacyPlans;
      'iap.google-sk-us': IapGoogleSkUs;
      'iap.apple-product-i-ds': IapAppleProductIDs;
    }
  }
}
