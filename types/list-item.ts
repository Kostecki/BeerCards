// Straight from https://api.untappd.com/v4/custom_lists/view/{list-id}

type ListItem = {
  created_at: string;
  item_id: number;
  beer: Beer;
  brewery: Brewery;
  quantity: number;
  container: Container;
};

type Beer = {
  bid: number;
  beer_name: string;
  beer_label: string;
  beer_label_hd: string;
  beer_abv: number;
  beer_ibu: number;
  beer_description: string;
  beer_style: string;
  is_in_production: number;
  beer_slug: string;
  rating_count: number;
  rating_score: number;
  brewery: Brewery;
  beer_active: number;
};

type Brewery = {
  brewery_id: number;
  brewery_name: string;
  brewery_slug: string;
  brewery_type: string;
  brewery_page_url: string;
  brewery_label: string;
  country_name: string;
  contact: {
    twitter: string;
    facebook: string;
    url: string;
  };
  location: {
    brewery_city: string;
    brewery_state: string;
    lat: number;
    lng: number;
  };
  brewery_description: string;
};

type Container = {
  container_id: number;
  container_name: string;
  container_image_url: string;
};
