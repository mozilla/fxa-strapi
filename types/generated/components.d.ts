import type { Schema, Struct } from '@strapi/strapi';

export interface AccountsEmailConfig extends Struct.ComponentSchema {
  collectionName: 'components_accounts_email_configs';
  info: {
    displayName: 'EmailConfig';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    headline: Schema.Attribute.Text & Schema.Attribute.Required;
    subject: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AccountsFeatureFlags extends Struct.ComponentSchema {
  collectionName: 'components_accounts_feature_flags';
  info: {
    displayName: 'FeatureFlags';
  };
  attributes: {
    syncConfirmedPageHideCTA: Schema.Attribute.Boolean;
    syncHidePromoAfterLogin: Schema.Attribute.Boolean;
  };
}

export interface AccountsImage extends Struct.ComponentSchema {
  collectionName: 'components_accounts_images';
  info: {
    displayName: 'Image';
  };
  attributes: {
    altText: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AccountsPageConfig extends Struct.ComponentSchema {
  collectionName: 'components_accounts_page_configs';
  info: {
    displayName: 'PageConfig';
  };
  attributes: {
    description: Schema.Attribute.Text;
    headline: Schema.Attribute.String & Schema.Attribute.Required;
    logoAltText: Schema.Attribute.String;
    logoUrl: Schema.Attribute.String;
    pageTitle: Schema.Attribute.String;
    primaryButtonText: Schema.Attribute.String & Schema.Attribute.Required;
    primaryImage: Schema.Attribute.Component<'accounts.image', false>;
    splitLayout: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface AccountsShared extends Struct.ComponentSchema {
  collectionName: 'components_accounts_shareds';
  info: {
    description: '';
    displayName: 'Shared';
  };
  attributes: {
    additionalAccessibilityInfo: Schema.Attribute.String;
    backgrounds: Schema.Attribute.Component<
      'accounts.shared-backgrounds',
      false
    >;
    buttonColor: Schema.Attribute.String;
    emailFromName: Schema.Attribute.String;
    emailLogoAltText: Schema.Attribute.String;
    emailLogoUrl: Schema.Attribute.String;
    emailLogoWidth: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'280px'>;
    favicon: Schema.Attribute.String;
    featureFlags: Schema.Attribute.Component<'accounts.feature-flags', false>;
    headerLogoAltText: Schema.Attribute.String;
    headerLogoUrl: Schema.Attribute.String;
    headlineFontSize: Schema.Attribute.Enumeration<
      ['default', 'medium', 'large']
    > &
      Schema.Attribute.DefaultTo<'default'>;
    headlineTextColor: Schema.Attribute.String;
    logoAltText: Schema.Attribute.String;
    logoUrl: Schema.Attribute.String;
    pageTitle: Schema.Attribute.String;
  };
}

export interface AccountsSharedBackgrounds extends Struct.ComponentSchema {
  collectionName: 'components_accounts_shared_backgrounds';
  info: {
    displayName: 'All Background-Related Settings';
  };
  attributes: {
    defaultLayout: Schema.Attribute.String;
    header: Schema.Attribute.String;
    splitLayout: Schema.Attribute.String;
    splitLayoutAltText: Schema.Attribute.String;
  };
}

export interface AccountsTosAndPrivacyNoticeDetails
  extends Struct.ComponentSchema {
  collectionName: 'components_accounts_tos_and_privacy_notice_details';
  info: {
    displayName: 'Tos and Privacy Notice Details';
    icon: 'link';
  };
  attributes: {
    fontSize: Schema.Attribute.Enumeration<['default', 'medium', 'large']> &
      Schema.Attribute.DefaultTo<'default'>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    privacyNoticeLink: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'https://accounts.firefox.com/legal/privacy'>;
    termsOfServiceLink: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'https://accounts.firefox.com/legal/terms'>;
  };
}

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
      'accounts.email-config': AccountsEmailConfig;
      'accounts.feature-flags': AccountsFeatureFlags;
      'accounts.image': AccountsImage;
      'accounts.page-config': AccountsPageConfig;
      'accounts.shared': AccountsShared;
      'accounts.shared-backgrounds': AccountsSharedBackgrounds;
      'accounts.tos-and-privacy-notice-details': AccountsTosAndPrivacyNoticeDetails;
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
