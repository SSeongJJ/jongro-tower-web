export type ShopCategory = '식음료' | '뷰티' | '패션' | '편의점' | '서비스';

export interface Database {
  public: {
    Tables: {
      shops: {
        Row: {
          id: string;
          name: string;
          category: ShopCategory;
          floor: string;
          hours: string | null;
          phone: string | null;
          location_desc: string | null;
          image_url: string;
          is_recommended: boolean;
          is_active: boolean;
          is_deleted: boolean;
          deleted_at: string | null;
          order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: ShopCategory;
          floor: string;
          hours?: string | null;
          phone?: string | null;
          location_desc?: string | null;
          image_url: string;
          is_recommended?: boolean;
          is_active?: boolean;
          is_deleted?: boolean;
          deleted_at?: string | null;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: ShopCategory;
          floor?: string;
          hours?: string | null;
          phone?: string | null;
          location_desc?: string | null;
          image_url?: string;
          is_recommended?: boolean;
          is_active?: boolean;
          is_deleted?: boolean;
          deleted_at?: string | null;
          order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      notices: {
        Row: {
          id: string;
          title: string;
          content: string;
          is_pinned: boolean;
          view_count: number;
          image_urls: string[];
          is_deleted: boolean;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          is_pinned?: boolean;
          view_count?: number;
          image_urls?: string[];
          is_deleted?: boolean;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          is_pinned?: boolean;
          view_count?: number;
          image_urls?: string[];
          is_deleted?: boolean;
          deleted_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      floor_maps: {
        Row: {
          id: string;
          floor: string;
          image_url: string;
          uploaded_at: string;
        };
        Insert: {
          id?: string;
          floor: string;
          image_url: string;
          uploaded_at?: string;
        };
        Update: {
          id?: string;
          floor?: string;
          image_url?: string;
          uploaded_at?: string;
        };
        Relationships: [];
      };
      slides: {
        Row: {
          id: string;
          image_url: string;
          link_url: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          image_url: string;
          link_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          image_url?: string;
          link_url?: string | null;
          display_order?: number;
          is_active?: boolean;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      shop_category: ShopCategory;
    };
  };
}
